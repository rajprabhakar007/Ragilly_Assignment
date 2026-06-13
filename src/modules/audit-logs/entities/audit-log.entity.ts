import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: true,
  })
  tenant_id: string;

  @Column({
    nullable: true,
  })
  user_id: string;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column()
  entity_id: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  old_value: any;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  new_value: any;

  @CreateDateColumn()
  created_at: Date;
}