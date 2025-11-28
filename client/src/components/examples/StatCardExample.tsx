import StatCard from '../StatCard';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <StatCard type="owe" amount={47.5} onClick={() => console.log('Owe clicked')} />
      <StatCard type="owed" amount={165.5} onClick={() => console.log('Owed clicked')} />
      <StatCard type="net" amount={118.0} onClick={() => console.log('Net clicked')} />
      <StatCard type="game" amount={25.0} label="Poker Night" onClick={() => console.log('Game clicked')} />
    </div>
  );
}
