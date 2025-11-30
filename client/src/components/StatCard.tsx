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
    glowClass: 'neu-glow-negative',
    textClass: 'text-negative',
    iconBg: 'bg-negative/10',
  },
  owed: {
    icon: ArrowUpRight,
    label: 'Owed to You',
    glowClass: 'neu-glow-positive',
    textClass: 'text-positive',
    iconBg: 'bg-positive/10',
  },
  net: {
    icon: TrendingUp,
    label: 'Net Balance',
    glowClass: 'neu-glow-primary',
    textClass: 'text-primary',
    iconBg: 'bg-primary/10',
  },
  game: {
    icon: Gamepad2,
    label: 'Last Game',
    glowClass: 'neu-glow-game',
    textClass: 'text-game-foreground dark:text-game',
    iconBg: 'bg-game/10',
  },
};

export default function StatCard({ type, amount, label, onClick }: StatCardProps) {
  const config = cardConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;
  
  const getAmountColor = () => {
    if (amount < 0) return 'text-negative';
    if (amount > 0) return 'text-positive';
    return config.textClass;
  };
  
  const formatAmount = (val: number) => {
    const prefix = type === 'owe' ? '-' : type === 'game' && val < 0 ? '-' : type === 'game' && val > 0 ? '+' : '';
    return `${prefix}$${Math.abs(val).toFixed(1)}`;
  };

  return (
    <div 
      className={`p-5 rounded-2xl bg-background cursor-pointer transition-all duration-200 ${config.glowClass} active:neu-pressed active:scale-[0.98]`}
      onClick={onClick}
      data-testid={`stat-card-${type}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`p-3 rounded-xl neu-inset ${config.iconBg}`}>
          <Icon className={`w-5 h-5 ${config.textClass}`} />
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground font-medium">{displayLabel}</p>
        <p className={`text-2xl font-bold mt-1 ${getAmountColor()}`}>
          {formatAmount(amount)}
        </p>
      </div>
    </div>
  );
}
