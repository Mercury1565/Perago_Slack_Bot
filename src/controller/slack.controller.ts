import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { SlackService } from '../service/slack.service';
import { Request, Response } from 'express';
import { message, modalView } from 'src/messages';
import { Repository } from 'typeorm';
import { Answer } from 'src/entity/answer.entity';
import { QuestionService } from 'src/service/question.service';
import { AnswerService } from 'src/service/answer.service';
import { UserService } from 'src/service/user.service';
@Controller('slack')
export class SlackController {
  constructor(
    private readonly slackService: SlackService,
    private readonly questionService: QuestionService,
    private readonly answerService: AnswerService,
    private readonly userService: UserService,
  ) {}
  private channelId: string;
  @Post('post-message')
  async sendSlackMessage() {
    await this.slackService.postMessageToSlack(message);
  }
  @Post('interactive')
  async handleSlackInteractions(@Req() req: Request, @Res() res: Response) {
    try {
      const payload = JSON.parse(req.body.payload);

      // Handle block actions (button clicks)
      if (payload.type === 'block_actions') {
        res.status(200).send('Interaction received!');
        this.channelId = payload.channel.id;
        
        if (payload.actions[0]?.action_id === 'create_button') {
          const triggerId = payload.trigger_id;
          this.slackService.openModal(triggerId, modalView);
        } else if (payload.actions[0]?.action_id === 'update_button') {
          const triggerId = payload.trigger_id;
          this.slackService.openModal(triggerId, modalView);
        }
      } else if (payload.type === 'view_submission') {
        // Handle modal submission
        const inputs = payload.view.state.values;
        const answers: Partial<Answer>[] = [];
        const questions = await this.questionService.getAllQuestions();

        let user = await this.userService.findOne(payload.user.id);

        if (!user) {
          user = await this.userService.createUser({
            id: payload.user.id,
            username: payload.user.username,
          });
        }
        questions.map((question) => {
          const answer: Partial<Answer> = {
            answer: inputs[question.id][question.id]?.value || '',
            user,
            question,
          };
          answers.push(answer);
        });

        this.userService.updateLastResponseTime(user);
        this.answerService.saveAnswer(answers);

        res.status(200).json({
          response_action: 'clear',
        });

        const isPlanSubmitted = await this.answerService.isPlanSubmitted(payload.user.id);

        if (isPlanSubmitted) {
          await this.slackService.sendEphemeralMessage(
            String(this.channelId),
            String(payload.user.id),
            [
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: 'You have updated your daily plan🎉',
                  emoji: true,
                },
              },
            ],
          );
        } else {
          await this.slackService.sendEphemeralMessage(
            String(this.channelId),
            String(payload.user.id),
            [
              {
                type: 'section',
                text: {
                  type: 'plain_text',
                  text: 'You have successfully submitted your daily plan🎉',
                  emoji: true,
                },
              },
            ],
          );
        }
      }
    } catch (error) {
      console.error('Error handling Slack interaction:', error.message);
      res.status(400).send('Invalid payload');
    }
  }
}
