import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name</Label>
            <Input
              id="groupName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Poker Night"
              data-testid="input-group-name"
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {groupIcons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setSelectedIcon(icon)}
                  className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                    selectedIcon === icon 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'bg-muted hover-elevate'
                  }`}
                  data-testid={`group-icon-${icon}`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Members ({selectedMembers.length} selected)</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {friends.filter(f => !f.isGroup).map((friend) => (
                <label
                  key={friend.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover-elevate cursor-pointer"
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-add-group">
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={!name.trim() || selectedMembers.length === 0}
            data-testid="button-confirm-add-group"
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
