import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/contexts/DataContext";
import BottomNavigation from "@/components/BottomNavigation";
import Dashboard from "@/pages/Dashboard";
import LogLoan from "@/pages/LogLoan";
import LogGame from "@/pages/LogGame";
import Friends from "@/pages/Friends";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";

type View = 'home' | 'friends' | 'analytics' | 'profile' | 'log-loan' | 'log-game' | 'friend-detail';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', String(newValue));
      if (newValue) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newValue;
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentView(tab as View);
  };

  const handleLogLoan = () => setCurrentView('log-loan');
  const handleLogGame = () => setCurrentView('log-game');
  
  const handleBack = () => {
    setCurrentView(activeTab as View);
  };

  const handleFriendClick = (id: string) => {
    setSelectedFriendId(id);
    console.log('Friend clicked:', id);
  };

  const handleTransactionClick = (id: string) => {
    console.log('Transaction clicked:', id);
  };

  const renderView = () => {
    switch (currentView) {
      case 'log-loan':
        return <LogLoan onBack={handleBack} />;
      case 'log-game':
        return <LogGame onBack={handleBack} />;
      case 'friends':
        return <Friends onFriendClick={handleFriendClick} />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'home':
      default:
        return (
          <Dashboard
            onLogLoan={handleLogLoan}
            onLogGame={handleLogGame}
            onFriendClick={handleFriendClick}
            onTransactionClick={handleTransactionClick}
          />
        );
    }
  };

  const showBottomNav = !['log-loan', 'log-game', 'friend-detail'].includes(currentView);

  return (
    <div className="min-h-screen bg-background">
      {renderView()}
      {showBottomNav && (
        <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataProvider>
          <AppContent />
          <Toaster />
        </DataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
