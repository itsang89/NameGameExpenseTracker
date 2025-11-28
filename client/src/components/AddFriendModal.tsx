import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
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
      <DialogContent className="sm:max-w-md rounded-3xl neu-raised border-none">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Friend</DialogTitle>
          <DialogDescription>
            Add a new friend to split expenses with
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="font-semibold">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter friend's name"
              className="rounded-xl neu-inset border-none"
              data-testid="input-friend-name"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Choose Avatar</Label>
            <div className="grid grid-cols-5 gap-3">
              {avatarStyles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedAvatar(style)}
                  className={`p-1.5 rounded-xl transition-all ${
                    selectedAvatar === style 
                      ? 'neu-pressed ring-2 ring-primary' 
                      : 'neu-interactive-sm'
                  }`}
                  data-testid={`avatar-option-${style}`}
                >
                  <Avatar className="w-11 h-11">
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

        <DialogFooter className="gap-3">
          <button 
            className="flex-1 py-3 rounded-xl font-semibold neu-btn"
            onClick={onClose} 
            data-testid="button-cancel-add-friend"
          >
            Cancel
          </button>
          <button 
            onClick={handleAdd}
            disabled={!name.trim()}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              name.trim() 
                ? 'bg-primary text-primary-foreground neu-btn' 
                : 'bg-muted text-muted-foreground neu-pressed cursor-not-allowed'
            }`}
            data-testid="button-confirm-add-friend"
          >
            Add Friend
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
