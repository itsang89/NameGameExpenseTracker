import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { signUp, signIn, signOut, getCurrentUser } from "./supabase";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ==================== USERS ====================
  
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // ==================== TRANSACTIONS ====================

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getTransaction(req.params.id);
      if (!transaction) {
        res.status(404).json({ error: "Transaction not found" });
        return;
      }
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transaction" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      
      // Validate game scores sum to 0 if type is game
      if (data.type === 'game') {
        const total = data.involvedUsers.reduce((sum, u) => sum + u.amount, 0);
        if (Math.abs(total) > 0.1) {
          res.status(400).json({ error: "Game scores must sum to 0" });
          return;
        }
      }

      const transaction = await storage.createTransaction(data);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
        return;
      }
      res.status(500).json({ error: "Failed to create transaction" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      await storage.deleteTransaction(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  // ==================== BALANCES & ANALYTICS ====================

  app.get("/api/balance/:userId", async (req, res) => {
    try {
      const balance = await storage.getBalance(req.params.userId);
      res.json({ userId: req.params.userId, balance });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const transactions = await storage.getAllTransactions();
      const totalOwed = await storage.getTotalOwed();
      const totalOwedToYou = await storage.getTotalOwedToYou(true);
      
      // Calculate leaderboard
      const leaderboard = users
        .filter(u => !u.isGroup)
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 10);

      // Count games by type
      const gameStats = {
        poker: transactions.filter(t => t.type === 'game' && t.gameType === 'poker').length,
        mahjong: transactions.filter(t => t.type === 'game' && t.gameType === 'mahjong').length,
        blackjack: transactions.filter(t => t.type === 'game' && t.gameType === 'blackjack').length,
      };

      res.json({
        totalOwed,
        totalOwedToYou,
        leaderboard,
        gameStats,
        totalTransactions: transactions.length,
        lastGame: transactions.find(t => t.type === 'game'),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // ==================== SETTLE UP ====================

  app.post("/api/settle", async (req, res) => {
    try {
      const { userId, amount } = req.body;
      
      if (!userId || amount === undefined) {
        res.status(400).json({ error: "userId and amount required" });
        return;
      }

      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      // Create payment transaction
      const isOwedToYou = user.balance > 0;
      const transaction = await storage.createTransaction({
        type: 'payment',
        title: isOwedToYou ? `${user.name} paid you` : `You paid ${user.name}`,
        date: new Date().toISOString().split('T')[0],
        totalAmount: Math.abs(amount),
        involvedUsers: [
          { userId: 'current', amount: isOwedToYou ? amount : -amount },
          { userId, amount: isOwedToYou ? -amount : amount }
        ],
      });

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ error: "Failed to settle up" });
    }
  });

  // ==================== AUTHENTICATION ====================

  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      if (!email || !password || !fullName) {
        res.status(400).json({ error: "email, password, and fullName required" });
        return;
      }

      const data = await signUp(email, password, fullName);
      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Sign up failed" });
    }
  });

  app.post("/api/auth/signin", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(400).json({ error: "email and password required" });
        return;
      }

      const data = await signIn(email, password);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(401).json({ error: error.message || "Sign in failed" });
    }
  });

  app.post("/api/auth/signout", async (req, res) => {
    try {
      await signOut();
      res.json({ success: true });
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Sign out failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await getCurrentUser();
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  return httpServer;
}
