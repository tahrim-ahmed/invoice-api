import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { ProductEntity } from '../product/product.entity';

@Entity({ name: 'stock' })
export class StockEntity extends CustomBaseEntity {
  @Column({ type: 'integer', name: 'quantity', nullable: false })
  quantity: number;

  @OneToOne(
    () => ProductEntity,
    (productEntity) => productEntity.invoiceDetails,
  )
  @JoinColumn({ name: 'product_id' })
  product: ProductEntity;
}
