import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Settle Up</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 gap-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={avatarUrl} alt={userName} />
            <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="text-lg font-medium">{userName}</p>
            <p className={`text-sm ${isOwedToYou ? 'text-positive' : 'text-negative'}`}>
              {isOwedToYou ? `Owes you $${balance.toFixed(1)}` : `You owe $${Math.abs(balance).toFixed(1)}`}
            </p>
          </div>

          <AmountInput value={amount} onChange={setAmount} />
          
          {amount > maxAmount && (
            <p className="text-sm text-negative">Cannot settle more than ${maxAmount.toFixed(1)}</p>
          )}

          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setAmount(maxAmount)}
              data-testid="button-settle-full"
            >
              Full Amount
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setAmount(maxAmount / 2)}
              data-testid="button-settle-half"
            >
              Half
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-settle">
            Cancel
          </Button>
          <Button 
            onClick={handleSettle}
            disabled={amount <= 0 || amount > maxAmount}
            className="bg-primary"
            data-testid="button-confirm-settle"
          >
            {isOwedToYou ? 'Record Payment' : 'Pay Now'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
