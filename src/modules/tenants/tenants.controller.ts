import { Body, Controller, Get, Post, Param, Patch, } from '@nestjs/common';

import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) { }

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    return await this.tenantsService.create(createTenantDto);
  }

  @Get()
  async findAll() {
    return await this.tenantsService.findAll();
  }

  @Patch(':id')
  async update(

    @Param('id')
    id: string,

    @Body()
    updateTenantDto: UpdateTenantDto,
  ) {

    return await this.tenantsService.update(
      id,
      updateTenantDto,
    );
  }


}