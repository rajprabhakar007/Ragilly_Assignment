import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';

import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';

@Injectable()
export class AuditInterceptor
    implements NestInterceptor {
    constructor(
        private auditLogsService: AuditLogsService,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const request =
            context.switchToHttp().getRequest();

        const method = request.method;

        const allowedMethods = [
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
        ];

        if (
            !allowedMethods.includes(method)
        ) {
            return next.handle();
        }

        return next.handle().pipe(
            tap(async (responseData) => {
                let action = '';

                if (method === 'POST') {
                    action = 'CREATE';
                }

                else if (method === 'PUT' || method === 'PATCH') {
                    action = 'UPDATE';
                }

                else if (method === 'DELETE') {
                    action = 'DELETE';
                }

                const entity =
                    request.originalUrl
                        .split('/')[1];


                await this.auditLogsService.create({
                    tenant_id:
                        request.headers['tenant-id'] ||
                        null,

                    user_id:
                        request.headers['x-user-id'] ||
                        null,

                    action,

                    entity,

                    entity_id:
                        responseData?.newData?.id ||
                        responseData?.deletedData?.id ||
                        responseData?.id ||
                        null,

                    old_value:
                        action === 'DELETE'
                            ? responseData?.deletedData
                            : responseData?.oldData || null,

                    new_value:
                        action === 'DELETE'
                            ? null
                            : responseData?.newData ||
                            responseData ||
                            null,
                });


            }),
        );
    }
}