import { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Receipt, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
    <div className="min-h-screen pb-8">
      <header className="sticky top-0 z-30 bg-background pt-4 px-4 pb-3">
        <div className="flex items-center gap-3 p-3 rounded-2xl neu-raised">
          <button 
            onClick={onBack} 
            className="p-2 rounded-xl neu-interactive-sm active:neu-click"
            data-testid="button-back-loan"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Lend Money</h1>
        </div>
      </header>

      <main className="px-4 space-y-6 pb-32">
        <section className="py-6">
          <AmountInput value={amount} onChange={setAmount} />
          <p className="text-center text-muted-foreground mt-3 font-medium">Amount You Lent</p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Category</h3>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl bg-background cursor-pointer text-center transition-all duration-200 ${
                  selectedCategory === cat.id 
                    ? 'neu-pressed ring-2 ring-primary' 
                    : 'neu-interactive'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
                data-testid={`category-${cat.id}`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-sm mt-1 font-medium">{cat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Who is involved?</h3>
          <div 
            className="p-4 rounded-2xl bg-background neu-interactive cursor-pointer"
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
                    <div key={id} className="flex items-center gap-1 bg-primary/10 rounded-full px-3 py-1.5 neu-raised-sm">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{user.name}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {selectedUsers.length > 0 && (
          <section>
            <div className="p-1 rounded-2xl neu-raised">
              <Tabs value={splitType} onValueChange={(v) => setSplitType(v as 'equal' | 'unequal')}>
                <TabsList className="w-full bg-transparent gap-2">
                  <TabsTrigger 
                    value="equal" 
                    className={`flex-1 rounded-xl py-2.5 transition-all ${splitType === 'equal' ? 'neu-pressed' : 'neu-btn'}`}
                  >
                    Split Equally
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unequal" 
                    className={`flex-1 rounded-xl py-2.5 transition-all ${splitType === 'unequal' ? 'neu-pressed' : 'neu-btn'}`}
                  >
                    Split Unequally
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="equal" className="mt-4 px-3 pb-3">
                  <div className="p-4 rounded-xl neu-inset">
                    <p className="text-muted-foreground">
                      Each person pays: <span className="font-bold text-foreground">${getEqualSplit().toFixed(1)}</span>
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="unequal" className="mt-4 px-3 pb-3 space-y-3">
                  {selectedUsers.filter(id => !users.find(u => u.id === id)?.isGroup).map(id => {
                    const user = users.find(u => u.id === id);
                    if (!user) return null;
                    return (
                      <div key={id} className="p-3 rounded-xl neu-raised-sm">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/${user.avatar}/svg?seed=${user.name}`} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="flex-1 font-semibold">{user.name}</span>
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
                              className="w-24 neu-inset border-none"
                              data-testid={`input-unequal-${id}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className={`text-right font-bold ${Math.abs(getUnequalTotal() - amount) > 0.1 ? 'text-negative' : 'text-positive'}`}>
                    Total: ${getUnequalTotal().toFixed(1)} / ${amount.toFixed(1)}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}

        <section className="space-y-3">
          <div className="flex items-center gap-3 p-4 rounded-2xl neu-raised">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1 neu-inset border-none"
              data-testid="input-date"
            />
          </div>
          <div className="flex items-start gap-3 p-4 rounded-2xl neu-raised">
            <FileText className="w-5 h-5 text-muted-foreground mt-2" />
            <Textarea
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex-1 resize-none neu-inset border-none min-h-[80px]"
              data-testid="input-notes"
            />
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl neu-inset">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            <span className="text-muted-foreground">Attach receipt (coming soon)</span>
          </div>
        </section>

        <button 
          className="w-full py-4 rounded-2xl bg-positive text-positive-foreground font-bold text-lg flex items-center justify-center gap-2 neu-btn"
          onClick={handleSave}
          data-testid="button-save-loan"
        >
          <Check className="w-5 h-5" />
          Save Loan
        </button>
      </main>

      <Dialog open={showParticipantModal} onOpenChange={setShowParticipantModal}>
        <DialogContent className="max-h-[80vh] overflow-y-auto rounded-3xl neu-raised border-none">
          <DialogHeader>
            <DialogTitle>Who is involved?</DialogTitle>
            <DialogDescription>Select friends or groups to split this expense with</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="friends">
            <TabsList className="w-full bg-background neu-raised rounded-xl p-1">
              <TabsTrigger value="friends" className="flex-1 rounded-lg data-[state=active]:neu-pressed">Friends</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1 rounded-lg data-[state=active]:neu-pressed">Groups</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="space-y-2 mt-4">
              {friends.map((friend) => (
                <label key={friend.id} className="flex items-center gap-3 p-3 rounded-xl neu-interactive-sm cursor-pointer">
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
                <label key={group.id} className="flex items-center gap-3 p-3 rounded-xl neu-interactive-sm cursor-pointer">
                  <Checkbox
                    checked={selectedUsers.includes(group.id)}
                    onCheckedChange={() => toggleUser(group.id, group)}
                  />
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg neu-raised-sm">
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
          <button 
            onClick={() => setShowParticipantModal(false)} 
            className="w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold neu-btn"
          >
            Done
          </button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
