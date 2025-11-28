import AchievementCard from '../AchievementCard';

export default function AchievementCardExample() {
  return (
    <div className="space-y-3 p-4">
      <AchievementCard 
        type="biggest-winner" 
        title="Biggest Winner" 
        value="+$120.0" 
        holder="Mike" 
      />
      <AchievementCard 
        type="win-streak" 
        title="Win Streak" 
        value="5 wins" 
        holder="Alex" 
      />
      <AchievementCard 
        type="most-played" 
        title="Most Played" 
        value="8 games" 
        holder="Sarah" 
      />
    </div>
  );
}
