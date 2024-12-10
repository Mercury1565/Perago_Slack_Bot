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
            text: '*When:*\nAug 10, 2027',
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
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: `Update Today's Report`,
            },
            style: 'primary',
            value: 'update_button_click',
            action_id: 'update_button',
          },
        ],
      },
    ],
  };

  export const modalView = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Daily Report',
    },
    blocks: [],
    submit: {
      type: 'plain_text',
      text: 'Submit',
    },
  };