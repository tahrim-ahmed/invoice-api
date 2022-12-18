import { Column, Entity } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';
import { StringToNumericTransformer } from '../../transformers/string-to-numeric.transformer';

@Entity({ name: 'statements' })
export class StatementEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'purpose', length: 255 })
  purpose: string;

  @Column({
    type: 'decimal',
    name: 'amount',
    precision: 20,
    scale: 6,
    default: () => "'0.000000'",
    transformer: new StringToNumericTransformer(),
  })
  amount: number;

  @Column({
    type: 'varchar',
    name: 'reference_id',
    length: 255,
    nullable: true,
  })
  referenceID: string;
}
