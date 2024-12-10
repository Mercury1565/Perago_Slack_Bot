import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity('slack_users')
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  username: string;

  @Column({ nullable: true })
  lastResponseTime: Date;

  @OneToMany(() => Answer, (answer) => answer.user)
  responses: Response[];
}
