import { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Receipt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import AmountInput from '@/components/AmountInput';
import { useData, type User } from '@/contexts/DataContext';

interface LogLoanProps {
  onBack: () => void;
}

const categories = [
  { id: 'restaurant', icon: '🍽️', label: 'Dinner' },
  { id: 'shopping', icon: '🛒', label: 'Shopping' },
  { id: 'rent', icon: '🏠', label: 'Rent' },
  { id: 'travel', icon: '✈️', label: 'Travel' },
  { id: 'games', icon: '🎮', label: 'Games' },
  { id: 'other', icon: '💳', label: 'Other' },
];

export default function LogLoan({ onBack }: LogLoanProps) {
  const { users, addTransaction } = useData();
  const { toast } = useToast();
  
  const [amount, setAmount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('restaurant');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal');
  const [unequalAmounts, setUnequalAmounts] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showParticipantModal, setShowParticipantModal] = useState(false);

  const friends = users.filter(u => !u.isGroup);
  const groups = users.filter(u => u.isGroup);

  const toggleUser = (id: string, user: User) => {
    if (user.isGroup && user.members) {
      const newSelected = selectedUsers.includes(id)
        ? selectedUsers.filter(u => u !== id && !user.members?.includes(u))
        : [...selectedUsers.filter(u => !user.members?.includes(u)), id, ...user.members];
      setSelectedUsers(Array.from(new Set(newSelected)));
    } else {
      setSelectedUsers(prev => 
        prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
      );
    }
  };

  const getEqualSplit = () => {
    const participantCount = selectedUsers.filter(id => !users.find(u => u.id === id)?.isGroup).length + 1;
    return Math.round((amount / participantCount) * 10) / 10;
  };

  const getUnequalTotal = () => {
    return Object.values(unequalAmounts).reduce((sum, val) => sum + val, 0);
  };

  const handleSave = () => {
    if (amount <= 0) {
      toast({ title: 'Invalid amount', description: 'Please enter an amount greater than 0', variant: 'destructive' });
      return;
    }
    if (selectedUsers.length === 0) {
      toast({ title: 'No participants', description: 'Please select at least one participant', variant: 'destructive' });
      return;
    }
    if (splitType === 'unequal' && Math.abs(getUnequalTotal() - amount) > 0.1) {
      toast({ title: 'Split mismatch', description: 'The split amounts do not add up to the total', variant: 'destructive' });
      return;
    }

    const friendIds = selectedUsers.filter(id => !users.find(u => u.id === id)?.isGroup);
    const splitAmount = getEqualSplit();

    addTransaction({
      type: 'loan',
      title: `${categories.find(c => c.id === selectedCategory)?.label || 'Expense'}`,
      category: selectedCategory,
      date,
      totalAmount: amount,
      notes,
      involvedUsers: friendIds.map(id => ({
        userId: id,
        amount: splitType === 'equal' ? splitAmount : (unequalAmounts[id] || 0),
      })),
    });

    toast({ title: 'Loan logged!', description: `$${amount.toFixed(1)} split among ${friendIds.length + 1} people` });
    onBack();
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 p-4">
          <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-back-loan">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Log Loan</h1>
        </div>
      </header>

      <main className="p-4 space-y-6">
        <section className="py-8">
          <AmountInput value={amount} onChange={setAmount} />
          <p className="text-center text-muted-foreground mt-2">Paid by You</p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Category</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Card
                key={cat.id}
                className={`p-3 cursor-pointer hover-elevate active-elevate-2 text-center ${
                  selectedCategory === cat.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedCategory(cat.id)}
                data-testid={`category-${cat.id}`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-sm mt-1">{cat.label}</p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Who is involved?</h3>
          <Card 
            className="p-4 cursor-pointer hover-elevate active-elevate-2"
            onClick={() => setShowParticipantModal(true)}
            data-testid="button-select-participants"
          >
            {selectedUsers.length === 0 ? (
              <p className="text-muted-foreground">Select friends or groups</p>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                {selectedUsers.filter(id => !users.find(u => u.id === id)?.isGroup).map(id => {
                  const user = users.find(u => u.id === id);
                  if (!user) return null;
                  return (
                    <div key={id} className="flex items-center gap-1 bg-primary/10 rounded-full px-2 py-1">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </section>

        {selectedUsers.length > 0 && (
          <section>
            <Tabs value={splitType} onValueChange={(v) => setSplitType(v as 'equal' | 'unequal')}>
              <TabsList className="w-full">
                <TabsTrigger value="equal" className="flex-1">Split Equally</TabsTrigger>
                <TabsTrigger value="unequal" className="flex-1">Split Unequally</TabsTrigger>
              </TabsList>
              <TabsContent value="equal" className="mt-4">
                <Card className="p-4">
                  <p className="text-muted-foreground">
                    Each person pays: <span className="font-semibold text-foreground">${getEqualSplit().toFixed(1)}</span>
                  </p>
                </Card>
              </TabsContent>
              <TabsContent value="unequal" className="mt-4 space-y-3">
                {selectedUsers.filter(id => !users.find(u => u.id === id)?.isGroup).map(id => {
                  const user = users.find(u => u.id === id);
                  if (!user) return null;
                  return (
                    <Card key={id} className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 font-medium">{user.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">$</span>
                          <Input
                            type="number"
                            step="0.1"
                            value={unequalAmounts[id] || ''}
                            onChange={(e) => setUnequalAmounts(prev => ({
                              ...prev,
                              [id]: parseFloat(e.target.value) || 0
                            }))}
                            className="w-24"
                            data-testid={`input-unequal-${id}`}
                          />
                        </div>
                      </div>
                    </Card>
                  );
                })}
                <div className={`text-right font-medium ${Math.abs(getUnequalTotal() - amount) > 0.1 ? 'text-negative' : 'text-positive'}`}>
                  Total: ${getUnequalTotal().toFixed(1)} / ${amount.toFixed(1)}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1"
              data-testid="input-date"
            />
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground mt-2" />
            <Textarea
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 resize-none"
              data-testid="input-notes"
            />
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Attach receipt (coming soon)</span>
          </div>
        </section>

        <Button 
          className="w-full bg-positive hover:bg-positive/90 text-positive-foreground"
          onClick={handleSave}
          data-testid="button-save-loan"
        >
          <Check className="w-5 h-5 mr-2" />
          Save Loan
        </Button>
      </main>

      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Who is involved?</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="friends">
            <TabsList className="w-full">
              <TabsTrigger value="friends" className="flex-1">Friends</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="space-y-2 mt-4">
              {friends.map((friend) => (
                <label key={friend.id} className="flex items-center gap-3 p-3 rounded-xl hover-elevate cursor-pointer">
                  <Checkbox
                    checked={selectedUsers.includes(friend.id)}
                    onCheckedChange={() => toggleUser(friend.id, friend)}
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/${friend.avatar}/svg?seed=${friend.name}`} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{friend.name}</span>
                </label>
              ))}
            </TabsContent>
            <TabsContent value="groups" className="space-y-2 mt-4">
              {groups.map((group) => (
                <label key={group.id} className="flex items-center gap-3 p-3 rounded-xl hover-elevate cursor-pointer">
                  <Checkbox
                    checked={selectedUsers.includes(group.id)}
                    onCheckedChange={() => toggleUser(group.id, group)}
                  />
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                    🎲
                  </div>
                  <div>
                    <span className="font-medium">{group.name}</span>
                    <p className="text-sm text-muted-foreground">{group.members?.length} members</p>
                  </div>
                </label>
              ))}
            </TabsContent>
          </Tabs>
          <Button onClick={() => setShowParticipantModal(false)} className="w-full mt-4">
            Done
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
