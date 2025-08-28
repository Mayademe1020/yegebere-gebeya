import TelegramBot from 'node-telegram-bot-api';

const botToken = process.env.TELEGRAM_BOT_TOKEN;

export class TelegramService {
  private static bot: TelegramBot | null = null;

  private static getBot(): TelegramBot | null {
    if (!botToken) {
      console.error('Telegram bot token not configured');
      return null;
    }

    if (!this.bot) {
      this.bot = new TelegramBot(botToken, { polling: false });
    }

    return this.bot;
  }

  // Send OTP via Telegram (fallback method)
  static async sendOTPViaTelegram(phoneNumber: string, otp: string): Promise<boolean> {
    try {
      const bot = this.getBot();
      if (!bot) return false;

      // In a real implementation, you would need to:
      // 1. Have users register their Telegram chat ID with their phone number
      // 2. Store this mapping in your database
      // 3. Look up the chat ID based on phone number
      
      // For now, this is a placeholder implementation
      console.log(`Would send Telegram OTP ${otp} to phone ${phoneNumber}`);
      
      // Example of how to send a message (you need the chat ID):
      // await bot.sendMessage(chatId, `የእርስዎ የማረጋገጫ ኮድ: ${otp}\nYour verification code: ${otp}`);
      
      return true;
    } catch (error) {
      console.error('Failed to send Telegram OTP:', error);
      return false;
    }
  }

  // Set up webhook for receiving messages (for production)
  static async setupWebhook(webhookUrl: string): Promise<boolean> {
    try {
      const bot = this.getBot();
      if (!bot) return false;

      await bot.setWebHook(webhookUrl);
      console.log('Telegram webhook set up successfully');
      return true;
    } catch (error) {
      console.error('Failed to set up Telegram webhook:', error);
      return false;
    }
  }

  // Handle incoming Telegram messages
  static async handleWebhookUpdate(update: any): Promise<void> {
    try {
      const bot = this.getBot();
      if (!bot) return;

      if (update.message) {
        const chatId = update.message.chat.id;
        const text = update.message.text;
        const phoneNumber = update.message.contact?.phone_number;

        // Handle phone number sharing for OTP fallback
        if (phoneNumber) {
          // Store the mapping between phone number and chat ID
          // This would be saved to your database
          console.log(`User shared phone number: ${phoneNumber}, chat ID: ${chatId}`);
          
          await bot.sendMessage(chatId, 'ስልክ ቁጥርዎ በተሳካ ሁኔታ ተመዝግቧል! Phone number registered successfully!');
        }

        // Handle other commands
        if (text === '/start') {
          await bot.sendMessage(chatId, 
            'እንኳን ወደ የገበሬ ገበያ በደህና መጡ!\nWelcome to Yegebere Gebeya!\n\nPlease share your phone number to receive OTP codes.',
            {
              reply_markup: {
                keyboard: [[{ text: 'Share Phone Number', request_contact: true }]],
                one_time_keyboard: true,
                resize_keyboard: true
              }
            }
          );
        }
      }
    } catch (error) {
      console.error('Error handling Telegram update:', error);
    }
  }
}
