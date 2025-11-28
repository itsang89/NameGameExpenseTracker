import { useState } from 'react';
import { Plus, Phone, MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-semibold text-foreground">Friends & Groups</h1>
      </header>

      <main className="p-4 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="friends" className="flex-1">Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">Groups ({groups.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {displayUsers.map((user) => {
            const balanceDisplay = getBalanceDisplay(user.balance);
            
            return (
              <Card 
                key={user.id} 
                className="p-4 hover-elevate active-elevate-2"
              >
                <div className="flex items-center gap-3">
                  <div onClick={() => onFriendClick(user.id)} className="flex items-center gap-3 flex-1 cursor-pointer">
                    {user.isGroup ? (
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                        🎲
                      </div>
                    ) : (
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{user.name}</p>
                      <p className={`text-sm ${balanceDisplay.color}`}>
                        {user.isGroup ? `${user.members?.length} members` : balanceDisplay.text}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!user.isGroup && user.balance !== 0 && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSettleUpUser(user.id)}
                        data-testid={`button-settle-${user.id}`}
                      >
                        Settle
                      </Button>
                    )}
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => console.log('Call', user.name)}
                      data-testid={`button-call-${user.id}`}
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => console.log('Message', user.name)}
                      data-testid={`button-message-${user.id}`}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => setDeleteUser(user.id)}
                      className="text-negative"
                      data-testid={`button-delete-${user.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>

      <div className="fixed bottom-20 right-4 flex flex-col gap-2">
        <Button
          size="icon"
          className="w-12 h-12 rounded-full shadow-lg bg-primary"
          onClick={() => activeTab === 'groups' ? setShowAddGroup(true) : setShowAddFriend(true)}
          data-testid="button-add-friend-group"
        >
          <Plus className="w-6 h-6" />
        </Button>
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {users.find(u => u.id === deleteUser)?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove them from your list. Any outstanding balances will be cleared.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-negative hover:bg-negative/90"
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
