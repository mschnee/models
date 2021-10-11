import { Trim } from 'class-sanitizer';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CallKind {
  @PrimaryGeneratedColumn()
  id: number;

  @Trim()
  @Column({ length: 32 })
  @Index({ unique: true })
  kind: string;

  @Trim()
  @Column({ nullable: true })
  @Index()
  description?: string;
}
