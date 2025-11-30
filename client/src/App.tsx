import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider, useData } from "@/contexts/DataContext";
import BottomNavigation from "@/components/BottomNavigation";
import Dashboard from "@/pages/Dashboard";
import LogLoan from "@/pages/LogLoan";
import LogGame from "@/pages/LogGame";
import Friends from "@/pages/Friends";
import Analytics from "@/pages/Analytics";
import Profile from "@/pages/Profile";
import FriendDetail from "@/pages/FriendDetail";
import TransactionDetail from "@/pages/TransactionDetail";
import TransactionHistory from "@/pages/TransactionHistory";

type View = 'home' | 'friends' | 'analytics' | 'profile' | 'log-loan' | 'log-game' | 'friend-detail' | 'transaction-detail' | 'transaction-history';

function AppContent() {
  const { transactions } = useData();
  const [currentView, setCurrentView] = useState<View>('home');
  const [activeTab, setActiveTab] = useState('home');
  const [prevTab, setPrevTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [transactionFilterType, setTransactionFilterType] = useState<'loan' | 'expense' | 'game' | 'payment' | undefined>();

  const getTabIndex = (tab: string) => {
    const tabOrder = ['home', 'friends', 'analytics', 'profile'];
    return tabOrder.indexOf(tab);
  };

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
    setPrevTab(activeTab);
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
    setCurrentView('friend-detail');
  };

  const handleTransactionClick = (id: string) => {
    setSelectedTransactionId(id);
    setCurrentView('transaction-detail');
  };

  const handleStatCardClick = (type: 'loan' | 'expense' | 'game' | 'payment') => {
    // If game type, navigate to last game detail if available
    if (type === 'game') {
      const lastGame = transactions.find(t => t.type === 'game');
      if (lastGame) {
        setSelectedTransactionId(lastGame.id);
        setCurrentView('transaction-detail');
        return;
      }
    }
    setTransactionFilterType(type);
    setCurrentView('transaction-history');
  };

  const getAnimationClass = () => {
    const currentIndex = getTabIndex(currentView);
    const prevIndex = getTabIndex(prevTab);
    
    if (currentView === prevTab) return '';
    
    // If swiping to a tab on the right, slide in from right
    if (currentIndex > prevIndex) return 'tab-enter-right';
    // If swiping to a tab on the left, slide in from left
    return 'tab-enter-left';
  };

  const renderView = () => {
    const viewContent = (() => {
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
        case 'friend-detail':
          return selectedFriendId ? (
            <FriendDetail 
              friendId={selectedFriendId} 
              onBack={handleBack} 
              onTransactionClick={handleTransactionClick}
            />
          ) : null;
        case 'transaction-detail':
          return selectedTransactionId ? (
            <TransactionDetail 
              transactionId={selectedTransactionId}
              onBack={handleBack}
            />
          ) : null;
        case 'transaction-history':
          return (
            <TransactionHistory 
              onBack={handleBack}
              onTransactionClick={handleTransactionClick}
              filterType={transactionFilterType}
            />
          );
        case 'home':
        default:
          return (
            <Dashboard
              onLogLoan={handleLogLoan}
              onLogGame={handleLogGame}
              onFriendClick={handleFriendClick}
              onTransactionClick={handleTransactionClick}
              onStatCardClick={handleStatCardClick}
              onViewAllFriends={handleViewAllFriends}
              onViewAllTransactions={handleViewAllTransactions}
            />
          );
      }
    })();
    
    return <div className={getAnimationClass()}>{viewContent}</div>;
  };

  const showBottomNav = !['log-loan', 'log-game', 'friend-detail', 'transaction-detail', 'transaction-history'].includes(currentView);

  const handleViewAllFriends = () => {
    setCurrentView('friends');
    setActiveTab('friends');
  };

  const handleViewAllTransactions = () => {
    setTransactionFilterType(undefined);
    setCurrentView('transaction-history');
  };

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
