import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { QuestionService } from './question.service';

@Injectable()
export class SlackService {
  private slackWebhookUrl =
    'https://hooks.slack.com/services/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';

  constructor(private readonly questionService: QuestionService) {}

  async postMessageToSlack(message: any): Promise<void> {
    try {
      await axios.post(this.slackWebhookUrl, message);
      console.log('Message sent to Slack');
    } catch (error) {
      console.error('Error sending message to Slack:', error.message);
    }
  };

  async sendEphemeralMessage(channelId: string, userId: string, text: any) {
    try {
      const response = await axios.post(
        'https://slack.com/api/chat.postEphemeral',
        {
          channel: channelId,
          user: userId,
          blocks: text
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              'Bearer xoxb-8125798911861-8128669828306-34FeiCY3ScXlPuMjZve3HK1N',
          },
        },
      )
    } catch(error) {
      console.log(error);
    };
  };

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
            Authorization:
              'Bearer xoxb-8125798911861-8128669828306-34FeiCY3ScXlPuMjZve3HK1N',
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
      blocks: [], 
      callback_id: `modal_${Date.now()}`, 
    };

    questions.map((question) => {
      newModalView.blocks.push(
        {
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
        }
      );
    });

    return newModalView;
  }
}
