import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entity/answer.entity';
import { Repository } from 'typeorm';

export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async isPlanSubmitted(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const planExists = await this.answerRepository
      .createQueryBuilder('answer')
      .where('answer.user_id = :userId', { userId })
      .andWhere(
        'answer.createdAt >= :startOfDay AND answer.createdAt < :endOfDay',
        {
          startOfDay: today.toISOString(),
          endOfDay: new Date(
            today.getTime() + 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      )
      .getOne();

    return !!planExists;
  }
  
  async saveAnswer(answer: Partial<Answer>[]) {
    await this.answerRepository.insert(answer);
  }
}
