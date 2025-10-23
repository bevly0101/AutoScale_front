import { Bold, Italic, Strikethrough, Code, Link, List, AtSign, Smile, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface MessageInputProps {
  channelName: string;
  onSendMessage: (message: string) => void;
}

export function MessageInput({ channelName, onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-border bg-background px-6 py-4">
      <div className="border border-border rounded-lg bg-background focus-within:border-ring transition-colors">
        {/* Formatting Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Strikethrough className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Code className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Link className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <List className="h-4 w-4" />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <AtSign className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Text Input */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message #${channelName}`}
            className="min-h-[80px] border-0 focus-visible:ring-0 resize-none p-3"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8"
            disabled={!message.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
