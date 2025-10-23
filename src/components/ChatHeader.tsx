import { Hash, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  channelName: string;
  description: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = ["Project brief", "Resources", "Notes", "KanBan"];

export function ChatHeader({ channelName, description, activeTab, onTabChange }: ChatHeaderProps) {
  const participants = [
    { name: "Will", avatar: "" },
    { name: "Bea", avatar: "" },
    { name: "Carter", avatar: "" },
    { name: "Emily", avatar: "" },
  ];

  return (
    <div className="border-b border-border bg-background">
      {/* Channel Info */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-foreground" />
            <h2 className="font-bold text-lg text-foreground">{channelName}</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Star className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.map((participant, i) => (
              <Avatar key={i} className="h-8 w-8 border-2 border-background">
                <AvatarImage src={participant.avatar} />
                <AvatarFallback className="text-xs">{participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            74
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex items-center gap-6 border-t border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className="px-6 py-2 bg-muted/30">
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
