import { Module } from '@nestjs/common';
import { SlackController } from './controller/slack.controller';
import { SlackService } from './service/slack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Question } from './entity/question.entity';
import { QuestionController } from './controller/question.controller';
import { AnswerService } from './service/answer.service';
import { QuestionService } from './service/question.service';
import { UserService } from './service/user.service';
import { Answer } from './entity/answer.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),

        ssl: { rejectUnauthorized: false },
        autLoadEntities: true,
        entities: [User, Question, Answer],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([User, Question, Answer]),
  ],
  controllers: [SlackController, QuestionController],
  providers: [SlackService, AnswerService, QuestionService, UserService],
})
export class AppModule {}
