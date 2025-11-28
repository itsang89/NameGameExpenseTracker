import FloatingActionButton from '../FloatingActionButton';

export default function FloatingActionButtonExample() {
  return (
    <div className="relative h-40">
      <FloatingActionButton 
        onLogLoan={() => console.log('Log Loan clicked')} 
        onLogGame={() => console.log('Log Game clicked')} 
      />
    </div>
  );
}
