import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Call } from './Call.entity';
import { CallNoteNeed } from './CallNoteNeed.entity';

@Entity()
export class CallNote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mongo_oid', nullable: true })
  @Index()
  originalMongoId?: string;

  @Column({ name: 'user_mongo_oid', nullable: true })
  @Index()
  userMongoId?: string;

  @Column({ default: false })
  pinned: boolean;

  @Column({ nullable: true })
  text?: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  @Index()
  createdAt: Date;

  @ManyToOne(() => Call, (call) => call.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'call_id' })
  call: Call;

  @OneToMany(() => CallNoteNeed, (need) => need.note)
  needs: CallNoteNeed[];
}
