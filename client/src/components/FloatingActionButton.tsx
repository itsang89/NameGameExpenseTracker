import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, X, CreditCard, Gamepad2 } from 'lucide-react';

interface FloatingActionButtonProps {
  onLogLoan: () => void;
  onLogGame: () => void;
}

export default function FloatingActionButton({ onLogLoan, onLogGame }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col-reverse items-end gap-3">
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 -z-10"
            onClick={() => setIsExpanded(false)}
          />
          <Button
            onClick={() => {
              onLogLoan();
              setIsExpanded(false);
            }}
            className="bg-positive hover:bg-positive/90 text-positive-foreground shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200"
            data-testid="fab-log-loan"
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Log Loan
          </Button>
          <Button
            onClick={() => {
              onLogGame();
              setIsExpanded(false);
            }}
            className="bg-game hover:bg-game/90 text-game-foreground shadow-lg animate-in slide-in-from-bottom-2 fade-in duration-200"
            style={{ animationDelay: '50ms' }}
            data-testid="fab-log-game"
          >
            <Gamepad2 className="w-5 h-5 mr-2" />
            Log Game
          </Button>
        </>
      )}
      <Button
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full shadow-lg transition-transform ${
          isExpanded ? 'bg-muted text-muted-foreground rotate-45' : 'bg-primary text-primary-foreground'
        }`}
        data-testid="fab-main"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  );
}
