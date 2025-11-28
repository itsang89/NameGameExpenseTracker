import { Card } from '@/components/ui/card';

interface GameCardProps {
  type: 'poker' | 'mahjong' | 'blackjack';
  isSelected?: boolean;
  onClick?: () => void;
}

const gameConfig = {
  poker: {
    name: 'Poker',
    icon: '♠',
    bgClass: 'bg-chart-1/10',
    selectedBg: 'bg-chart-1/20',
    iconColor: 'text-chart-1',
  },
  mahjong: {
    name: 'Mahjong',
    icon: '🀄',
    bgClass: 'bg-coral/10',
    selectedBg: 'bg-coral/20',
    iconColor: 'text-coral',
  },
  blackjack: {
    name: 'Blackjack',
    icon: '🃏',
    bgClass: 'bg-positive/10',
    selectedBg: 'bg-positive/20',
    iconColor: 'text-positive',
  },
};

export default function GameCard({ type, isSelected, onClick }: GameCardProps) {
  const config = gameConfig[type];

  return (
    <Card
      className={`p-4 hover-elevate active-elevate-2 cursor-pointer transition-all ${
        isSelected ? `${config.selectedBg} ring-2 ring-primary` : config.bgClass
      }`}
      onClick={onClick}
      data-testid={`game-card-${type}`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">{config.icon}</span>
        <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {config.name}
        </span>
      </div>
    </Card>
  );
}
