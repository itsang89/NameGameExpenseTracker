import { useState } from 'react';
import AmountInput from '../AmountInput';

export default function AmountInputExample() {
  const [amount, setAmount] = useState(125.5);
  
  return (
    <div className="p-8">
      <AmountInput value={amount} onChange={setAmount} />
      <p className="text-center text-muted-foreground mt-4">Current value: ${amount.toFixed(1)}</p>
    </div>
  );
}
