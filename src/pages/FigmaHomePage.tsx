import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateWorkspaceForm } from "@/components/CreateWorkspaceForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageSquare,
  MessageCircle,
  Users,
  FileText,
  AtSign,
  Bell,
  Star,
  Briefcase,
  PlusCircle,
  Search,
  Settings,
  Pencil,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface NavigationItem {
  text: string;
  icon?: string;
  avatar?: string;
  action?: string;
}

interface NavigationSection {
  title: string;
  icon?: string;
  collapsible?: boolean;
  items: NavigationItem[];
}

const FigmaHomePage = () => {
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);

  const fetchWorkspaces = async () => {
    setLoadingWorkspaces(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: memberData, error: memberError } = await supabase
        .from("workspacemembers")
        .select("workspace_id")
        .eq("user_id", user.id);

      if (memberError) {
        console.error("Error fetching workspace memberships:", memberError);
      } else if (memberData) {
        const workspaceIds = (memberData as any[]).map((m) => m.workspace_id);
        if (workspaceIds.length > 0) {
          const { data: workspaceData, error: workspaceError } = await supabase
            .from("workspace")
            .select("nome")
            .in("id", workspaceIds);

          if (workspaceError) {
            console.error("Error fetching workspaces:", workspaceError);
          } else {
            setWorkspaces(workspaceData || []);
          }
        }
      }
    }
    setLoadingWorkspaces(false);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const toggleSection = (sectionTitle: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionTitle)) {
      newCollapsed.delete(sectionTitle);
    } else {
      newCollapsed.add(sectionTitle);
    }
    setCollapsedSections(newCollapsed);
  };

  const navigationSections: NavigationSection[] = [
    {
      title: "",
      items: [
        { text: "Threads", icon: "message-circle" },
        { text: "All DMs", icon: "users" },
        { text: "Drafts", icon: "file-text" },
        { text: "Mentions & reactions", icon: "at-sign" },
        { text: "Notifications", icon: "bell" }
      ]
    },
    {
      title: "Workspaces",
      icon: "star",
      collapsible: true,
      items: [
        ...workspaces.map((ws) => ({ text: ws.nome, icon: "briefcase" })),
        { text: "Create Workspace", icon: "plus-circle", action: "openCreateWorkspaceModal" }
      ]
    },
    {
      title: "Direct messages",
      collapsible: true,
      items: [
        { text: "Will Rodrigues you", avatar: "./assets/avatar_will_rodrigues.png" },
        { text: "Bea Rosen, Carter Poplin ...", avatar: "./assets/avatar_bea_carter.png" },
        { text: "Add teammates", icon: "plus-circle", action: "openAddTeammatesModal" }
      ]
    }
  ];

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const iconMap: Record<string, React.ReactNode> = {
      "message-square": <MessageSquare className={className} />,
      "message-circle": <MessageCircle className={className} />,
      "users": <Users className={className} />,
      "file-text": <FileText className={className} />,
      "at-sign": <AtSign className={className} />,
      "bell": <Bell className={className} />,
      "star": <Star className={className} />,
      "briefcase": <Briefcase className={className} />,
      "plus-circle": <PlusCircle className={className} />
    };
    return iconMap[iconName] || null;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-[250px] bg-[#360A6E] text-white flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center">
          <div className="flex items-center gap-2">
            <img
              src="/src/assets/logo_autonotions.png"
              alt="Auto Scale Logo"
              className="w-8 h-8"
            />
            <h1 className="text-lg font-semibold">Auto Scale</h1>
          </div>
        </div>

        {/* New Message Button */}
        <div className="p-4">
          <Button className="w-full bg-[#4A2091] hover:bg-[#5B2DAB] text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            New message
          </Button>
        </div>

        {/* Navigation Sections */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <Button
                    variant="ghost"
                    className="w-full justify-between text-white p-2 mb-2"
                    onClick={() => section.collapsible && toggleSection(section.title)}
                  >
                    <div className="flex items-center">
                      {section.icon && renderIcon(section.icon, "w-4 h-4 mr-2")}
                      <span className="text-sm font-medium">{section.title}</span>
                    </div>
                    {section.collapsible && (
                      collapsedSections.has(section.title) ?
                        <ChevronDown className="w-4 h-4" /> :
                        <ChevronUp className="w-4 h-4" />
                    )}
                  </Button>
                )}

                <div className={`space-y-1 ${collapsedSections.has(section.title) ? 'hidden' : ''}`}>
                  {section.items.map((item, itemIndex) => (
                    <Button
                      key={itemIndex}
                      variant="ghost"
                      className="w-full justify-start text-white hover:bg-white/20 p-2 pl-4"
                      onClick={() => {
                        if (item.action === "openCreateWorkspaceModal") {
                          setShowCreateWorkspace(true);
                        }
                      }}
                    >
                      {item.avatar ? (
                        <div className="w-6 h-6 rounded-full bg-gray-400 mr-3 flex items-center justify-center text-xs">
                          {item.text.split(' ')[0][0]}
                        </div>
                      ) : (
                        item.icon && <div className="w-4 h-4 mr-3">{renderIcon(item.icon)}</div>
                      )}
                      <span className="text-sm">{item.text}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#F8F8F8] flex flex-col">
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-white border-b">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-gray-800">Boa tarde, Roberto!</h2>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search Workspace"
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Central Content */}
        <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
          {showCreateWorkspace ? (
            <CreateWorkspaceForm
              onClose={() => setShowCreateWorkspace(false)}
              onWorkspaceCreated={fetchWorkspaces}
            />
          ) : (
            <div className="text-center">
              <div className="w-64 h-64 mx-auto mb-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#FFFFFF' }}>
                <img
                  src="/src/assets/logo_autonotions_menu.png"
                  alt="Auto Scale Logo"
                  className="w-80 h-80 object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm"></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FigmaHomePage;