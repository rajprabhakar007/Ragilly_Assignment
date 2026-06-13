
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  DataSource,
  Repository,
} from 'typeorm';

import { Tenant }
from '../../modules/tenants/entities/tenant.entity';

@Injectable()
export class TenantMiddleware
  implements NestMiddleware {

  constructor(

    @InjectRepository(Tenant)
    private tenantRepository:
      Repository<Tenant>,

    private dataSource: DataSource,
  ) {}

  async use(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {

    const tenantId =
      req.headers['tenant-id'] as string;

    /*
      SKIP TENANTS API
    */

    if (
      req.originalUrl.includes(
        '/tenants',
      )
    ) {
      return next();
    }

    /*
      TENANT HEADER REQUIRED
    */

    if (!tenantId) {

      throw new BadRequestException(
        'tenant-id header missing',
      );
    }

    /*
      VALIDATE TENANT
    */

    const tenant =
      await this.tenantRepository.findOne({
        where: {
          id: tenantId,
        },
      });

    if (!tenant) {

      throw new BadRequestException(
        'Invalid tenant',
      );
    }

    /*
      CHECK TENANT STATUS
    */

    if (!tenant.is_active) {

      throw new BadRequestException(
        'Tenant is inactive',
      );
    }

    /*
      SET POSTGRES SESSION VARIABLE
      FOR RLS
    */

    await this.dataSource.query(
      `SET app.tenant_id = '${tenantId}'`,
    );

    next();
  }
}

