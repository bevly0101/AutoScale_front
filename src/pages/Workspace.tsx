import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import AccessDenied from '@/components/AccessDenied';
import { AppSidebar } from '@/components/AppSidebar';

const Workspace: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const workspaceId = searchParams.get('id');

  useEffect(() => {
    const checkMembership = async () => {
      if (!workspaceId) {
        navigate('/');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { count, error } = await supabase
          .from('workspacemembers')
          .select('id', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setIsMember(count !== null && count > 0);
      } catch (error) {
        console.error('Error checking workspace membership:', error);
        setIsMember(false);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [workspaceId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Verificando acesso ao workspace...</span>
        </div>
      </div>
    );
  }

  if (!isMember) {
    return <AccessDenied />;
  }

  return (
    <div className="flex h-screen">
      <AppSidebar workspaceId={workspaceId} />
      <main className="flex-1 p-6">
        <h1>Workspace Page</h1>
        <p>Workspace ID: {workspaceId}</p>
      </main>
    </div>
  );
};

export default Workspace;