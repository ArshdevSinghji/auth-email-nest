import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Email } from './email.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  image: string;

  @OneToOne(() => Email, (email) => email.user, { cascade: true })
  @JoinColumn({ name: 'email', referencedColumnName: 'email' })
  emailDetails: Email;
}
