import { Card } from '@/components/ui/card';
import { ArrowDownLeft, ArrowUpRight, TrendingUp, Gamepad2 } from 'lucide-react';

interface StatCardProps {
  type: 'owe' | 'owed' | 'net' | 'game';
  amount: number;
  label?: string;
  onClick?: () => void;
}

const cardConfig = {
  owe: {
    icon: ArrowDownLeft,
    label: 'You Owe',
    bgClass: 'bg-negative/10 dark:bg-negative/20',
    textClass: 'text-negative',
    iconBg: 'bg-negative/20',
  },
  owed: {
    icon: ArrowUpRight,
    label: 'Owed to You',
    bgClass: 'bg-positive/10 dark:bg-positive/20',
    textClass: 'text-positive',
    iconBg: 'bg-positive/20',
  },
  net: {
    icon: TrendingUp,
    label: 'Net Balance',
    bgClass: 'bg-chart-1/10 dark:bg-chart-1/20',
    textClass: 'text-chart-1',
    iconBg: 'bg-chart-1/20',
  },
  game: {
    icon: Gamepad2,
    label: 'Last Game',
    bgClass: 'bg-game/10 dark:bg-game/20',
    textClass: 'text-game-foreground dark:text-game',
    iconBg: 'bg-game/20',
  },
};

export default function StatCard({ type, amount, label, onClick }: StatCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;
  
  const formatAmount = (val: number) => {
    const prefix = type === 'owe' ? '-' : type === 'game' && val < 0 ? '-' : type === 'game' && val > 0 ? '+' : '';
    return `${prefix}$${Math.abs(val).toFixed(1)}`;
  };

  return (
    <Card 
      className={`p-4 hover-elevate active-elevate-2 cursor-pointer transition-transform ${config.bgClass}`}
      onClick={onClick}
      data-testid={`stat-card-${type}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`p-2 rounded-xl ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.textClass}`} />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-muted-foreground">{displayLabel}</p>
        <p className={`text-2xl font-bold mt-1 ${config.textClass}`}>
          {formatAmount(amount)}
        </p>
      </div>
    </Card>
  );
}
