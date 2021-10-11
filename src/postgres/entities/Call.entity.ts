import { Trim } from 'class-sanitizer';
import { Check, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CallDisposition, CallStatus } from '../../types/calls';
import { CallType } from '../../types/calls/CallType';
import { CallKind } from './CallKind.entity';
import { CallNote } from './CallNote.entity';

@Entity()
export class Call {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'false', name: 'is_from_migration' })
  fromMigration?: boolean;

  @Column({ name: 'original_call_id', nullable: true })
  originalCallId?: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  @Index()
  createdAt: Date;

  @Column({ type: 'char', length: 24, name: 'created_by_oid', nullable: true })
  @Check("decode(created_by_oid::text, 'hex'::text) > '\x30'::bytea")
  createdByUserMongoId?: string;

  @Column({ type: 'char', length: 24, name: 'invitee_oid', nullable: true })
  @Check("decode(invitee_oid::text, 'hex'::text) > '\x30'::bytea")
  inviteeUserMongoId?: string;

  @Column({ type: 'char', length: 24, name: 'host_oid', nullable: true })
  @Check("decode(host_oid::text, 'hex'::text) > '\x30'::bytea")
  hostUserMongoId?: string;

  @Column({ type: 'char', length: 24, name: 'company_oid', nullable: true })
  @Check("decode(company_oid::text, 'hex'::text) > '\x30'::bytea")
  @Index()
  companyMongoId: string;

  @Column({ name: 'invitee_email', nullable: true })
  inviteeEmail?: string;

  @Column({ name: 'calendly_id', nullable: true })
  calendlyId?: string;

  @Trim()
  @Column({ name: 'invitee_calendly_id', nullable: true })
  inviteeCalendlyId?: string;

  @Column({ type: 'timestamptz', name: 'call_scheduled_for', nullable: true })
  callScheduledFor: Date;

  @ManyToOne((type) => CallKind)
  @JoinColumn({ name: 'call_kind_id' })
  callKind: CallKind;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ enum: Object.values(CallType) })
  @Index()
  type: CallType;

  @Column({ enum: Object.values(CallDisposition), nullable: true })
  disposition?: CallDisposition;

  @Column({ type: 'timestamptz', name: 'updated_at', default: 'NOW()' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @OneToMany((type) => CallNote, (note) => note.call)
  notes: CallNote[];

  @Column({ enum: Object.values(CallStatus), nullable: true })
  status?: CallStatus;
}
