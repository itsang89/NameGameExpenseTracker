import { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import StatCard from '@/components/StatCard';
import FriendAvatar from '@/components/FriendAvatar';
import TransactionItem from '@/components/TransactionItem';
import FloatingActionButton from '@/components/FloatingActionButton';
import { useData } from '@/contexts/DataContext';

interface DashboardProps {
  onLogLoan: () => void;
  onLogGame: () => void;
  onFriendClick: (id: string) => void;
  onTransactionClick: (id: string) => void;
  onStatCardClick?: (type: 'loan' | 'expense' | 'game' | 'payment') => void;
  onViewAllFriends?: () => void;
  onViewAllTransactions?: () => void;
}

export default function Dashboard({ onLogLoan, onLogGame, onFriendClick, onTransactionClick, onStatCardClick, onViewAllFriends, onViewAllTransactions }: DashboardProps) {
  const { currentUser, users, transactions, getTotalOwed, getTotalOwedToYou, getLoanBalance, getGameBalance, getLastGame } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const friends = users.filter(u => !u.isGroup).sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  const recentTransactions = transactions.slice(0, 5);
  const lastGame = getLastGame();
  const loanBalance = getLoanBalance();
  const gameBalance = getGameBalance();

  const currentUserAvatarUrl = `https://api.dicebear.com/7.x/${currentUser.avatar}/svg?seed=${currentUser.name}`;

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center justify-between p-4 rounded-2xl neu-raised">
          <div className="flex items-center gap-3">
            <div className="p-1 rounded-full neu-raised-sm">
              <Avatar className="w-10 h-10">
                <AvatarImage src={currentUserAvatarUrl} alt={currentUser.name} />
                <AvatarFallback>Y</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-foreground">{currentUser.name}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              console.log('Notifications toggled');
            }}
            className="p-3 rounded-xl neu-interactive-sm relative active:neu-click"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-negative rounded-full" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <section>
          <div className="grid grid-cols-2 gap-4">
            <StatCard type="owed" amount={loanBalance} onClick={() => onStatCardClick?.('loan')} />
            <StatCard type="game" amount={gameBalance} onClick={() => onStatCardClick?.('game')} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Friends</h2>
            <button 
              className="text-sm text-primary font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg neu-interactive-sm active:neu-click"
              onClick={onViewAllFriends}
              data-testid="button-view-all-friends"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {friends.map((friend) => (
                <FriendAvatar
                  key={friend.id}
                  name={friend.name}
                  avatar={friend.avatar}
                  balance={friend.balance}
                  showBalance
                  onClick={() => onFriendClick(friend.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <button 
              className="text-sm text-primary font-semibold flex items-center gap-1 px-3 py-1.5 rounded-lg neu-interactive-sm"
              onClick={onViewAllTransactions}
              data-testid="button-view-all-activity"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => {
              // For games, show the largest win/loss; for loans, show total amount
              let displayAmount: number;
              if (tx.type === 'game') {
                const amounts = tx.involvedUsers.map(u => Math.abs(u.amount));
                displayAmount = Math.max(...amounts);
              } else if (tx.type === 'payment') {
                // For payments, show the amount from the payer's perspective (negative if they paid)
                const friendInvolvement = tx.involvedUsers.find(u => u.userId !== 'current');
                displayAmount = friendInvolvement?.amount ?? 0;
              } else {
                displayAmount = tx.totalAmount;
              }
              
              return (
                <TransactionItem
                  key={tx.id}
                  type={tx.type}
                  title={tx.title}
                  date={tx.date}
                  amount={displayAmount}
                  category={tx.category}
                  gameType={tx.gameType}
                  onClick={() => onTransactionClick(tx.id)}
                />
              );
            })}
          </div>
        </section>
      </main>

      <FloatingActionButton onLogLoan={onLogLoan} onLogGame={onLogGame} />
    </div>
  );
}
