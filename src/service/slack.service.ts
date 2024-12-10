import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { QuestionService } from './question.service';

@Injectable()
export class SlackService {
  private slackWebhookUrl: string;
  private slackBotToken: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly questionService: QuestionService,
  ) {
    this.slackWebhookUrl = this.configService.get<string>('SLACK_WEBHOOK_URL');
    this.slackBotToken = this.configService.get<string>('SLACK_BOT_TOKEN');
  }

  async postMessageToSlack(message: any): Promise<void> {
    try {
      await axios.post(this.slackWebhookUrl, message);
      console.log('Message sent to Slack');
    } catch (error) {
      console.error('Error sending message to Slack:', error.message);
    }
  }

  async sendEphemeralMessage(channelId: string, userId: string, text: any) {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.postEphemeral',
        {
          channel: channelId,
          user: userId,
          blocks: text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.slackBotToken}`,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async openModal(triggerId: string, modalView: any) {
    const newModalView = await this.attachQuestionBlocks(modalView);

    try {
      const response = await axios.post(
        'https://slack.com/api/views.open',
        {
          trigger_id: triggerId,
          view: newModalView,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.slackBotToken}`,
          },
        },
      );
    } catch (error) {
      console.error('Error opening modal:', error.message);
    }
  }

  async attachQuestionBlocks(modalView: any) {
    const questions = await this.questionService.getAllQuestions();

    const newModalView = {
      ...modalView,
      callback_id: `modal_${Date.now()}`,
    };

    questions.map((question) => {
      newModalView.blocks.push({
        type: 'input',
        block_id: String(question.id),
        element: {
          type: 'plain_text_input',
          action_id: String(question.id),
        },
        label: {
          type: 'plain_text',
          text: String(question.question),
        },
      });
    });

    return newModalView;
  }
}
