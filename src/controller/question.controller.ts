import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionService } from 'src/service/question.service';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

    @Post('create')
    async createQuestion(@Body() questionDto: any) {
        await this.questionService.createQuestion(questionDto);
    };

    @Get('get-all')
    async getQuestions() {
        return await this.questionService.getAllQuestions();
    } 
}
