const today = new Date();
const formattedDate = today.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

export const message = {
  blocks: [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: 'Daily Report',
        emoji: true,
      },
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Today's Date:*\n${formattedDate}`,
        },
      ],
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'Write Daily Report',
          },
          style: 'primary',
          value: 'create_button_click',
          action_id: 'create_button',
        },
      ],
    }
  ],
};

export const modalView = {
  type: 'modal',
  title: {
    type: 'plain_text',
    text: 'Create Your Daily Plan',
  },
  submit: {
    type: 'plain_text',
    text: 'Submit',
  },
};