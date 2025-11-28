import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';

interface FriendAvatarProps {
  name: string;
  avatar: string;
  balance?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBalance?: boolean;
  showWinnerBadge?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export default function FriendAvatar({ 
  name, 
  avatar, 
  balance = 0, 
  size = 'md',
  showBalance = false,
  showWinnerBadge = false,
  onClick,
}: FriendAvatarProps) {
  const isWinner = balance > 0 && showWinnerBadge;
  const avatarUrl = `https://api.dicebear.com/7.x/${avatar}/svg?seed=${name}`;
  
  const getBalanceColor = () => {
    if (balance > 0) return 'text-positive';
    if (balance < 0) return 'text-negative';
    return 'text-muted-foreground';
  };

  const getBalanceText = () => {
    if (balance > 0) return `+$${balance.toFixed(1)}`;
    if (balance < 0) return `-$${Math.abs(balance).toFixed(1)}`;
    return 'settled';
  };

  return (
    <div 
      className={`flex flex-col items-center gap-1.5 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      data-testid={`friend-avatar-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`relative p-1.5 rounded-full ${onClick ? 'neu-interactive-sm' : 'neu-raised-sm'}`}>
        <Avatar className={`${sizeClasses[size]} ${isWinner ? 'ring-3 ring-game ring-offset-2 ring-offset-background' : ''}`}>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isWinner && (
          <div className="absolute -top-1 -right-0 bg-game rounded-full p-1 neu-raised-sm">
            <Crown className="w-3 h-3 text-game-foreground" />
          </div>
        )}
      </div>
      <span className="text-sm font-medium truncate max-w-[64px] text-foreground">{name}</span>
      {showBalance && (
        <span className={`text-xs font-semibold ${getBalanceColor()}`}>
          {getBalanceText()}
        </span>
      )}
    </div>
  );
}
