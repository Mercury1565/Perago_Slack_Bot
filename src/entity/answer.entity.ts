import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Question } from './question.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    answer: string;

    @CreateDateColumn()
    timestamp: Date;

    @ManyToOne(() => User, (user) => user.responses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question;
}