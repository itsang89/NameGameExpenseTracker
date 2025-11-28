import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LeaderboardItem from '@/components/LeaderboardItem';
import AchievementCard from '@/components/AchievementCard';
import { useData } from '@/contexts/DataContext';

export default function Analytics() {
  const { users, transactions } = useData();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [timeFilter, setTimeFilter] = useState('month');
  const [gameFilter, setGameFilter] = useState('all');

  const friends = users.filter(u => !u.isGroup);
  const leaderboard = [...friends].sort((a, b) => b.balance - a.balance);

  const gameTransactions = transactions.filter(t => t.type === 'game');
  
  const achievements = useMemo(() => {
    const biggestWinner = [...friends].sort((a, b) => b.balance - a.balance)[0];
    
    const playerGameCounts = friends.map(f => ({
      ...f,
      games: gameTransactions.filter(t => t.involvedUsers.some(u => u.userId === f.id)).length
    }));
    const mostPlayed = playerGameCounts.sort((a, b) => b.games - a.games)[0];

    return {
      biggestWinner: biggestWinner ? {
        value: `+$${biggestWinner.balance.toFixed(1)}`,
        holder: biggestWinner.name
      } : { value: '$0', holder: 'No winner yet' },
      winStreak: { value: '3 wins', holder: leaderboard[0]?.name || 'No streak' },
      mostPlayed: mostPlayed ? {
        value: `${mostPlayed.games} games`,
        holder: mostPlayed.name
      } : { value: '0 games', holder: 'No games yet' }
    };
  }, [friends, gameTransactions, leaderboard]);

  // todo: remove mock functionality - generate chart data
  const chartData = useMemo(() => {
    const days = 30;
    const data = [];
    let runningTotal = 0;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const change = (Math.random() - 0.45) * 20;
      runningTotal += change;
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(runningTotal * 10) / 10
      });
    }
    return data;
  }, []);

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
      </header>

      <main className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="leaderboard" className="flex-1">Leaderboard</TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="leaderboard" className="space-y-6 mt-4">
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={timeFilter === 'week' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setTimeFilter('week')}
              >
                This Week
              </Badge>
              <Badge 
                variant={timeFilter === 'month' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setTimeFilter('month')}
              >
                This Month
              </Badge>
              <Badge 
                variant={gameFilter === 'all' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setGameFilter('all')}
              >
                All Games
              </Badge>
              <Badge 
                variant={gameFilter === 'poker' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setGameFilter('poker')}
              >
                Poker
              </Badge>
            </div>

            <section>
              <h3 className="text-lg font-semibold mb-3">Hall of Fame</h3>
              <Card className="divide-y divide-border">
                {leaderboard.map((user, index) => (
                  <LeaderboardItem
                    key={user.id}
                    rank={index + 1}
                    name={user.name}
                    avatar={user.avatar}
                    amount={user.balance}
                    gamesPlayed={gameTransactions.filter(t => 
                      t.involvedUsers.some(u => u.userId === user.id)
                    ).length}
                  />
                ))}
              </Card>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Achievements</h3>
              <div className="grid gap-3">
                <AchievementCard 
                  type="biggest-winner"
                  title="Biggest Winner"
                  value={achievements.biggestWinner.value}
                  holder={achievements.biggestWinner.holder}
                />
                <AchievementCard 
                  type="win-streak"
                  title="Win Streak"
                  value={achievements.winStreak.value}
                  holder={achievements.winStreak.holder}
                />
                <AchievementCard 
                  type="most-played"
                  title="Most Played"
                  value={achievements.mostPlayed.value}
                  holder={achievements.mostPlayed.holder}
                />
              </div>
            </section>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6 mt-4">
            <section>
              <h3 className="text-lg font-semibold mb-3">Net Profit (30 Days)</h3>
              <Card className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(1)}`, 'Net']}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#colorValue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Game Distribution</h3>
              <div className="grid grid-cols-3 gap-3">
                <Card className="p-4 text-center bg-chart-1/10">
                  <p className="text-3xl font-bold text-chart-1">
                    {gameTransactions.filter(t => t.gameType === 'poker').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Poker</p>
                </Card>
                <Card className="p-4 text-center bg-coral/10">
                  <p className="text-3xl font-bold text-coral">
                    {gameTransactions.filter(t => t.gameType === 'mahjong').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Mahjong</p>
                </Card>
                <Card className="p-4 text-center bg-positive/10">
                  <p className="text-3xl font-bold text-positive">
                    {gameTransactions.filter(t => t.gameType === 'blackjack').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Blackjack</p>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
