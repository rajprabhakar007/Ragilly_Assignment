import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';


import { UpdateTenantDto }
  from './dto/update-tenant.dto';

import {
  NotFoundException,
} from '@nestjs/common';



@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) { }

  async create(createTenantDto: CreateTenantDto) {
    const tenant = this.tenantRepository.create(createTenantDto);

    return await this.tenantRepository.save(tenant);
  }

  async findAll() {
    return await this.tenantRepository.find();
  }


  async update(
    id: string,
    updateTenantDto: UpdateTenantDto,
  ) {

    const tenant =
      await this.tenantRepository.findOne({
        where: { id },
      });

    if (!tenant) {
      throw new NotFoundException(
        'Tenant not found',
      );
    }

    Object.assign(
      tenant,
      updateTenantDto,
    );

    return await this.tenantRepository.save(
      tenant,
    );
  }


}