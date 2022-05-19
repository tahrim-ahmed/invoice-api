import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { InvoiceEntity } from '../invoice/invoice.entity';

@Entity({ name: 'clients' })
@Index('clients-code-deletedat-idx', ['code', 'deletedAt'])
@Index('clients-name-deletedat-idx', ['name', 'deletedAt'])
@Index('clients-email-deletedat-idx', ['email', 'deletedAt'])
@Index('clients-cell-deletedat-idx', ['cell', 'deletedAt'])
export class ClientEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'code', length: 65 })
  @Index('clients-code-idx', { unique: false })
  code: string;

  @Column({ type: 'varchar', name: 'name', length: 65 })
  name: string;

  @Column({ type: 'varchar', name: 'email', length: 100 })
  email: string;

  @Column({ type: 'varchar', name: 'cell', length: 20, nullable: true })
  cell: string;

  @Column({ type: 'text', name: 'billing' })
  billing: string;

  @Column({ type: 'text', name: 'shipping' })
  shipping: string;

  @OneToMany(() => InvoiceEntity, (invoiceEntity) => invoiceEntity.client)
  @JoinColumn({ name: 'client_id' })
  invoices: InvoiceEntity[];
}
