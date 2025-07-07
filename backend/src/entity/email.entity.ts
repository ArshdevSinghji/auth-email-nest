import { Entity, Column, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Email {
  @PrimaryColumn()
  email: string;

  @Column({ nullable: true })
  verificationCode: number;

  @Column({ default: false })
  isVerified: boolean;

  @OneToOne(() => User, (user) => user.emailDetails)
  user: User;
}
