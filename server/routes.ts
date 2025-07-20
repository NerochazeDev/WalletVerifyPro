import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Wallet verification completion endpoint
  app.post('/api/complete-verification', async (req, res) => {
    try {
      console.log('Wallet verification completed:', req.body);
      const { walletType, connectionMethod } = req.body;
      
      // Log verification completion (without sensitive data)
      console.log(`Verification completed - Wallet: ${walletType}, Method: ${connectionMethod}`);
      
      res.json({ 
        success: true, 
        message: 'Security activation completed successfully' 
      });
    } catch (error) {
      console.error('Verification completion error:', error);
      res.status(500).json({ message: 'Internal server error', error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
