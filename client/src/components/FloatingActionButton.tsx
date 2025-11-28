import { useState } from 'react';
import { Plus, X, CreditCard, Gamepad2 } from 'lucide-react';

interface FloatingActionButtonProps {
  onLogLoan: () => void;
  onLogGame: () => void;
}

export default function FloatingActionButton({ onLogLoan, onLogGame }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col-reverse items-end gap-3">
      {isExpanded && (
        <>
          <div 
            className="fixed inset-0 bg-black/10 backdrop-blur-[2px] -z-10"
            onClick={() => setIsExpanded(false)}
          />
          <button
            onClick={() => {
              onLogLoan();
              setIsExpanded(false);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-positive text-positive-foreground font-semibold neu-btn animate-in slide-in-from-bottom-2 fade-in duration-200"
            data-testid="fab-log-loan"
          >
            <CreditCard className="w-5 h-5" />
            Log Loan
          </button>
          <button
            onClick={() => {
              onLogGame();
              setIsExpanded(false);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-game text-game-foreground font-semibold neu-btn animate-in slide-in-from-bottom-2 fade-in duration-200"
            style={{ animationDelay: '50ms' }}
            data-testid="fab-log-game"
          >
            <Gamepad2 className="w-5 h-5" />
            Log Game
          </button>
        </>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200 ${
          isExpanded 
            ? 'bg-muted text-muted-foreground rotate-45 neu-pressed' 
            : 'bg-primary text-primary-foreground neu-btn'
        }`}
        data-testid="fab-main"
      >
        {isExpanded ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>
    </div>
  );
}
