import { ArrowLeft } from 'lucide-react';
import TransactionItem from '@/components/TransactionItem';
import { useData } from '@/contexts/DataContext';

interface TransactionHistoryProps {
  onBack: () => void;
  onTransactionClick: (id: string) => void;
  filterType?: 'loan' | 'expense' | 'game' | 'payment';
}

export default function TransactionHistory({ onBack, onTransactionClick, filterType }: TransactionHistoryProps) {
  const { transactions } = useData();
  
  const filtered = filterType 
    ? transactions.filter(t => t.type === filterType)
    : transactions;

  const getTitle = () => {
    if (filterType === 'loan') return 'Loans';
    if (filterType === 'expense') return 'Expenses';
    if (filterType === 'game') return 'Games';
    if (filterType === 'payment') return 'Payments';
    return 'All Transactions';
  };

  return (
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl neu-raised">
          <button 
            onClick={onBack} 
            className="p-2 rounded-xl neu-interactive-sm"
            data-testid="button-back-transaction-history"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{getTitle()}</h1>
        </div>
      </header>

      <main className="px-4 space-y-3 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => (
            <div 
              key={tx.id}
              onClick={() => onTransactionClick(tx.id)}
              className="cursor-pointer"
            >
              <TransactionItem
                type={tx.type}
                title={tx.title}
                date={tx.date}
                amount={tx.involvedUsers.reduce((sum, u) => sum + u.amount, 0)}
                category={tx.category}
                gameType={tx.gameType}
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
