import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TcStatus } from '../../types/tasks';
import { TcItem } from './TcItem.entity';
import { UserCompanyProfile } from './UserCompanyProfile.entity';

/**
 * Task Center Items' Statuses
 */
@Entity()
export class TcItemStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TcItem, (tcItem) => tcItem.tcItemStatus)
  @JoinColumn({ name: 'tc_item_id' })
  tcItem: TcItem;

  @Column({ enum: Object.values(TcStatus) })
  status: TcStatus;

  @Column({ type: 'timestamptz', name: 'created_at', default: 'NOW()' })
  createdAt: Date;

  @ManyToOne(() => UserCompanyProfile, { nullable: true })
  @JoinColumn()
  createdBy?: UserCompanyProfile;
}
