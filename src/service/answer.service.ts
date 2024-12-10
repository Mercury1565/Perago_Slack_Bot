import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/entity/answer.entity';
import { Repository } from 'typeorm';

export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async saveAnswer(answer: Partial<Answer>[]) {
    await this.answerRepository.insert(answer);
  }
}
