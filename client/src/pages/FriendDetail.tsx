import { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Trash2, DollarSign } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TransactionItem from '@/components/TransactionItem';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

interface FriendDetailProps {
  friendId: string;
  onBack: () => void;
  onTransactionClick: (id: string) => void;
}

export default function FriendDetail({ friendId, onBack, onTransactionClick }: FriendDetailProps) {
  const { users, transactions, settleUp } = useData();
  const { toast } = useToast();
  const [showSettleDialog, setShowSettleDialog] = useState(false);
  const [settleAmount, setSettleAmount] = useState('');
  
  const friend = users.find(u => u.id === friendId);
  const friendTransactions = transactions.filter(tx => 
    tx.involvedUsers.some(u => u.userId === friendId)
  );

  if (!friend) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Friend not found</p>
      </div>
    );
  }

  const getBalanceDisplay = (balance: number) => {
    if (balance > 0) return { text: `Owes you $${balance.toFixed(1)}`, color: 'text-positive' };
    if (balance < 0) return { text: `You owe $${Math.abs(balance).toFixed(1)}`, color: 'text-negative' };
    return { text: 'Settled up', color: 'text-muted-foreground' };
  };

  const handleSettleSubmit = () => {
    let amount: number;
    
    // If amount is empty, settle the full balance
    if (settleAmount === '') {
      if (friend.balance === 0) {
        toast({ title: 'Already settled', description: 'No balance to settle', variant: 'destructive' });
        return;
      }
      amount = Math.abs(friend.balance);
    } else {
      amount = parseFloat(settleAmount);
      if (isNaN(amount) || amount <= 0) {
        toast({ title: 'Invalid amount', description: 'Please enter a valid amount', variant: 'destructive' });
        return;
      }
    }
    
    settleUp(friendId, amount);
    toast({ title: 'Settled!', description: `Payment of $${amount.toFixed(1)} recorded with ${friend.name}` });
    setShowSettleDialog(false);
    setSettleAmount('');
  };

  const balanceDisplay = getBalanceDisplay(friend.balance);
  const avatarUrl = `https://api.dicebear.com/7.x/${friend.avatar}/svg?seed=${friend.name}`;

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl neu-raised">
          <button 
            onClick={onBack} 
            className="p-2 rounded-xl neu-interactive-sm active:neu-click"
            data-testid="button-back-friend-detail"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Friend Details</h1>
        </div>
      </header>

      <main className="px-4 space-y-6 py-6">
        {/* Friend Info Card */}
        <div className="p-6 rounded-2xl bg-background neu-raised text-center">
          <div className="flex justify-center mb-4">
            <div className="p-2 rounded-full neu-raised">
              <Avatar className="w-24 h-24">
                <AvatarImage src={avatarUrl} alt={friend.name} />
                <AvatarFallback>{friend.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{friend.name}</h2>
          <p className={`text-lg font-semibold mb-4 ${balanceDisplay.color}`}>
            {balanceDisplay.text}
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            {friend.balance !== 0 && (
              <button 
                className="flex items-center gap-2 px-4 py-2 rounded-lg neu-btn text-positive font-semibold active:neu-click"
                onClick={() => setShowSettleDialog(true)}
                data-testid={`button-settle-${friendId}`}
              >
                <DollarSign className="w-4 h-4" />
                Settle
              </button>
            )}
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg neu-btn active:neu-click"
              onClick={() => console.log('Call', friend.name)}
              data-testid={`button-call-${friendId}`}
            >
              <Phone className="w-4 h-4" />
              Call
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg neu-btn active:neu-click"
              onClick={() => console.log('Message', friend.name)}
              data-testid={`button-message-${friendId}`}
            >
              <MessageCircle className="w-4 h-4" />
              Message
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 rounded-lg neu-btn text-negative active:neu-click"
              onClick={() => console.log('Delete', friend.name)}
              data-testid={`button-delete-${friendId}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Settle Dialog */}
          <Dialog open={showSettleDialog} onOpenChange={(open) => {
            setShowSettleDialog(open);
            if (open && friend.balance !== 0) {
              setSettleAmount(Math.abs(friend.balance).toFixed(1));
            } else if (!open) {
              setSettleAmount('');
            }
          }}>
            <DialogContent className="w-[90%] rounded-2xl neu-raised">
              <DialogHeader>
                <DialogTitle>Settle Payment</DialogTitle>
                <DialogDescription>
                  Enter the amount to settle with {friend.name}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Current Balance: ${Math.abs(friend.balance).toFixed(1)}</p>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={settleAmount}
                    onChange={(e) => setSettleAmount(e.target.value)}
                    step="0.1"
                    className="text-lg font-semibold neu-inset"
                    data-testid="input-settle-amount"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowSettleDialog(false)}
                    className="flex-1 active:neu-click"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSettleSubmit}
                    className="flex-1 active:neu-click"
                    data-testid={settleAmount === '' ? 'button-settle-all' : 'button-confirm-settle'}
                  >
                    {settleAmount === '' ? 'Settle All' : 'Confirm'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transaction History */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
          <div className="space-y-3">
            {friendTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No transactions with this friend</p>
            ) : (
              friendTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  onClick={() => onTransactionClick(tx.id)}
                  className="cursor-pointer"
                >
                  <TransactionItem
                    type={tx.type}
                    title={tx.title}
                    date={tx.date}
                    amount={tx.involvedUsers.find(u => u.userId === friendId)?.amount || 0}
                    category={tx.category}
                    gameType={tx.gameType}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
