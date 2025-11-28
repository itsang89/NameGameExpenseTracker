import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, avatar: string) => void;
}

const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'big-smile', 
  'bottts', 'lorelei', 'micah', 'notionists', 'open-peeps', 'personas'
];

export default function AddFriendModal({ isOpen, onClose, onAdd }: AddFriendModalProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatarStyles[0]);

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim(), selectedAvatar);
      setName('');
      setSelectedAvatar(avatarStyles[0]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter friend's name"
              data-testid="input-friend-name"
            />
          </div>

          <div className="space-y-2">
            <Label>Choose Avatar</Label>
            <div className="grid grid-cols-5 gap-3">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedAvatar(style)}
                  className={`p-1 rounded-xl transition-all ${
                    selectedAvatar === style 
                      ? 'ring-2 ring-primary bg-primary/10' 
                      : 'hover-elevate'
                  }`}
                  data-testid={`avatar-option-${style}`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/${style}/svg?seed=${name || 'preview'}`} 
                      alt={style} 
                    />
                  </Avatar>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-add-friend">
            Cancel
          </Button>
          <Button 
            onClick={handleAdd}
            disabled={!name.trim()}
            data-testid="button-confirm-add-friend"
          >
            Add Friend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
