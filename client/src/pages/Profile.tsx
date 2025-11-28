import { Settings, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="p-4 rounded-2xl neu-raised">
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <section className="flex flex-col items-center py-6">
          <div className="p-2 rounded-full neu-raised">
            <Avatar className="w-24 h-24 ring-4 ring-primary/20">
              <AvatarImage src={avatarUrl} alt={currentUser.name} />
              <AvatarFallback>Y</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-xl font-bold mt-4">Player</h2>
          <p className="text-muted-foreground">@player</p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          <div className="p-5 rounded-2xl text-center bg-background neu-glow-positive">
            <p className="text-2xl font-bold text-positive">${totalWon.toFixed(1)}</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Total Won</p>
          </div>
          <div className="p-5 rounded-2xl text-center bg-background neu-glow-primary">
            <p className="text-2xl font-bold text-primary">{totalGroups}</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Groups</p>
          </div>
          <div className="p-5 rounded-2xl text-center bg-background neu-glow-game">
            <p className="text-2xl font-bold text-game-foreground dark:text-game">{gameCount}</p>
            <p className="text-sm text-muted-foreground font-medium mt-1">Games</p>
          </div>
        </section>

        <section>
          <div className="rounded-2xl bg-background neu-raised divide-y divide-border/50">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl neu-inset">
                  {isDarkMode ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                </div>
                <span className="font-semibold">Dark Mode</span>
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
                className="flex items-center gap-3 w-full p-4 text-left transition-all active:bg-muted/50"
                data-testid={`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="p-2 rounded-xl neu-inset">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="flex-1 font-semibold">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="rounded-2xl bg-background neu-raised">
            <button
              onClick={() => console.log('Logout')}
              className="flex items-center gap-3 w-full p-4 text-negative transition-all active:bg-negative/10"
              data-testid="button-logout"
            >
              <div className="p-2 rounded-xl neu-inset">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-semibold">Log Out</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
