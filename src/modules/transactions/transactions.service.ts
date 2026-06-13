import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import {
  DataSource,
  Repository,
} from 'typeorm';

import { Transaction } from './entities/transaction.entity';

import { CreateTransactionDto } from './dto/create-transaction.dto';

import { UpdateTransactionDto } from './dto/update-transaction.dto';

import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository:
      Repository<Transaction>,

    @InjectRepository(Account)
    private accountRepository:
      Repository<Account>,

    private dataSource: DataSource,
  ) { }

  async create(
    createTransactionDto: CreateTransactionDto,
    tenantId: string,
  ) {
    return await this.dataSource.transaction(
      async (manager) => {
        const fromAccount =
          await manager.findOne(Account, {
            where: {
              id:
                createTransactionDto.fromAccountId,
            },
          });

        const toAccount =
          await manager.findOne(Account, {
            where: {
              id:
                createTransactionDto.toAccountId,
            },
          });

        if (
          !fromAccount ||
          !toAccount
        ) {
          throw new BadRequestException(
            'Account not found',
          );
        }


        if (
          !fromAccount.is_active ||
          !toAccount.is_active
        ) {
          throw new BadRequestException(
            'Cannot perform transaction on inactive account',
          );
        }



        if (
          Number(fromAccount.balance) <
          createTransactionDto.amount
        ) {
          throw new BadRequestException(
            'Insufficient balance',
          );
        }

        fromAccount.balance =
          Number(fromAccount.balance) -
          createTransactionDto.amount;

        toAccount.balance =
          Number(toAccount.balance) +
          createTransactionDto.amount;

        await manager.save(fromAccount);

        await manager.save(toAccount);

        const transaction =
          manager.create(Transaction, {
            amount:
              createTransactionDto.amount,

            description:
              createTransactionDto.description,

            date:
              createTransactionDto.date,

            tenant_id: tenantId,

            from_account: {
              id:
                createTransactionDto.fromAccountId,
            },

            to_account: {
              id:
                createTransactionDto.toAccountId,
            },
          });

        return await manager.save(
          transaction,
        );
      },
    );
  }

  async findAll() {
    return await this.transactionRepository.find(
      {
        relations: {
          tenant: true,
          from_account: true,
          to_account: true,
        },
      },
    );
  }

  async findOne(id: string) {
    const transaction =
      await this.transactionRepository.findOne({
        where: { id },

        relations: {
          tenant: true,
          from_account: true,
          to_account: true,
        },
      });

    if (!transaction) {
      throw new NotFoundException(
        'Transaction not found',
      );
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.dataSource.transaction(
      async (manager) => {
        const transaction =
          await manager.findOne(Transaction, {
            where: { id },

            relations: {
              from_account: true,
              to_account: true,
            },
          });

        if (!transaction) {
          throw new NotFoundException(
            'Transaction not found',
          );
        }

        const oldData = {
          ...transaction,
        };

        /*
          REVERSE OLD EFFECT
        */

        transaction.from_account.balance =
          Number(
            transaction.from_account.balance,
          ) + Number(transaction.amount);

        transaction.to_account.balance =
          Number(
            transaction.to_account.balance,
          ) - Number(transaction.amount);

        /*
          APPLY NEW DATA
        */

        Object.assign(
          transaction,
          updateTransactionDto,
        );

        /*
          APPLY NEW EFFECT
        */

        transaction.from_account.balance =
          Number(
            transaction.from_account.balance,
          ) - Number(transaction.amount);

        transaction.to_account.balance =
          Number(
            transaction.to_account.balance,
          ) + Number(transaction.amount);

        await manager.save([
          transaction.from_account,
          transaction.to_account,
        ]);

        const updatedTransaction =
          await manager.save(transaction);

        return {
          oldData,

          newData: updatedTransaction,
        };
      },
    );
  }
}

