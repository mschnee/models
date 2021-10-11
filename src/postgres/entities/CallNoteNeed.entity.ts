import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Call } from './Call.entity';
import { CallNote } from './CallNote.entity';

@Entity()
export class CallNoteNeed {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'mongo_oid', nullable: true })
  @Index()
  originalMongoId?: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Call, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'call_id' })
  call: Call;

  @ManyToOne(() => CallNote, (note) => note.needs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'call_note_id' })
  note: CallNote;
}
