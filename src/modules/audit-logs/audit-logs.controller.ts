import {
  Controller,
  Get,
  Headers,
  Query,
} from '@nestjs/common';

import { AuditLogsService } from './audit-logs.service';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Get()
  async findAll(
    @Headers('tenant-id')
    tenantId: string,

    @Query('entity')
    entity?: string,

    @Query('from')
    from?: string,
  ) {
    return await this.auditLogsService.findAll(
      tenantId,
      entity,
      from,
    );
  }
}