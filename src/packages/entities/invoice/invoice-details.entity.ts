import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { StringToNumericTransformer } from '../../transformers/string-to-numeric.transformer';
import { InvoiceEntity } from './invoice.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'invoice_details' })
export class InvoiceDetailsEntity extends CustomBaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: false })
  quantity: number;

  @Column({
    type: 'decimal',
    name: 'unit_tp',
    precision: 20,
    scale: 6,
    nullable: false,
    transformer: new StringToNumericTransformer(),
  })
  unitTP: number;

  @Column({
    type: 'decimal',
    name: 'unit_mrp',
    precision: 20,
    scale: 6,
    nullable: false,
    transformer: new StringToNumericTransformer(),
  })
  unitMRP: number;

  @Column({
    type: 'decimal',
    name: 'discount',
    precision: 20,
    scale: 6,
    nullable: false,
    transformer: new StringToNumericTransformer(),
  })
  discount: number;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.invoiceDetails,
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(
    () => InvoiceEntity,
    (invoiceEntity) => invoiceEntity.invoiceDetails,
  )
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;
}
