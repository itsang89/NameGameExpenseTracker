import FriendAvatar from '../FriendAvatar';

export default function FriendAvatarExample() {
  return (
    <div className="flex gap-4 p-4 flex-wrap">
      <FriendAvatar name="Alex" avatar="adventurer" balance={45.5} showBalance showWinnerBadge onClick={() => console.log('Alex clicked')} />
      <FriendAvatar name="Sarah" avatar="avataaars" balance={-32.0} showBalance onClick={() => console.log('Sarah clicked')} />
      <FriendAvatar name="Mike" avatar="bottts" balance={120.0} showBalance showWinnerBadge onClick={() => console.log('Mike clicked')} />
      <FriendAvatar name="Emma" avatar="big-smile" balance={0} showBalance onClick={() => console.log('Emma clicked')} />
    </div>
  );
}
