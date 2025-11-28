import type { User, InsertUser, Transaction, InsertTransaction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Transactions
  getTransaction(id: string): Promise<Transaction | undefined>;
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  
  // Balances
  getBalance(userId: string): Promise<number>;
  getTotalOwed(): Promise<number>;
  getTotalOwedToYou(isCurrentUser: boolean): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private transactions: Map<string, Transaction>;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.initializeDefaults();
  }

  private initializeDefaults() {
    // Add default current user
    const currentUser: User = { id: 'current', name: 'You', avatar: 'lorelei', balance: 0, isGroup: false };
    this.users.set('current', currentUser);

    // Add sample users
    const sampleUsers: User[] = [
      { id: '1', name: 'Alex', avatar: 'adventurer', balance: 45.5, isGroup: false },
      { id: '2', name: 'Sarah', avatar: 'avataaars', balance: -32.0, isGroup: false },
      { id: '3', name: 'Mike', avatar: 'bottts', balance: 120.0, isGroup: false },
      { id: '4', name: 'Emma', avatar: 'big-smile', balance: -15.5, isGroup: false },
      { id: '5', name: 'Chris', avatar: 'micah', balance: 0, isGroup: false },
      { id: 'g1', name: 'Poker Night', avatar: 'initials', balance: 0, isGroup: true, members: ['1', '2', '3'] },
      { id: 'g2', name: 'Roommates', avatar: 'initials', balance: 0, isGroup: true, members: ['2', '4', '5'] },
    ];
    
    sampleUsers.forEach(user => this.users.set(user.id, user));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `u${Date.now()}`;
    const user: User = { ...insertUser, id, balance: 0 };
    this.users.set(id, user);
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  async getTransaction(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = `t${Date.now()}`;
    const transaction: Transaction = { ...insertTransaction, id } as Transaction;
    this.transactions.set(id, transaction);

    // Update user balances
    transaction.involvedUsers.forEach(({ userId, amount }) => {
      const user = this.users.get(userId);
      if (user) {
        const newBalance = this.roundAmount(user.balance + amount);
        this.users.set(userId, { ...user, balance: newBalance });
      }
    });

    return transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const transaction = this.transactions.get(id);
    if (!transaction) return;

    // Reverse user balance changes
    transaction.involvedUsers.forEach(({ userId, amount }) => {
      const user = this.users.get(userId);
      if (user) {
        const newBalance = this.roundAmount(user.balance - amount);
        this.users.set(userId, { ...user, balance: newBalance });
      }
    });

    this.transactions.delete(id);
  }

  async getBalance(userId: string): Promise<number> {
    const user = this.users.get(userId);
    return user?.balance ?? 0;
  }

  async getTotalOwed(): Promise<number> {
    const total = Array.from(this.users.values())
      .filter(u => u.balance < 0 && !u.isGroup)
      .reduce((sum, u) => sum + Math.abs(u.balance), 0);
    return this.roundAmount(total);
  }

  async getTotalOwedToYou(isCurrentUser: boolean): Promise<number> {
    const total = Array.from(this.users.values())
      .filter(u => u.balance > 0 && !u.isGroup)
      .reduce((sum, u) => sum + u.balance, 0);
    return this.roundAmount(total);
  }

  private roundAmount(amount: number): number {
    return Math.round(amount * 10) / 10;
  }
}

export const storage = new MemStorage();
