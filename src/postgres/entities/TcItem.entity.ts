import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TcItemAction, TcItemMeta, TcRole, TcType } from '../../types/tasks';
import { Company } from './Company.entity';
import { TcItemStatus } from './TcItemStatus.entity';
import { UserCompanyProfile } from './UserCompanyProfile.entity';

/**
 * Task Center Items
 */
@Entity()
export class TcItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 18, name: 'sfdc_task_id', nullable: true, default: null })
  @Index()
  sfdcTask?: string;

  @Column({ type: 'char', length: 18, name: 'sfdc_case_id', nullable: true, default: null })
  @Index()
  sfdcCase?: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'char', length: 255 })
  type: TcType | 'unknown';

  @Column({ type: 'jsonb', array: false, nullable: true, default: () => "'[]'" })
  meta?: TcItemMeta[];

  @Column({ type: 'jsonb' })
  actions: TcItemAction[];

  @ManyToOne(() => UserCompanyProfile)
  @JoinColumn({ name: 'owner_id' })
  owner: UserCompanyProfile;

  @ManyToOne(() => UserCompanyProfile)
  @JoinColumn({ name: 'assignee_id' })
  assignee: UserCompanyProfile;

  @Column({ name: 'owner_role', enum: Object.values(TcRole), nullable: true, default: null })
  ownerRole?: TcRole;

  @Column({ name: 'assignee_role', enum: Object.values(TcRole), nullable: true, default: null })
  assigneeRole?: TcRole;

  @OneToMany(() => TcItemStatus, (tcItemStatus) => tcItemStatus.tcItem)
  tcItemStatus: TcItemStatus[];

  @Column({ name: 'sequence', type: 'float' })
  sequence: number;
}
