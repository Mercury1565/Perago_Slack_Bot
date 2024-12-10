import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  question: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({nullable: true})
  updatedAt: Date;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}
