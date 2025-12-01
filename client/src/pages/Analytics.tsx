import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LeaderboardItem from '@/components/LeaderboardItem';
import AchievementCard from '@/components/AchievementCard';
import { useData } from '@/contexts/DataContext';

export default function Analytics() {
  const { currentUser, users, transactions } = useData();
  const [activeTab, setActiveTab] = useState('leaderboard');
  const [prevTab, setPrevTab] = useState('leaderboard');
  const [timeFilter, setTimeFilter] = useState('month');
  const [gameFilter, setGameFilter] = useState('all');

  const handleTabChange = (tab: string) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const friends = users.filter(u => !u.isGroup);
  const allPlayers = [currentUser, ...friends];
  const leaderboard = [...allPlayers].sort((a, b) => b.balance - a.balance);

  const gameTransactions = transactions.filter(t => t.type === 'game');
  
  const achievements = useMemo(() => {
    const biggestWinner = [...allPlayers].sort((a, b) => b.balance - a.balance)[0];
    
    const playerGameCounts = allPlayers.map(p => ({
      ...p,
      games: gameTransactions.filter(t => t.involvedUsers.some(u => u.userId === p.id)).length
    }));
    const mostPlayed = playerGameCounts.sort((a, b) => b.games - a.games)[0];

    return {
      biggestWinner: biggestWinner ? {
        value: `+$${biggestWinner.balance.toFixed(1)}`,
        holder: biggestWinner.id === 'current' ? currentUser.name : biggestWinner.name
      } : { value: '$0', holder: 'No winner yet' },
      winStreak: { value: '3 wins', holder: leaderboard[0] ? (leaderboard[0].id === 'current' ? currentUser.name : leaderboard[0].name) : 'No streak' },
      mostPlayed: mostPlayed ? {
        value: `${mostPlayed.games} games`,
        holder: mostPlayed.id === 'current' ? currentUser.name : mostPlayed.name
      } : { value: '0 games', holder: 'No games yet' }
    };
  }, [allPlayers, gameTransactions, leaderboard, currentUser]);

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
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="p-4 rounded-2xl neu-raised">
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        </div>
      </header>

      <main className="px-4 space-y-4">
        <div className="p-1 rounded-2xl neu-raised">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="w-full bg-transparent gap-1">
              <TabsTrigger 
                value="leaderboard" 
                className={`flex-1 rounded-xl py-2.5 ${activeTab === 'leaderboard' ? 'neu-pressed' : 'neu-btn'} active:neu-click`}
              >
                Leaderboard
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className={`flex-1 rounded-xl py-2.5 ${activeTab === 'trends' ? 'neu-pressed' : 'neu-btn'} active:neu-click`}
              >
                Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className={`space-y-6 mt-4 px-2 pb-2 ${activeTab === 'leaderboard' && prevTab !== 'leaderboard' ? 'tab-enter-right' : ''}`}>
              <div className="flex gap-2 flex-wrap">
                <Badge 
                  variant={timeFilter === 'week' ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-lg px-3 py-1 ${timeFilter === 'week' ? 'neu-pressed' : 'neu-btn'}`}
                  onClick={() => setTimeFilter('week')}
                >
                  This Week
                </Badge>
                <Badge 
                  variant={timeFilter === 'month' ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-lg px-3 py-1 ${timeFilter === 'month' ? 'neu-pressed' : 'neu-btn'}`}
                  onClick={() => setTimeFilter('month')}
                >
                  This Month
                </Badge>
                <Badge 
                  variant={gameFilter === 'all' ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-lg px-3 py-1 ${gameFilter === 'all' ? 'neu-pressed' : 'neu-btn'}`}
                  onClick={() => setGameFilter('all')}
                >
                  All Games
                </Badge>
                <Badge 
                  variant={gameFilter === 'poker' ? 'default' : 'outline'}
                  className={`cursor-pointer rounded-lg px-3 py-1 ${gameFilter === 'poker' ? 'neu-pressed' : 'neu-btn'}`}
                  onClick={() => setGameFilter('poker')}
                >
                  Poker
                </Badge>
              </div>

              <section>
                <h3 className="text-lg font-semibold mb-3">Hall of Fame</h3>
                <div className="rounded-2xl bg-background neu-raised divide-y divide-border/50">
                  {leaderboard.map((user, index) => {
                    const displayName = user.id === 'current' ? currentUser.name : user.name;
                    return (
                      <LeaderboardItem
                        key={user.id}
                        rank={index + 1}
                        name={displayName}
                        avatar={user.avatar}
                        amount={user.balance}
                        gamesPlayed={gameTransactions.filter(t => 
                          t.involvedUsers.some(u => u.userId === user.id)
                        ).length}
                      />
                    );
                  })}
                </div>
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

            <TabsContent value="trends" className={`space-y-6 mt-4 px-2 pb-2 ${activeTab === 'trends' && prevTab !== 'trends' ? 'tab-enter-left' : ''}`}>
              <section>
                <h3 className="text-lg font-semibold mb-3">Net Profit (30 Days)</h3>
                <div className="p-5 rounded-2xl bg-background neu-raised">
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
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${value.toFixed(1)}`, 'Net']}
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          borderRadius: '12px',
                          boxShadow: 'var(--neu-shadow-raised)',
                          border: 'none'
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
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Game Distribution</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-5 rounded-2xl text-center bg-background neu-glow-primary">
                    <p className="text-3xl font-bold text-primary">
                      {gameTransactions.filter(t => t.gameType === 'poker').length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Poker</p>
                  </div>
                  <div className="p-5 rounded-2xl text-center bg-background neu-raised">
                    <p className="text-3xl font-bold text-coral">
                      {gameTransactions.filter(t => t.gameType === 'mahjong').length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Mahjong</p>
                  </div>
                  <div className="p-5 rounded-2xl text-center bg-background neu-glow-positive">
                    <p className="text-3xl font-bold text-positive">
                      {gameTransactions.filter(t => t.gameType === 'blackjack').length}
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">Blackjack</p>
                  </div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
