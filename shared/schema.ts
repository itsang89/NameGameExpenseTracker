import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string(),
  balance: z.number(),
  isGroup: z.boolean().optional().default(false),
  members: z.array(z.string()).optional(),
});

export const insertUserSchema = z.object({
  name: z.string().min(1),
  avatar: z.string(),
  isGroup: z.boolean().optional().default(false),
  members: z.array(z.string()).optional(),
});

// Transaction schema
export const transactionUserSchema = z.object({
  userId: z.string(),
  amount: z.number(),
});

export const transactionSchema = z.object({
  id: z.string(),
  type: z.enum(['loan', 'expense', 'game', 'payment']),
  title: z.string(),
  category: z.string().optional(),
  date: z.string(),
  totalAmount: z.number(),
  involvedUsers: z.array(transactionUserSchema),
  notes: z.string().optional(),
  gameType: z.enum(['poker', 'mahjong', 'blackjack']).optional(),
});

export const insertTransactionSchema = z.object({
  type: z.enum(['loan', 'expense', 'game', 'payment']),
  title: z.string().min(1),
  category: z.string().optional(),
  date: z.string(),
  totalAmount: z.number(),
  involvedUsers: z.array(transactionUserSchema),
  notes: z.string().optional(),
  gameType: z.enum(['poker', 'mahjong', 'blackjack']).optional(),
});

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TransactionUser = z.infer<typeof transactionUserSchema>;
export type Transaction = z.infer<typeof transactionSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
