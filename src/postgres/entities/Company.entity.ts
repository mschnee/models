import { Check, Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserCompanyProfile } from './UserCompanyProfile.entity';

/**
 * Companies
 */
@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'char', length: 24, name: 'mng_company_id' })
  @Check("decode(mng_company_id::text, 'hex'::text) > '\x30'::bytea")
  @Index({ unique: true })
  mngCompany: string;

  @OneToMany(() => UserCompanyProfile, (userCompanyProfile) => userCompanyProfile.company)
  userCompanyProfile: UserCompanyProfile[];

  @OneToOne(() => UserCompanyProfile)
  @JoinColumn({ name: 'owner_id' })
  owner: UserCompanyProfile;
}
