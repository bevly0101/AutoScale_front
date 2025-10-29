import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NotificationCardProps {
  avatarUrl?: string;
  userName: string;
  message: string;
  actionText: string;
  onActionClick: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  avatarUrl,
  userName,
  message,
  actionText,
  onActionClick,
}) => {
  return (
    <Card className="flex items-center p-4 space-x-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={`${userName}'s avatar`} />
        <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <p>
          <strong>{userName}</strong> {message}
        </p>
      </div>
      <Button onClick={onActionClick}>{actionText}</Button>
    </Card>
  );
};

export default NotificationCard;