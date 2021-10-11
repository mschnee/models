import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TcItemMeta } from '../../types/tasks';
import { Company } from './Company.entity';

/**
 * Cache for SFDC Cases
 */
@Entity()
export class TcCacheCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 18, name: 'sfdc_case_id' })
  @Index()
  sfdcCase: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  meta?: TcItemMeta[];

  @Column({ type: 'timestamptz', name: 'created_at', default: 'NOW()' })
  createdAt: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
