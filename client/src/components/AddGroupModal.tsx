import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/contexts/DataContext';

interface AddGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, members: string[], icon: string) => void;
  friends: User[];
}

const groupIcons = ['🎲', '🎮', '🏠', '✈️', '🍽️', '🎉', '💼', '🎯'];

export default function AddGroupModal({ isOpen, onClose, onAdd, friends }: AddGroupModalProps) {
  const [name, setName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [selectedIcon, setSelectedIcon] = useState(groupIcons[0]);

  const toggleMember = (id: string) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    if (name.trim() && selectedMembers.length > 0) {
      onAdd(name.trim(), selectedMembers, selectedIcon);
      setName('');
      setSelectedMembers([]);
      setSelectedIcon(groupIcons[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-3xl neu-raised border-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Group</DialogTitle>
          <DialogDescription>
            Create a group to organize recurring expenses
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName" className="font-semibold">Group Name</Label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Poker Night"
              className="rounded-xl neu-inset border-none"
              data-testid="input-group-name"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Choose Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {groupIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    selectedIcon === icon 
                      ? 'neu-pressed ring-2 ring-primary' 
                      : 'neu-interactive-sm'
                  }`}
                  data-testid={`group-icon-${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Select Members ({selectedMembers.length} selected)</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.filter(f => !f.isGroup).map((friend) => (
                <label
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-xl neu-interactive-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedMembers.includes(friend.id)}
                    onCheckedChange={() => toggleMember(friend.id)}
                    data-testid={`checkbox-member-${friend.id}`}
                  />
                  <Avatar className="w-10 h-10">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/${friend.avatar}/svg?seed=${friend.name}`} 
                      alt={friend.name} 
                    />
                    <AvatarFallback>{friend.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{friend.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <button 
            className="flex-1 py-3 rounded-xl font-semibold neu-btn"
            onClick={onClose} 
            data-testid="button-cancel-add-group"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={!name.trim() || selectedMembers.length === 0}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              name.trim() && selectedMembers.length > 0
                ? 'bg-primary text-primary-foreground neu-btn' 
                : 'bg-muted text-muted-foreground neu-pressed cursor-not-allowed'
            }`}
            data-testid="button-confirm-add-group"
          >
            Create Group
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
