import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

interface Teammate {
  id: string;
  nome: string | null;
  email: string;
}

interface CreateWorkspaceFormProps {
  onClose: () => void;
  onWorkspaceCreated: () => void;
}

export const CreateWorkspaceForm: React.FC<CreateWorkspaceFormProps> = ({ onClose, onWorkspaceCreated }) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [teammateEmail, setTeammateEmail] = useState("");
  const [teammates, setTeammates] = useState<Teammate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddTeammate = async () => {
    if (!teammateEmail) return;

    const { data, error } = await supabase
      .from("users")
      .select("id, nome, email")
      .eq("email", teammateEmail);

    if (error || !data || data.length === 0) {
      setError("User not found.");
    } else {
      const user = (data as any)[0];
      if (!teammates.find((t) => t.id === user.id)) {
        setTeammates([...teammates, user]);
      }
      setTeammateEmail("");
      setError(null);
    }
  };

  const handleCreateWorkspace = async () => {
    console.log("handleCreateWorkspace called");
    setIsCreating(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        // 1. Create the workspace
        console.log("Creating workspace with name:", workspaceName);
        const { data: workspaceData, error: workspaceError } = await supabase
          .from("workspace")
          .insert([{ nome: workspaceName, owner_id: user.id }] as any)
          .select()
          .single();

        if (workspaceError) throw workspaceError;
        if (!workspaceData) throw new Error("Workspace creation failed.");
        console.log("Workspace created:", workspaceData);

        // 2. Add owner as admin
        console.log("Adding owner to workspacemembers");
        const { error: ownerMemberError } = await supabase
          .from("workspacemembers")
          .insert([
            {
              workspace_id: (workspaceData as any).id,
              user_id: user.id,
              role_id: 1, // Admin
            },
          ] as any);

        if (ownerMemberError) throw ownerMemberError;
        console.log("Owner added to workspace");

        // 3. Add teammates
        if (teammates.length > 0) {
          console.log("Adding teammates:", teammates);
          const newMembers = teammates.map((t) => ({
            workspace_id: (workspaceData as any).id,
            user_id: t.id,
            role_id: 2, // Member
          }));

          const { error: membersError } = await supabase
            .from("workspacemembers")
            .insert(newMembers as any);

          if (membersError) throw membersError;
          console.log("Teammates added");
        }

        console.log("Workspace creation successful. Calling callbacks.");
        onWorkspaceCreated();
        onClose();
      } catch (error) {
        console.error("An error occurred during workspace creation:", error);
      } finally {
        setIsCreating(false);
      }
    } else {
      console.error("User is not authenticated.");
      setIsCreating(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Create Workspace</h2>
      <div className={`space-y-4 ${isCreating ? 'opacity-50' : ''}`}>
        <div>
          <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700">
            Workspace Name
          </label>
          <Input
            id="workspaceName"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            placeholder="Enter workspace name"
          />
        </div>
        <div>
          <label htmlFor="teammateEmail" className="block text-sm font-medium text-gray-700">
            Add Teammates (by email)
          </label>
          <div className="flex gap-2">
            <Input
              id="teammateEmail"
              value={teammateEmail}
              onChange={(e) => setTeammateEmail(e.target.value)}
              placeholder="Enter teammate's email"
            />
            <Button onClick={handleAddTeammate}>Add</Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div className="space-y-2">
          {teammates.map((t) => (
            <div key={t.id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{t.nome} ({t.email})</span>
            </div>
          ))}
        </div>
        <Button onClick={handleCreateWorkspace} className="w-full" disabled={isCreating}>
          {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isCreating ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </div>
  );
};