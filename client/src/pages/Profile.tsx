import { useState } from 'react';
import { Settings, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useData } from '@/contexts/DataContext';

interface ProfileProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Profile({ isDarkMode, onToggleDarkMode }: ProfileProps) {
  const { currentUser, users, transactions } = useData();
  
  const totalWon = users.filter(u => !u.isGroup && u.balance > 0).reduce((sum, u) => sum + u.balance, 0);
  const totalGroups = users.filter(u => u.isGroup).length;
  const gameCount = transactions.filter(t => t.type === 'game').length;

  const avatarUrl = `https://api.dicebear.com/7.x/${currentUser.avatar}/svg?seed=${currentUser.name}`;

  const menuItems = [
    { icon: Settings, label: 'Settings', action: () => console.log('Settings') },
    { icon: CreditCard, label: 'Payment Methods', action: () => console.log('Payments') },
    { icon: Shield, label: 'Privacy', action: () => console.log('Privacy') },
    { icon: HelpCircle, label: 'Help & Support', action: () => console.log('Help') },
  ];

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
      </header>

      <main className="p-4 space-y-6">
        <section className="flex flex-col items-center py-6">
          <Avatar className="w-24 h-24 ring-4 ring-primary/20">
            <AvatarImage src={avatarUrl} alt={currentUser.name} />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold mt-4">Player</h2>
          <p className="text-muted-foreground">@player</p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center bg-positive/10">
            <p className="text-2xl font-bold text-positive">${totalWon.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground">Total Won</p>
          </Card>
          <Card className="p-4 text-center bg-primary/10">
            <p className="text-2xl font-bold text-primary">{totalGroups}</p>
            <p className="text-sm text-muted-foreground">Groups</p>
          </Card>
          <Card className="p-4 text-center bg-game/10">
            <p className="text-2xl font-bold text-game-foreground dark:text-game">{gameCount}</p>
            <p className="text-sm text-muted-foreground">Games</p>
          </Card>
        </section>

        <section>
          <Card className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                <span className="font-medium">Dark Mode</span>
              </div>
              <Switch 
                checked={isDarkMode} 
                onCheckedChange={onToggleDarkMode}
                data-testid="toggle-dark-mode"
              />
            </div>
            
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="flex items-center gap-3 w-full p-4 hover-elevate active-elevate-2 text-left"
                data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </Card>
        </section>

        <section>
          <Card>
            <button
              onClick={() => console.log('Logout')}
              className="flex items-center gap-3 w-full p-4 hover-elevate active-elevate-2 text-negative"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </Card>
        </section>
      </main>
    </div>
  );
}
