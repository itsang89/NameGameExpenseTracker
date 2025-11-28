import { Card } from '@/components/ui/card';
import { Trophy, Flame, Gamepad2 } from 'lucide-react';

interface AchievementCardProps {
  type: 'biggest-winner' | 'win-streak' | 'most-played';
  title: string;
  value: string;
  holder: string;
}

const achievementConfig = {
  'biggest-winner': {
    icon: Trophy,
    bgClass: 'bg-game/10',
    iconColor: 'text-game',
  },
  'win-streak': {
    icon: Flame,
    bgClass: 'bg-coral/10',
    iconColor: 'text-coral',
  },
  'most-played': {
    icon: Gamepad2,
    bgClass: 'bg-chart-1/10',
    iconColor: 'text-chart-1',
  },
};

export default function AchievementCard({ type, title, value, holder }: AchievementCardProps) {
  const config = achievementConfig[type];
  const Icon = config.icon;

  return (
    <Card 
      className={`p-4 ${config.bgClass}`}
      data-testid={`achievement-${type}`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${config.bgClass}`}>
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{holder}</p>
        </div>
      </div>
    </Card>
  );
}
