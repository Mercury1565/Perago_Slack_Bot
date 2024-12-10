import { InjectRepository } from "@nestjs/typeorm";
import { Question } from "src/entity/question.entity";
import { Repository } from "typeorm";

export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>
    ) {}

    async createQuestion(questionDto: any) {
        const question = this.questionRepository.create(questionDto)
        await this.questionRepository.insert(question)
    }

    async getAllQuestions(): Promise<Question[]> {
        return await this.questionRepository.find();
    }
}