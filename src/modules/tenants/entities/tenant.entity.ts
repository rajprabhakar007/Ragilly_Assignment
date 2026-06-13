import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Account } from '../../accounts/entities/account.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  plan: string;

  @Column({ default: true })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Account, (account) => account.tenant)
  accounts: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.tenant)
  transactions: Transaction[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}