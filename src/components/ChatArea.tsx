import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, FileText } from "lucide-react";
import { NotesEditor } from "@/components/NotesEditor";
import { KanbanBoard } from "@/components/KanbanBoard";

interface Message {
  id: string;
  author: string;
  avatar?: string;
  time: string;
  content: string;
  attachments?: Array<{
    type: string;
    title: string;
    description?: string;
  }>;
}

interface ChatAreaProps {
  messages: Message[];
  activeTab: string;
}

export function ChatArea({ messages, activeTab }: ChatAreaProps) {
  const renderTabContent = () => {
    // Show Notes Editor
    if (activeTab === "Notes") {
      return <NotesEditor />;
    }

    // Show KanBan Board
    if (activeTab === "KanBan") {
      return <KanbanBoard />;
    }

    // Show Resources placeholder
    if (activeTab === "Resources") {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Resources</h3>
            <p className="text-sm text-muted-foreground">This section is coming soon</p>
          </div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => {
          const showAvatar = index === 0 || messages[index - 1].author !== message.author;
          
          return (
            <div key={message.id} className={`flex gap-3 hover:bg-chat-hover -mx-6 px-6 py-1 rounded ${showAvatar ? "mt-4" : ""}`}>
              <div className="w-10 flex-shrink-0">
                {showAvatar && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>{message.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="flex-1 min-w-0">
                {showAvatar && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-foreground">{message.author}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                )}
                <div className="text-sm text-foreground">
                  {message.content.split(" ").map((word, i) => {
                    if (word.startsWith("@")) {
                      return (
                        <span key={i} className="bg-accent/20 text-accent-foreground font-medium px-1 rounded">
                          {word}{" "}
                        </span>
                      );
                    }
                    return word + " ";
                  })}
                </div>
                {message.attachments?.map((attachment, i) => (
                  <div key={i} className="mt-2 max-w-md">
                    <div className="border border-border rounded-lg p-3 bg-message-bg hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{attachment.title}</p>
                          {attachment.description && (
                            <p className="text-xs text-muted-foreground mt-1">{attachment.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return renderTabContent();
}
