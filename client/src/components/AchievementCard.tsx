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
    iconColor: 'text-game',
    glowClass: 'neu-glow-game',
  },
  'win-streak': {
    icon: Flame,
    iconColor: 'text-coral',
    glowClass: 'neu-raised',
  },
  'most-played': {
    icon: Gamepad2,
    iconColor: 'text-primary',
    glowClass: 'neu-glow-primary',
  },
};

export default function AchievementCard({ type, title, value, holder }: AchievementCardProps) {
  const config = achievementConfig[type];
  const Icon = config.icon;

  return (
    <div 
      className={`p-5 rounded-2xl bg-background ${config.glowClass}`}
      data-testid={`achievement-${type}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl neu-inset">
          <Icon className={`w-6 h-6 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
          <p className="text-sm text-muted-foreground mt-1">{holder}</p>
        </div>
      </div>
    </div>
  );
}
