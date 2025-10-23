import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hash, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface NewMessageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const channels = [
  { id: "1", name: "design-team", type: "channel" },
  { id: "2", name: "social-media", type: "channel" },
  { id: "3", name: "team-finance", type: "channel" },
  { id: "4", name: "announcements", type: "channel" },
  { id: "5", name: "pr", type: "channel" },
];

const users = [
  { id: "1", name: "Will Rodrigues", username: "will", avatar: "" },
  { id: "2", name: "Bea Rosen", username: "bea", avatar: "" },
  { id: "3", name: "Carter Poplin", username: "carter", avatar: "" },
  { id: "4", name: "Emily Anderson", username: "emily", avatar: "" },
];

export function NewMessageModal({ open, onOpenChange }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<{ type: string; name: string; id: string } | null>(null);
  const [message, setMessage] = useState("");

  const filteredChannels = channels.filter((channel) =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase().replace("#", ""))
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase().replace("@", "")) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase().replace("@", ""))
  );

  const handleSelectRecipient = (recipient: { type: string; name: string; id: string }) => {
    setSelectedRecipient(recipient);
    setSearchQuery("");
  };

  const handleSendMessage = () => {
    if (!selectedRecipient || !message.trim()) {
      toast.error("Please select a recipient and enter a message");
      return;
    }

    toast.success(`Message sent to ${selectedRecipient.type === "channel" ? "#" : "@"}${selectedRecipient.name}`);
    setMessage("");
    setSelectedRecipient(null);
    setSearchQuery("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setMessage("");
    setSelectedRecipient(null);
    setSearchQuery("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Recipient */}
          {selectedRecipient ? (
            <div className="flex items-center gap-2 p-2 bg-accent rounded-md">
              <div className="flex items-center gap-2 flex-1">
                {selectedRecipient.type === "channel" ? (
                  <Hash className="h-4 w-4" />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {selectedRecipient.type === "channel" ? "#" : "@"}
                  {selectedRecipient.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setSelectedRecipient(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <Input
                placeholder="Search @user or #channel"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />

              {/* Search Results */}
              {searchQuery && (
                <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
                  {filteredChannels.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground px-2 py-1">Channels</p>
                      {filteredChannels.map((channel) => (
                        <button
                          key={channel.id}
                          onClick={() =>
                            handleSelectRecipient({
                              type: "channel",
                              name: channel.name,
                              id: channel.id,
                            })
                          }
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md"
                        >
                          <Hash className="h-4 w-4" />
                          <span>{channel.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredUsers.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground px-2 py-1">Users</p>
                      {filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          onClick={() =>
                            handleSelectRecipient({
                              type: "user",
                              name: user.name,
                              id: user.id,
                            })
                          }
                          className="w-full flex items-center gap-2 px-2 py-2 hover:bg-accent rounded-md"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col items-start">
                            <span className="text-sm">{user.name}</span>
                            <span className="text-xs text-muted-foreground">@{user.username}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {filteredChannels.length === 0 && filteredUsers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No results found</p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Message Input */}
          {selectedRecipient && (
            <div className="space-y-2">
              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
