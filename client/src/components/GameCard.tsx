interface GameCardProps {
  type: 'poker' | 'mahjong' | 'blackjack';
  isSelected?: boolean;
  onClick?: () => void;
}

const gameConfig = {
  poker: {
    name: 'Poker',
    icon: '♠',
    selectedGlow: 'neu-glow-primary',
  },
  mahjong: {
    name: 'Mahjong',
    icon: '🀄',
    selectedGlow: 'neu-glow-primary',
  },
  blackjack: {
    name: 'Blackjack',
    icon: '🃏',
    selectedGlow: 'neu-glow-primary',
  },
};

export default function GameCard({ type, isSelected, onClick }: GameCardProps) {
  const config = gameConfig[type];

  return (
    <div
      className={`p-5 rounded-2xl bg-background cursor-pointer transition-all duration-200 ${
        isSelected 
          ? `${config.selectedGlow} ring-2 ring-primary` 
          : 'neu-interactive'
      }`}
      onClick={onClick}
      data-testid={`game-card-${type}`}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-4xl">{config.icon}</span>
        <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {config.name}
        </span>
      </div>
    </div>
  );
}
