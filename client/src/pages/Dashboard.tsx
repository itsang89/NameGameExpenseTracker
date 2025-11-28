import { useState } from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
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
}

export default function Dashboard({ onLogLoan, onLogGame, onFriendClick, onTransactionClick }: DashboardProps) {
  const { currentUser, users, transactions, getTotalOwed, getTotalOwedToYou, getNetBalance, getLastGame } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  const friends = users.filter(u => !u.isGroup).sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  const recentTransactions = transactions.slice(0, 5);
  const lastGame = getLastGame();
  const lastGameAmount = lastGame?.involvedUsers.reduce((sum, u) => sum + u.amount, 0) ?? 0;

  const currentUserAvatarUrl = `https://api.dicebear.com/7.x/${currentUser.avatar}/svg?seed=${currentUser.name}`;

  return (
    <div className="pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={currentUserAvatarUrl} alt={currentUser.name} />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Welcome back,</p>
              <p className="font-semibold text-foreground">Player</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              console.log('Notifications toggled');
            }}
            className="p-2 rounded-xl hover-elevate active-elevate-2 relative"
            data-testid="button-notifications"
          >
            <Bell className="w-6 h-6 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-negative rounded-full" />
          </button>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section>
          <div className="grid grid-cols-2 gap-4">
            <StatCard type="owe" amount={getTotalOwed()} onClick={() => console.log('You owe clicked')} />
            <StatCard type="owed" amount={getTotalOwedToYou()} onClick={() => console.log('Owed to you clicked')} />
            <StatCard type="net" amount={getNetBalance()} onClick={() => console.log('Net balance clicked')} />
            <StatCard type="game" amount={lastGameAmount} label={lastGame?.title || 'No games yet'} onClick={() => console.log('Last game clicked')} />
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Friends</h2>
            <button 
              className="text-sm text-primary font-medium flex items-center gap-1 hover-elevate active-elevate-2 rounded-lg px-2 py-1"
              onClick={() => console.log('View all friends')}
              data-testid="button-view-all-friends"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {friends.map((friend) => (
                <FriendAvatar
                  key={friend.id}
                  name={friend.name}
                  avatar={friend.avatar}
                  balance={friend.balance}
                  showBalance
                  showWinnerBadge
                  onClick={() => onFriendClick(friend.id)}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
            <button 
              className="text-sm text-primary font-medium flex items-center gap-1 hover-elevate active-elevate-2 rounded-lg px-2 py-1"
              data-testid="button-view-all-activity"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                type={tx.type}
                title={tx.title}
                date={tx.date}
                amount={tx.involvedUsers.reduce((sum, u) => sum + u.amount, 0)}
                category={tx.category}
                gameType={tx.gameType}
                onClick={() => onTransactionClick(tx.id)}
              />
            ))}
          </div>
        </section>
      </main>

      <FloatingActionButton onLogLoan={onLogLoan} onLogGame={onLogGame} />
    </div>
  );
}
