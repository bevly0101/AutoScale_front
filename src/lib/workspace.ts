import { supabase } from './supabase';

export async function listWorkspacesForUser(userId: string) {
  const { data, error } = await supabase
    .from('workspacemembers')
    .select('workspace:workspace_id (*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }

  return data.map((item: any) => item.workspace);
}

export async function createWorkspace(workspaceName: string, ownerId: string, members: { id: string }[]) {
  const { data: workspaceData, error: workspaceError } = await supabase
    .from('workspace')
    .insert([{ name: workspaceName, owner_id: ownerId }])
    .select()
    .single();

  if (workspaceError) {
    console.error('Error creating workspace:', workspaceError);
    return null;
  }

  const workspaceId = workspaceData.id;

  const { error: ownerMemberError } = await supabase
    .from('workspacemembers')
    .insert([{ user_id: ownerId, workspace_id: workspaceId, role_id: 1 }]);

  if (ownerMemberError) {
    console.error('Error adding owner to workspace:', ownerMemberError);
  }

  if (members.length > 0) {
    const memberRows = members.map(member => ({
      user_id: member.id,
      workspace_id: workspaceId,
      role_id: 2,
    }));

    const { error: memberInsertError } = await supabase
      .from('workspacemembers')
      .insert(memberRows);

    if (memberInsertError) {
      console.error('Error adding members to workspace:', memberInsertError);
    }
  }

  return workspaceData;
}

export async function searchUsersByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email')
    .like('email', `%${email}%`);

  if (error) {
    console.error('Error searching users:', error);
    return [];
  }

  return data;
}