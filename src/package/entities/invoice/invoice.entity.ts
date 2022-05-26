import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { StringToNumericTransformer } from '../../transformers/string-to-numeric.transformer';
import { InvoiceDetailsEntity } from './invoice-details.entity';
import { ClientEntity } from '../client/client.entity';

@Entity({ name: 'invoices' })
export class InvoiceEntity extends CustomBaseEntity {
  @Column({
    type: 'date',
    name: 'order_date',
    nullable: false,
  })
  orderDate: Date | string;

  @Column({
    type: 'date',
    name: 'shipping_date',
    nullable: false,
  })
  shippingDate: Date | string;

  @Column({ type: 'varchar', name: 'platform', length: 255 })
  platform: string;

  @Column({
    type: 'decimal',
    name: 'total_tp',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  totalTP: number;

  @Column({
    type: 'decimal',
    name: 'total_mrp',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  totalMRP: number;

  @Column({
    type: 'decimal',
    name: 'total_commission',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  totalCommission: number;

  @Column({
    type: 'decimal',
    name: 'others',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  others: number;

  @Column({
    type: 'decimal',
    name: 'total_profit',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  totalProfit: number;

  @OneToMany(
    () => InvoiceDetailsEntity,
    (invoiceDetailsEntity) => invoiceDetailsEntity.invoice,
  )
  @JoinColumn({ name: 'invoice_id' })
  invoiceDetails: InvoiceDetailsEntity[];

  @ManyToOne(() => ClientEntity, (clientEntity) => clientEntity.invoices)
  @JoinColumn({ name: 'client_id' })
  client: ClientEntity;
}
