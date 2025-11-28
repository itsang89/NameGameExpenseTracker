import { useState } from 'react';
import { Plus, Phone, MessageCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AddFriendModal from '@/components/AddFriendModal';
import AddGroupModal from '@/components/AddGroupModal';
import SettleUpModal from '@/components/SettleUpModal';
import { useData } from '@/contexts/DataContext';

interface FriendsProps {
  onFriendClick: (id: string) => void;
}

export default function Friends({ onFriendClick }: FriendsProps) {
  const { users, addUser, removeUser, settleUp } = useData();
  
  const [activeTab, setActiveTab] = useState('all');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [settleUpUser, setSettleUpUser] = useState<string | null>(null);
  const [deleteUser, setDeleteUser] = useState<string | null>(null);

  const friends = users.filter(u => !u.isGroup);
  const groups = users.filter(u => u.isGroup);
  
  const displayUsers = activeTab === 'all' 
    ? users 
    : activeTab === 'friends' 
      ? friends 
      : groups;

  const getBalanceDisplay = (balance: number) => {
    if (balance > 0) return { text: `Owes you $${balance.toFixed(1)}`, color: 'text-positive' };
    if (balance < 0) return { text: `You owe $${Math.abs(balance).toFixed(1)}`, color: 'text-negative' };
    return { text: 'Settled up', color: 'text-muted-foreground' };
  };

  const handleAddFriend = (name: string, avatar: string) => {
    addUser({ name, avatar });
  };

  const handleAddGroup = (name: string, members: string[], icon: string) => {
    addUser({ name, avatar: 'initials', isGroup: true, members });
  };

  const selectedUserForSettle = users.find(u => u.id === settleUpUser);

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="p-4 rounded-2xl neu-raised">
          <h1 className="text-xl font-bold text-foreground">Friends & Groups</h1>
        </div>
      </header>

      <main className="px-4 space-y-4">
        <div className="p-1 rounded-2xl neu-raised">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-transparent gap-1">
              <TabsTrigger 
                value="all" 
                className={`flex-1 rounded-xl py-2.5 ${activeTab === 'all' ? 'neu-pressed' : 'neu-btn'}`}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="friends" 
                className={`flex-1 rounded-xl py-2.5 ${activeTab === 'friends' ? 'neu-pressed' : 'neu-btn'}`}
              >
                Friends ({friends.length})
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className={`flex-1 rounded-xl py-2.5 ${activeTab === 'groups' ? 'neu-pressed' : 'neu-btn'}`}
              >
                Groups ({groups.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-3">
          {displayUsers.map((user) => {
            const balanceDisplay = getBalanceDisplay(user.balance);
            
            return (
              <div 
                key={user.id} 
                className="p-4 rounded-2xl bg-background neu-raised"
              >
                <div className="flex items-center gap-3">
                  <div onClick={() => onFriendClick(user.id)} className="flex items-center gap-3 flex-1 cursor-pointer">
                    {user.isGroup ? (
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl neu-raised-sm">
                        🎲
                      </div>
                    ) : (
                      <div className="p-1 rounded-full neu-raised-sm">
                        <Avatar className="w-11 h-11">
                          <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{user.name}</p>
                      <p className={`text-sm font-medium ${balanceDisplay.color}`}>
                        {user.isGroup ? `${user.members?.length} members` : balanceDisplay.text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!user.isGroup && user.balance !== 0 && (
                      <button 
                        className="px-3 py-1.5 rounded-lg text-sm font-semibold text-primary neu-btn"
                        onClick={() => setSettleUpUser(user.id)}
                        data-testid={`button-settle-${user.id}`}
                      >
                        Settle
                      </button>
                    )}
                    <button 
                      className="p-2 rounded-lg neu-interactive-sm"
                      onClick={() => console.log('Call', user.name)}
                      data-testid={`button-call-${user.id}`}
                    >
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-2 rounded-lg neu-interactive-sm"
                      onClick={() => console.log('Message', user.name)}
                      data-testid={`button-message-${user.id}`}
                    >
                      <MessageCircle className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button 
                      className="p-2 rounded-lg neu-interactive-sm"
                      onClick={() => setDeleteUser(user.id)}
                      data-testid={`button-delete-${user.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-negative" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-24 right-4">
        <button
          className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center neu-btn"
          onClick={() => activeTab === 'groups' ? setShowAddGroup(true) : setShowAddFriend(true)}
          data-testid="button-add-friend-group"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <AddFriendModal 
        isOpen={showAddFriend} 
        onClose={() => setShowAddFriend(false)} 
        onAdd={handleAddFriend}
      />

      <AddGroupModal 
        isOpen={showAddGroup} 
        onClose={() => setShowAddGroup(false)} 
        onAdd={handleAddGroup}
        friends={friends}
      />

      {selectedUserForSettle && (
        <SettleUpModal
          isOpen={!!settleUpUser}
          onClose={() => setSettleUpUser(null)}
          userName={selectedUserForSettle.name}
          userAvatar={selectedUserForSettle.avatar}
          balance={selectedUserForSettle.balance}
          onSettle={(amount) => settleUp(selectedUserForSettle.id, amount)}
        />
      )}

      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent className="rounded-3xl neu-raised border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {users.find(u => u.id === deleteUser)?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove them from your list. Any outstanding balances will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl neu-btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-negative hover:bg-negative/90 neu-btn"
              onClick={() => {
                if (deleteUser) removeUser(deleteUser);
                setDeleteUser(null);
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
