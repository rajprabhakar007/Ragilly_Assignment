import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async create(data: Partial<AuditLog>) {
    const log =
      this.auditRepository.create(data);

    return await this.auditRepository.save(
      log,
    );
  }

  async findAll(
    tenantId: string,
    entity?: string,
    from?: string,
  ) {
    const whereCondition: any = {
      tenant_id: tenantId,
    };

    if (entity) {
      whereCondition.entity = entity;
    }

    if (from) {
      whereCondition.created_at =
        MoreThanOrEqual(new Date(from));
    }

    return await this.auditRepository.find({
      where: whereCondition,

      order: {
        created_at: 'DESC',
      },
    });
  }
}