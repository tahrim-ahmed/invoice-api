import { Column, Entity, Index } from 'typeorm';
import { CustomBaseEntity } from '../core/custom-base.entity';

@Entity({ name: 'purposes' })
@Index('purposes-name-deletedat-idx', ['name', 'deletedAt'])
export class PurposeEntity extends CustomBaseEntity {
  @Column({ type: 'varchar', name: 'name', length: 65 })
  @Index('purpose-name-idx', { unique: false })
  name: string;
}
