import { 
  Utensils, ShoppingCart, Home, Plane, Gamepad2, 
  CreditCard, CircleDollarSign, Users, Sparkles
} from 'lucide-react';

interface TransactionItemProps {
  type: 'loan' | 'expense' | 'game' | 'payment';
  title: string;
  date: string;
  amount: number;
  category?: string;
  gameType?: string;
  onClick?: () => void;
}

const categoryIcons: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  shopping: ShoppingCart,
  rent: Home,
  travel: Plane,
  games: Gamepad2,
  default: CircleDollarSign,
};

const gameIcons: Record<string, typeof Gamepad2> = {
  poker: Sparkles,
  mahjong: Users,
  blackjack: CreditCard,
};

export default function TransactionItem({ 
  type, 
  title, 
  date, 
  amount, 
  category,
  gameType,
  onClick 
}: TransactionItemProps) {
  const getIcon = () => {
    if (type === 'game' && gameType) {
      return gameIcons[gameType] || Gamepad2;
    }
    if (type === 'payment') {
      return CreditCard;
    }
    return categoryIcons[category || 'default'];
  };
  
  const Icon = getIcon();
  
  const getIconBg = () => {
    switch (type) {
      case 'game': return 'bg-game/10 text-game-foreground dark:text-game';
      case 'payment': return 'bg-primary/10 text-primary';
      case 'loan': return 'bg-positive/10 text-positive';
      default: return 'bg-chart-1/10 text-chart-1';
    }
  };
  
  const getAmountColor = () => {
    if (type === 'payment') return 'text-primary';
    if (amount > 0) return 'text-positive';
    if (amount < 0) return 'text-negative';
    return 'text-foreground';
  };

  const formatAmount = () => {
    if (amount > 0) return `+$${amount.toFixed(1)}`;
    if (amount < 0) return `-$${Math.abs(amount).toFixed(1)}`;
    return '$0.0';
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className="p-4 rounded-2xl bg-background neu-interactive cursor-pointer"
      onClick={onClick}
      data-testid={`transaction-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl neu-inset ${getIconBg()}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{title}</p>
          <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
        </div>
        <p className={`font-bold text-lg ${getAmountColor()}`}>
          {formatAmount()}
        </p>
      </div>
    </div>
  );
}
