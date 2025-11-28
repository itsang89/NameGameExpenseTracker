import { useState, useEffect } from 'react';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export default function AmountInput({ value, onChange, className = '' }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState(value.toFixed(1));

  useEffect(() => {
    setDisplayValue(value.toFixed(1));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, '');
    setDisplayValue(raw);
    
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      onChange(Math.round(parsed * 10) / 10);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(displayValue);
    if (isNaN(parsed)) {
      setDisplayValue('0.0');
      onChange(0);
    } else {
      const rounded = Math.round(parsed * 10) / 10;
      setDisplayValue(rounded.toFixed(1));
      onChange(rounded);
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <span className="text-5xl font-bold text-muted-foreground mr-2">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        className="text-6xl font-bold bg-transparent border-none outline-none text-center text-foreground focus:ring-2 focus:ring-primary rounded-lg w-48"
        data-testid="input-amount"
      />
    </div>
  );
}
