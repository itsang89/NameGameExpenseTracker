import { useState } from 'react';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import GameCard from '@/components/GameCard';
import { useData } from '@/contexts/DataContext';

interface LogGameProps {
  onBack: () => void;
}

type GameType = 'poker' | 'mahjong' | 'blackjack';

export default function LogGame({ onBack }: LogGameProps) {
  const { users, addTransaction } = useData();
  const { toast } = useToast();
  
  const [selectedGame, setSelectedGame] = useState<GameType>('poker');
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({});
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const friends = users.filter(u => !u.isGroup);

  const getTotal = () => {
    return Object.values(playerScores).reduce((sum, val) => sum + val, 0);
  };

  const isBalanced = () => Math.abs(getTotal()) < 0.1;

  const handleScoreChange = (id: string, value: string) => {
    const parsed = parseFloat(value);
    setPlayerScores(prev => ({
      ...prev,
      [id]: isNaN(parsed) ? 0 : parsed,
    }));
  };

  const handleSave = () => {
    const activeScores = Object.entries(playerScores).filter(([, score]) => score !== 0);
    
    if (activeScores.length < 2) {
      toast({ 
        title: 'Not enough players', 
        description: 'At least 2 players with scores are required', 
        variant: 'destructive' 
      });
      return;
    }

    if (!isBalanced()) {
      toast({ 
        title: 'Scores unbalanced', 
        description: 'Total scores must equal zero', 
        variant: 'destructive' 
      });
      return;
    }

    const gameName = selectedGame.charAt(0).toUpperCase() + selectedGame.slice(1);

    addTransaction({
      type: 'game',
      title: `${gameName} Session`,
      gameType: selectedGame,
      date,
      totalAmount: 0,
      involvedUsers: activeScores.map(([userId, amount]) => ({
        userId,
        amount: Math.round(amount * 10) / 10,
      })),
    });

    toast({ 
      title: 'Game logged!', 
      description: `${gameName} results recorded for ${activeScores.length} players` 
    });
    onBack();
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl neu-raised">
          <button 
            onClick={onBack}
            className="p-2 rounded-xl neu-interactive-sm"
            data-testid="button-back-game"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Log Game</h1>
        </div>
      </header>

      <main className="px-4 space-y-6">
        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Select Game</h3>
          <div className="grid grid-cols-3 gap-3">
            <GameCard 
              type="poker" 
              isSelected={selectedGame === 'poker'} 
              onClick={() => setSelectedGame('poker')} 
            />
            <GameCard 
              type="mahjong" 
              isSelected={selectedGame === 'mahjong'} 
              onClick={() => setSelectedGame('mahjong')} 
            />
            <GameCard 
              type="blackjack" 
              isSelected={selectedGame === 'blackjack'} 
              onClick={() => setSelectedGame('blackjack')} 
            />
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Player Results</h3>
          <div className="space-y-3">
            {friends.map((friend) => (
              <div key={friend.id} className="p-4 rounded-2xl bg-background neu-raised">
                <div className="flex items-center gap-3">
                  <div className="p-1 rounded-full neu-raised-sm">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={`https://api.dicebear.com/7.x/${friend.avatar}/svg?seed=${friend.name}`} />
                      <AvatarFallback>{friend.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="flex-1 font-semibold">{friend.name}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={playerScores[friend.id] || ''}
                      onChange={(e) => handleScoreChange(friend.id, e.target.value)}
                      className={`w-28 text-right font-semibold neu-inset border-none ${
                        (playerScores[friend.id] || 0) > 0 
                          ? 'text-positive' 
                          : (playerScores[friend.id] || 0) < 0 
                            ? 'text-negative' 
                            : ''
                      }`}
                      data-testid={`input-score-${friend.id}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={`p-5 rounded-2xl bg-background ${isBalanced() ? 'neu-glow-positive' : 'neu-glow-negative'}`}>
          <div className="flex items-center gap-3">
            {isBalanced() ? (
              <div className="p-2 rounded-xl neu-inset bg-positive/10">
                <Check className="w-5 h-5 text-positive" />
              </div>
            ) : (
              <div className="p-2 rounded-xl neu-inset bg-negative/10">
                <AlertCircle className="w-5 h-5 text-negative" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">Total Balance</p>
              <p className={`text-sm ${isBalanced() ? 'text-positive' : 'text-negative'}`}>
                {isBalanced() 
                  ? 'Scores are balanced' 
                  : `Off by $${Math.abs(getTotal()).toFixed(1)}`
                }
              </p>
            </div>
            <span className={`text-2xl font-bold ${getTotal() >= 0 ? 'text-positive' : 'text-negative'}`}>
              {getTotal() >= 0 ? '+' : '-'}${Math.abs(getTotal()).toFixed(1)}
            </span>
          </div>
        </div>

        <button 
          className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
            isBalanced() 
              ? 'bg-game text-game-foreground neu-btn' 
              : 'bg-muted text-muted-foreground neu-pressed cursor-not-allowed'
          }`}
          onClick={handleSave}
          disabled={!isBalanced()}
          data-testid="button-save-game"
        >
          <Check className="w-5 h-5" />
          Save Game
        </button>
      </main>
    </div>
  );
}
