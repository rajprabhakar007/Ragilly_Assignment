import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { TransactionsService } from './transactions.service';

import { CreateTransactionDto } from './dto/create-transaction.dto';

import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { Headers, } from '@nestjs/common';

import { Roles }
from '../../common/decorators/roles.decorator';

import { UserRole }
from '../../common/enums/user-role.enum';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
  ) {}

  @Roles(UserRole.ADMIN)
  @Post()
  async create(
     @Headers('tenant-id') 
        tenantId: string,
    @Body()
    createTransactionDto: CreateTransactionDto,
  ) {
    return await this.transactionsService.create(
      createTransactionDto,
      tenantId,
    );
  }

  @Get()
  async findAll() {
    return await this.transactionsService.findAll();
  }

  @Get(':id')
  async findOne(
    @Param('id')
    id: string,
  ) {
    return await this.transactionsService.findOne(
      id,
    );
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id')
    id: string,

    @Body()
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.transactionsService.update(
      id,
      updateTransactionDto,
    );
  }
}

