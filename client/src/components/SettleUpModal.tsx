import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AmountInput from './AmountInput';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatar: string;
  balance: number;
  onSettle: (amount: number) => void;
}

export default function SettleUpModal({
  isOpen,
  onClose,
  userName,
  userAvatar,
  balance,
  onSettle,
}: SettleUpModalProps) {
  const [amount, setAmount] = useState(Math.abs(balance));
  const isOwedToYou = balance > 0;
  const maxAmount = Math.abs(balance);

  const handleSettle = () => {
    if (amount > 0 && amount <= maxAmount) {
      onSettle(amount);
      onClose();
    }
  };

  const avatarUrl = `https://api.dicebear.com/7.x/${userAvatar}/svg?seed=${userName}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-3xl neu-raised border-none">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Settle Up</DialogTitle>
          <DialogDescription className="text-center">
            Record a payment to settle your balance
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="p-2 rounded-full neu-raised">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarUrl} alt={userName} />
              <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="text-center">
            <p className="text-lg font-semibold">{userName}</p>
            <p className={`text-sm font-medium ${isOwedToYou ? 'text-positive' : 'text-negative'}`}>
              {isOwedToYou ? `Owes you $${balance.toFixed(1)}` : `You owe $${Math.abs(balance).toFixed(1)}`}
            </p>
          </div>

          <AmountInput value={amount} onChange={setAmount} />
          
          {amount > maxAmount && (
            <p className="text-sm text-negative font-medium">Cannot settle more than ${maxAmount.toFixed(1)}</p>
          )}

          <div className="flex gap-3 w-full">
            <button
              className="flex-1 py-3 rounded-xl font-semibold neu-btn"
              onClick={() => setAmount(maxAmount)}
              data-testid="button-settle-full"
            >
              Full Amount
            </button>
            <button
              className="flex-1 py-3 rounded-xl font-semibold neu-btn"
              onClick={() => setAmount(maxAmount / 2)}
              data-testid="button-settle-half"
            >
              Half
            </button>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <button 
            className="flex-1 py-3 rounded-xl font-semibold neu-btn"
            onClick={onClose} 
            data-testid="button-cancel-settle"
          >
            Cancel
          </button>
          <button 
            onClick={handleSettle}
            disabled={amount <= 0 || amount > maxAmount}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              amount > 0 && amount <= maxAmount 
                ? 'bg-primary text-primary-foreground neu-btn' 
                : 'bg-muted text-muted-foreground neu-pressed cursor-not-allowed'
            }`}
            data-testid="button-confirm-settle"
          >
            {isOwedToYou ? 'Record Payment' : 'Pay Now'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
