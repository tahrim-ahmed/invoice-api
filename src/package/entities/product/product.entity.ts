import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { InvoiceDetailsEntity } from '../invoice/invoice-details.entity';
import { StockEntity } from '../stock/stock.entity';

@Entity({ name: 'products' })
@Index('products-name-deletedat-idx', ['name', 'deletedAt'])
export class ProductEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'code', length: 65 })
  @Index('products-name-idx', { unique: false })
  name: string;

  @Column({ type: 'varchar', name: 'pack', length: 65 })
  packSize: string;

  @OneToMany(
    () => InvoiceDetailsEntity,
    (invoiceDetailsEntity) => invoiceDetailsEntity.product,
  )
  @JoinColumn({ name: 'product_id' })
  invoiceDetails: InvoiceDetailsEntity[];

  @OneToOne(() => StockEntity, (stockEntity) => stockEntity.product)
  @JoinColumn({ name: 'product_id' })
  stock: StockEntity[];
}
