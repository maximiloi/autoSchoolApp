module.exports = {
  apps: [
    {
      name: 'bot-driving-reminders',
      script: 'bot/drivingReminders.js',
      interpreter: 'node',
      cron_restart: '13 11 * * *',
      autorestart: false,
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID,
      },
    },
    {
      name: 'bot-payment-reminders',
      script: 'bot/paymentReminders.js',
      interpreter: 'node',
      cron_restart: '25 14 10,25 * *',
      autorestart: false,
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID,
      },
    },
    {
      name: 'bot-training-reminders',
      script: 'bot/trainingStartReminders.js',
      interpreter: 'node',
      cron_restart: '28 12 * * *',
      autorestart: false,
      env: {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
        TELEGRAM_ADMIN_CHAT_ID: process.env.TELEGRAM_ADMIN_CHAT_ID,
      },
    },
  ],
};
