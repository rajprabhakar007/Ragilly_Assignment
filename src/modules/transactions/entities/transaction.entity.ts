import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Tenant } from '../../tenants/entities/tenant.entity';
import { Account } from '../../accounts/entities/account.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenant_id: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'from_account_id' })
  from_account: Account;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'to_account_id' })
  to_account: Account;

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
  })
  amount: number;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @ManyToOne(() => Tenant, (tenant) => tenant.transactions)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}