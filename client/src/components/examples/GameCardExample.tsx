import { useState } from 'react';
import GameCard from '../GameCard';

export default function GameCardExample() {
  const [selected, setSelected] = useState<'poker' | 'mahjong' | 'blackjack'>('poker');
  
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      <GameCard type="poker" isSelected={selected === 'poker'} onClick={() => setSelected('poker')} />
      <GameCard type="mahjong" isSelected={selected === 'mahjong'} onClick={() => setSelected('mahjong')} />
      <GameCard type="blackjack" isSelected={selected === 'blackjack'} onClick={() => setSelected('blackjack')} />
    </div>
  );
}
