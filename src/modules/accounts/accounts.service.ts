import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Account } from './entities/account.entity';

import { CreateAccountDto } from './dto/create-account.dto';

import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) { }

  async create(
    createAccountDto: CreateAccountDto,
    tenantId: string,
  ) {
    const account =
      this.accountRepository.create({
        name: createAccountDto.name,

        type: createAccountDto.type,

        balance: createAccountDto.balance,

        tenant_id: tenantId,
      });

    return await this.accountRepository.save(
      account,
    );
  }

  async findAll() {
    return await this.accountRepository.find({
      relations: {
        tenant: true,
      },
    });
  }

  async findOne(id: string) {
    const account =
      await this.accountRepository.findOne({
        where: { id },

        relations: {
          tenant: true,
        },
      });

    if (!account) {
      throw new NotFoundException(
        'Account not found',
      );
    }

    return account;
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
  ) {
    const account =
      await this.findOne(id);

    const oldData = { ...account };

    Object.assign(
      account,
      updateAccountDto,
    );

    const updatedAccount =
      await this.accountRepository.save(
        account,
      );

    return {
      oldData,
      newData: updatedAccount,
    };
  }



}

