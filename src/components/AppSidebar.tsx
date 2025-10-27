import { useState } from "react";
import { Hash, Plus, ChevronDown, ChevronRight, Pencil, MessageSquare, Inbox, Star, MoreHorizontal, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddChannelModal } from "@/components/AddChannelModal";
import { AddTeammatesModal } from "@/components/AddTeammatesModal";
import { NewMessageModal } from "@/components/NewMessageModal";
import logo from "@/assets/logo_autonotions.png";

interface Channel {
  id: string;
  name: string;
  unread?: number;
}

interface DirectMessage {
  id: string;
  name: string;
  avatar?: string;
  online?: boolean;
  unread?: number;
}

const channels: Channel[] = [
  { id: "1", name: "design-team" },
  { id: "2", name: "social-media", unread: 3 },
  { id: "3", name: "team-finance" },
  { id: "4", name: "announcements" },
  { id: "5", name: "pr" },
];

const directMessages: DirectMessage[] = [
  { id: "1", name: "Will Rodrigues (you)", avatar: "", online: true },
  { id: "2", name: "Bea Rosen", avatar: "", online: true },
  { id: "3", name: "Carter Poplin", avatar: "", online: false },
  { id: "4", name: "Emily Anderson", avatar: "", online: true },
];

interface AppSidebarProps {
  selectedChannel: string;
  onChannelSelect: (channel: string) => void;
}

export function AppSidebar({ selectedChannel, onChannelSelect }: AppSidebarProps) {
  const [channelsExpanded, setChannelsExpanded] = useState(true);
  const [dmsExpanded, setDmsExpanded] = useState(true);
  const [appsExpanded, setAppsExpanded] = useState(true);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [showAddTeammates, setShowAddTeammates] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);

  return (
    <div className="h-full w-64 bg-sidebar flex flex-col border-r border-sidebar-border">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 mb-4">
          <img src={logo} alt="Auto Scale" className="w-10 h-10 rounded-lg" />
          <h1 className="text-sidebar-foreground font-bold text-xl">Auto Scale</h1>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={() => setShowNewMessage(true)}
        >
          <Pencil className="h-4 w-4 mr-2" />
          New message
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        {/* Workspaces */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setChannelsExpanded(!channelsExpanded)}
              className="flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 text-sm font-medium"
            >
              {channelsExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Workspaces
            </button>
          </div>
          {channelsExpanded && (
            <div className="space-y-0.5 pl-4">
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                <MessageSquare className="h-4 w-4 mr-2" />
                Threads
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                <Inbox className="h-4 w-4 mr-2" />
                All DMs
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                <Star className="h-4 w-4 mr-2" />
                Starred
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                <AtSign className="h-4 w-4 mr-2" />
                Mentions
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
                <MoreHorizontal className="h-4 w-4 mr-2" />
                More
              </Button>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onChannelSelect(channel.name)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm ${
                    selectedChannel === channel.name
                      ? "bg-accent text-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <span className="flex items-center">
                    <Hash className="h-4 w-4 mr-1" />
                    {channel.name}
                  </span>
                  {channel.unread && (
                    <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowAddChannel(true)}
                className="w-full flex items-center px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent rounded text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add channel
              </button>
            </div>
          )}
        </div>

        {/* Direct Messages */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setDmsExpanded(!dmsExpanded)}
              className="flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 text-sm font-medium"
            >
              {dmsExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Direct messages
            </button>
          </div>
          {dmsExpanded && (
            <div className="space-y-0.5 pl-4">
              {directMessages.map((dm) => (
                <button
                  key={dm.id}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <span className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={dm.avatar} />
                        <AvatarFallback className="text-xs">{dm.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {dm.online && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-sidebar" />
                      )}
                    </div>
                    <span className="truncate">{dm.name}</span>
                  </span>
                  {dm.unread && (
                    <span className="bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowAddTeammates(true)}
                className="w-full flex items-center px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent rounded text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add teammates
              </button>
            </div>
          )}
        </div>

        {/* Apps */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <button 
              onClick={() => setAppsExpanded(!appsExpanded)}
              className="flex items-center text-sidebar-foreground hover:text-sidebar-foreground/80 text-sm font-medium"
            >
              {appsExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1" />
              )}
              Apps
            </button>
          </div>
          {appsExpanded && (
            <div className="space-y-0.5">
              <button className="w-full flex items-center px-2 py-1.5 text-sidebar-foreground hover:bg-sidebar-accent rounded text-sm">
                <span className="mr-2">📅</span>
                Google Calendar
              </button>
            </div>
          )}
        </div>
      </ScrollArea>

      <AddChannelModal open={showAddChannel} onOpenChange={setShowAddChannel} />
      <AddTeammatesModal open={showAddTeammates} onOpenChange={setShowAddTeammates} />
      <NewMessageModal open={showNewMessage} onOpenChange={setShowNewMessage} />
    </div>
  );
}
