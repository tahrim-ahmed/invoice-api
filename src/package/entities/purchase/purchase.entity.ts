import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { StringToNumericTransformer } from '../../transformers/string-to-numeric.transformer';
import { PurchaseDetailsEntity } from './purchase-details.entity';

@Entity({ name: 'purchases' })
export class PurchaseEntity extends CustomBaseEntity {
  @Column({
    type: 'date',
    name: 'purchase_date',
    nullable: false,
  })
  purchaseDate: Date | string;

  @Column({
    type: 'decimal',
    name: 'total_price',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  totalPrice: number;

  @Column({
    type: 'varchar',
    length: '100',
    name: 'type',
    nullable: false,
  })
  type: string;

  @OneToMany(
    () => PurchaseDetailsEntity,
    (purchaseDetailsEntity) => purchaseDetailsEntity.purchase,
  )
  @JoinColumn({ name: 'purchase_id' })
  purchaseDetails: PurchaseDetailsEntity[];
}
