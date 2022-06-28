import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { StringToNumericTransformer } from '../../transformers/string-to-numeric.transformer';
import { PurchaseEntity } from './purchase.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'purchase_details' })
export class PurchaseDetailsEntity extends CustomBaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: false })
  quantity: number;

  @Column({
    type: 'decimal',
    name: 'unit_price',
    precision: 20,
    scale: 6,
    nullable: false,
    transformer: new StringToNumericTransformer(),
  })
  unitPrice: number;

  @ManyToOne(
    () => ProductEntity,
    (productEntity) => productEntity.purchaseDetails,
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;

  @ManyToOne(
    () => PurchaseEntity,
    (purchaseEntity) => purchaseEntity.purchaseDetails,
  )
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchaseEntity;
}
