import { Card } from '@/components/ui/card';
import LeaderboardItem from '../LeaderboardItem';

export default function LeaderboardItemExample() {
  return (
    <Card className="divide-y divide-border m-4">
      <LeaderboardItem rank={1} name="Mike" avatar="bottts" amount={120.0} gamesPlayed={8} />
      <LeaderboardItem rank={2} name="Alex" avatar="adventurer" amount={45.5} gamesPlayed={6} />
      <LeaderboardItem rank={3} name="Chris" avatar="micah" amount={15.0} gamesPlayed={5} />
      <LeaderboardItem rank={4} name="Emma" avatar="big-smile" amount={-15.5} gamesPlayed={4} />
      <LeaderboardItem rank={5} name="Sarah" avatar="avataaars" amount={-32.0} gamesPlayed={7} />
    </Card>
  );
}
