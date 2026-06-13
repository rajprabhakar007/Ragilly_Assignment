import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { AccountsService } from './accounts.service';

import { CreateAccountDto } from './dto/create-account.dto';

import { UpdateAccountDto } from './dto/update-account.dto';

import { Headers, } from '@nestjs/common';

import { Roles }
from '../../common/decorators/roles.decorator';

import { UserRole }
from '../../common/enums/user-role.enum';



@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(
    @Headers('tenant-id') 
    tenantId: string,
    @Body()
    createAccountDto: CreateAccountDto,
  ) {
    return await this.accountsService.create(
      createAccountDto,
      tenantId,
    );
  }

  @Get()
  async findAll() {
    return await this.accountsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    return await this.accountsService.findOne(
      id,
    );
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id')
    id: string,

    @Body()
    updateAccountDto: UpdateAccountDto,
  ) {
    return await this.accountsService.update(
      id,
      updateAccountDto,
    );
  }

}

