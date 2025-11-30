import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type TransactionType = 'loan' | 'expense' | 'game' | 'payment';

export interface User {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  isGroup?: boolean;
  members?: string[];
}

export interface TransactionUser {
  userId: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  category?: string;
  date: string;
  totalAmount: number;
  involvedUsers: TransactionUser[];
  notes?: string;
  gameType?: string;
}

interface DataContextType {
  currentUser: User;
  users: User[];
  transactions: Transaction[];
  updateCurrentUser: (name: string, avatar: string) => void;
  addUser: (user: Omit<User, 'id' | 'balance'>) => void;
  removeUser: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  settleUp: (userId: string, amount: number) => void;
  getBalance: (userId: string) => number;
  getTotalOwed: () => number;
  getTotalOwedToYou: () => number;
  getNetBalance: () => number;
  getLoanBalance: () => number;
  getGameBalance: () => number;
  getLastGame: () => Transaction | undefined;
}

const roundAmount = (amount: number): number => {
  return Math.round(amount * 10) / 10;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

// todo: remove mock functionality - sample data for demo
const initialUsers: User[] = [
  { id: '1', name: 'Alex', avatar: 'adventurer', balance: 45.5 },
  { id: '2', name: 'Sarah', avatar: 'avataaars', balance: -32.0 },
  { id: '3', name: 'Mike', avatar: 'bottts', balance: 120.0 },
  { id: '4', name: 'Emma', avatar: 'big-smile', balance: -15.5 },
  { id: '5', name: 'Chris', avatar: 'micah', balance: 0 },
  { id: 'g1', name: 'Poker Night', avatar: 'initials', balance: 0, isGroup: true, members: ['1', '2', '3'] },
  { id: 'g2', name: 'Roommates', avatar: 'initials', balance: 0, isGroup: true, members: ['2', '4', '5'] },
];

const initialTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'loan',
    title: 'Dinner at Olive Garden',
    category: 'restaurant',
    date: '2025-11-27',
    totalAmount: 85.0,
    involvedUsers: [{ userId: '1', amount: 42.5 }, { userId: '2', amount: 42.5 }],
    notes: 'Birthday dinner',
  },
  {
    id: 't2',
    type: 'game',
    title: 'Poker Night',
    gameType: 'poker',
    date: '2025-11-26',
    totalAmount: 0,
    involvedUsers: [{ userId: '1', amount: 50 }, { userId: '2', amount: -30 }, { userId: '3', amount: -20 }],
  },
  {
    id: 't3',
    type: 'expense',
    title: 'Grocery Shopping',
    category: 'shopping',
    date: '2025-11-25',
    totalAmount: 120.5,
    involvedUsers: [{ userId: '4', amount: 40.2 }, { userId: '5', amount: 40.2 }, { userId: '2', amount: 40.1 }],
  },
  {
    id: 't4',
    type: 'payment',
    title: 'Settled up with Alex',
    date: '2025-11-24',
    totalAmount: 20.0,
    involvedUsers: [{ userId: '1', amount: -20 }],
  },
  {
    id: 't5',
    type: 'game',
    title: 'Mahjong Session',
    gameType: 'mahjong',
    date: '2025-11-23',
    totalAmount: 0,
    involvedUsers: [{ userId: '3', amount: 80 }, { userId: '4', amount: -25 }, { userId: '1', amount: -55 }],
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current',
    name: 'You',
    avatar: 'lorelei',
    balance: 0,
  });
  
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const updateCurrentUser = useCallback((name: string, avatar: string) => {
    setCurrentUser(prev => ({ ...prev, name, avatar }));
  }, []);

  const addUser = useCallback((userData: Omit<User, 'id' | 'balance'>) => {
    const newUser: User = {
      ...userData,
      id: `u${Date.now()}`,
      balance: 0,
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `t${Date.now()}`,
      totalAmount: roundAmount(transactionData.totalAmount),
      involvedUsers: transactionData.involvedUsers.map(u => ({
        ...u,
        amount: roundAmount(u.amount),
      })),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    
    setUsers(prev => prev.map(user => {
      const involvement = newTransaction.involvedUsers.find(u => u.userId === user.id);
      if (involvement) {
        return { ...user, balance: roundAmount(user.balance + involvement.amount) };
      }
      return user;
    }));
  }, []);

  const removeTransaction = useCallback((id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;
    
    setUsers(prev => prev.map(user => {
      const involvement = transaction.involvedUsers.find(u => u.userId === user.id);
      if (involvement) {
        return { ...user, balance: roundAmount(user.balance - involvement.amount) };
      }
      return user;
    }));
    
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [transactions]);

  const settleUp = useCallback((userId: string, amount: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const roundedAmount = roundAmount(amount);
    const isOwedToYou = user.balance > 0;
    
    addTransaction({
      type: 'payment',
      title: isOwedToYou ? `${user.name} paid you` : `You paid ${user.name}`,
      date: new Date().toISOString().split('T')[0],
      totalAmount: roundedAmount,
      involvedUsers: [{ userId, amount: isOwedToYou ? -roundedAmount : roundedAmount }],
    });
  }, [users, addTransaction]);

  const getBalance = useCallback((userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.balance ?? 0;
  }, [users]);

  const getTotalOwed = useCallback(() => {
    return roundAmount(users.filter(u => u.balance < 0 && !u.isGroup).reduce((sum, u) => sum + Math.abs(u.balance), 0));
  }, [users]);

  const getTotalOwedToYou = useCallback(() => {
    return roundAmount(users.filter(u => u.balance > 0 && !u.isGroup).reduce((sum, u) => sum + u.balance, 0));
  }, [users]);

  const getNetBalance = useCallback(() => {
    return roundAmount(users.filter(u => !u.isGroup).reduce((sum, u) => sum + u.balance, 0));
  }, [users]);

  const getLoanBalance = useCallback(() => {
    // Calculate balance from loan transactions only
    let loanBalance = 0;
    transactions
      .filter(t => t.type === 'loan')
      .forEach(tx => {
        const involvement = tx.involvedUsers.find(u => u.userId === 'current');
        if (involvement) {
          loanBalance += involvement.amount;
        }
      });
    return roundAmount(loanBalance);
  }, [transactions]);

  const getGameBalance = useCallback(() => {
    // Calculate balance from game transactions only
    let gameBalance = 0;
    transactions
      .filter(t => t.type === 'game')
      .forEach(tx => {
        const involvement = tx.involvedUsers.find(u => u.userId === 'current');
        if (involvement) {
          gameBalance += involvement.amount;
        }
      });
    return roundAmount(gameBalance);
  }, [transactions]);

  const getLastGame = useCallback(() => {
    return transactions.find(t => t.type === 'game');
  }, [transactions]);

  return (
    <DataContext.Provider value={{
      currentUser,
      users,
      transactions,
      updateCurrentUser,
      addUser,
      removeUser,
      addTransaction,
      removeTransaction,
      settleUp,
      getBalance,
      getTotalOwed,
      getTotalOwedToYou,
      getNetBalance,
      getLoanBalance,
      getGameBalance,
      getLastGame,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
