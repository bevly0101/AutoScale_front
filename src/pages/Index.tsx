import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatArea } from "@/components/ChatArea";
import { MessageInput } from "@/components/MessageInput";

interface Message {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  time: string;
  attachments?: Array<{ type: string; title: string; description?: string }>;
}

const Index = () => {
  const [selectedChannel, setSelectedChannel] = useState("social-media");
  const [activeTab, setActiveTab] = useState("Project brief");
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "social-media": [
      {
        id: "1",
        author: "Kenny Park",
        content: "Hey @Emily, I attached the updated copy doc to this thread for you to review.",
        time: "11:55",
      },
      {
        id: "2",
        author: "Paul Leung",
        content: "@Lisa Do you want to join the monthly review meeting?",
        time: "11:56",
        attachments: [
          {
            type: "calendar",
            title: "Google Calendar",
            description: "Monthly Design Review - Tomorrow at 3:00 PM",
          },
        ],
      },
      {
        id: "3",
        author: "Emily Anderson",
        content: "Thanks Kenny! I'll take a look at it this afternoon.",
        time: "12:58",
      },
    ],
    "design-team": [
      {
        id: "1",
        author: "Bea Rosen",
        content: "New mockups are ready for review!",
        time: "10:30",
      },
    ],
    "team-finance": [],
    "announcements": [],
    "pr": [],
  });

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      author: "Will Rodrigues (you)",
      content,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedChannel]: [...(prev[selectedChannel] || []), newMessage],
    }));
  };

  const channelDescriptions: Record<string, string> = {
    "social-media": "Track and coordinate social media campaigns and content",
    "design-team": "Collaborate on design projects and reviews",
    "team-finance": "Financial planning and budget discussions",
    "announcements": "Company-wide announcements and updates",
    "pr": "Public relations and press communications",
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar 
        selectedChannel={selectedChannel} 
        onChannelSelect={setSelectedChannel}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          channelName={selectedChannel}
          description={channelDescriptions[selectedChannel] || ""}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        <ChatArea 
          messages={messages[selectedChannel] || []}
          activeTab={activeTab}
        />
        
        <MessageInput 
          channelName={selectedChannel}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Index;
