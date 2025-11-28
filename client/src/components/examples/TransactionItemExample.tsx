import TransactionItem from '../TransactionItem';

export default function TransactionItemExample() {
  return (
    <div className="space-y-3 p-4">
      <TransactionItem 
        type="loan" 
        title="Dinner at Olive Garden" 
        date="2025-11-27" 
        amount={42.5} 
        category="restaurant"
        onClick={() => console.log('Loan clicked')}
      />
      <TransactionItem 
        type="game" 
        title="Poker Night" 
        date="2025-11-26" 
        amount={50} 
        gameType="poker"
        onClick={() => console.log('Game clicked')}
      />
      <TransactionItem 
        type="expense" 
        title="Grocery Shopping" 
        date="2025-11-25" 
        amount={-40.2} 
        category="shopping"
        onClick={() => console.log('Expense clicked')}
      />
      <TransactionItem 
        type="payment" 
        title="Settled up with Alex" 
        date="2025-11-24" 
        amount={20}
        onClick={() => console.log('Payment clicked')}
      />
    </div>
  );
}
