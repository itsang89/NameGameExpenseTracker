import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Medal } from 'lucide-react';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  avatar: string;
  amount: number;
  gamesPlayed?: number;
}

export default function LeaderboardItem({ rank, name, avatar, amount, gamesPlayed }: LeaderboardItemProps) {
  const getRankDisplay = () => {
    if (rank === 1) return <Crown className="w-5 h-5 text-game" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-muted-foreground" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-coral" />;
    return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-medium">#{rank}</span>;
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${avatar}/svg?seed=${name}`;

  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-xl hover-elevate"
      data-testid={`leaderboard-item-${rank}`}
    >
      <div className="w-8 flex items-center justify-center">
        {getRankDisplay()}
      </div>
      
      <Avatar className={`w-12 h-12 ${rank === 1 ? 'ring-2 ring-game' : ''}`}>
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <p className="font-medium text-foreground">{name}</p>
        {gamesPlayed !== undefined && (
          <p className="text-sm text-muted-foreground">{gamesPlayed} games played</p>
        )}
      </div>
      
      <p className={`font-semibold ${amount >= 0 ? 'text-positive' : 'text-negative'}`}>
        {amount >= 0 ? '+' : '-'}${Math.abs(amount).toFixed(1)}
      </p>
    </div>
  );
}
