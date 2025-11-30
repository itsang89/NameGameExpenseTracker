import { ArrowLeft, Calendar, DollarSign, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useData, type Transaction } from '@/contexts/DataContext';

interface TransactionDetailProps {
  transactionId: string;
  onBack: () => void;
}

export default function TransactionDetail({ transactionId, onBack }: TransactionDetailProps) {
  const { transactions, users, removeTransaction } = useData();
  const { toast } = useToast();
  
  const transaction = transactions.find(t => t.id === transactionId);

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Transaction not found</p>
      </div>
    );
  }

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      loan: 'Loan',
      expense: 'Expense',
      game: 'Game',
      payment: 'Payment',
    };
    return labels[type] || type;
  };

  const getCategoryLabel = (category?: string) => {
    const labels: Record<string, string> = {
      restaurant: '🍽️ Dinner',
      shopping: '🛒 Shopping',
      rent: '🏠 Rent',
      travel: '✈️ Travel',
      games: '🎮 Games',
      other: '💳 Other',
    };
    return labels[category || 'other'] || category || 'Other';
  };

  const handleDelete = () => {
    removeTransaction(transactionId);
    toast({ title: 'Deleted', description: 'Transaction has been removed' });
    onBack();
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl neu-raised">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack} 
              className="p-2 rounded-xl neu-interactive-sm active:neu-click"
              data-testid="button-back-transaction-detail"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold">Transaction Details</h1>
          </div>
          <button 
            onClick={handleDelete} 
            className="p-2 rounded-xl neu-interactive-sm text-negative active:neu-click"
            data-testid="button-delete-transaction"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 space-y-6 py-6">
        {/* Transaction Header */}
        <div className="p-6 rounded-2xl bg-background neu-raised">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">{transaction.title}</h2>
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
              {getTransactionTypeLabel(transaction.type)}
            </span>
          </div>

          {transaction.category && (
            <p className="text-muted-foreground mb-4">{getCategoryLabel(transaction.category)}</p>
          )}

          {transaction.gameType && (
            <p className="text-muted-foreground mb-4 capitalize">{transaction.gameType} Session</p>
          )}

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="w-4 h-4" />
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>

          {transaction.totalAmount > 0 && (
            <div className="flex items-center gap-2 text-2xl font-bold text-positive">
              <DollarSign className="w-6 h-6" />
              {transaction.totalAmount.toFixed(1)}
            </div>
          )}

          {transaction.notes && (
            <div className="mt-4 p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground font-semibold mb-1">Notes</p>
              <p className="text-sm">{transaction.notes}</p>
            </div>
          )}
        </div>

        {/* Participants */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Participants</h3>
          <div className="space-y-3">
            {transaction.involvedUsers.map((involvement) => {
              const user = users.find(u => u.id === involvement.userId);
              if (!user) return null;

              const avatarUrl = `https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`;
              const isPositive = involvement.amount > 0;

              return (
                <div key={involvement.userId} className="p-4 rounded-2xl bg-background neu-raised">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-1 rounded-full neu-raised-sm">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <span className={`text-lg font-bold ${isPositive ? 'text-positive' : 'text-negative'}`}>
                      {isPositive ? '+' : '-'}${Math.abs(involvement.amount).toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
