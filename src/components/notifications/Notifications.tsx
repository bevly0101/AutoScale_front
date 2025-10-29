import React, { useEffect, useState } from 'react';
import NotificationCard from './NotificationCard';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Notification = Database['public']['Tables']['notifications']['Row'];

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const markAsRead = async (notificationId: string | null = null) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const query = supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false);

    if (notificationId) {
      query.eq('id', notificationId);
    }

    const { error } = await query;

    if (error) {
      console.error('Error marking notification(s) as read:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data as Notification[]);
          markAsRead(); // Mark all as read on fetch
        }
      }
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Carregando notificações...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <h1 className="text-2xl font-bold mb-4">Notificações</h1>
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              userName={notification.sender_id || 'Sistema'}
              message={notification.message}
              actionText="Ver"
              onActionClick={() => markAsRead(notification.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Você está em dia!</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;