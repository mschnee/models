import { Check, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CompanyUserRole, HoneyUserAccessRole, HoneyUserRole } from '../../types/roles';
import { Company } from './Company.entity';

/**
 * User Company Profiles
 *
 * Mapped to Mongodb User records
 */
@Entity()
export class UserCompanyProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 24, name: 'mng_user_id' })
  @Check("decode(mng_user_id::text, 'hex'::text) > '\x30'::bytea")
  @Index({ unique: true })
  mngUser: string;

  @ManyToOne(() => Company, (company) => company.userCompanyProfile)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'jsonb', default: null })
  roles: Array<CompanyUserRole | HoneyUserRole | HoneyUserAccessRole>;
}
