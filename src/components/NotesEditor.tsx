import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, Edit3, Save } from "lucide-react";
import { toast } from "sonner";

export function NotesEditor() {
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const [activeView, setActiveView] = useState<"edit" | "preview">("edit");

  // Auto-save functionality
  useEffect(() => {
    if (!isSaved) {
      const timer = setTimeout(() => {
        // Simulate saving to backend
        localStorage.setItem("notes-content", content);
        setIsSaved(true);
        toast.success("Notes auto-saved");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [content, isSaved]);

  const handleContentChange = (value: string) => {
    setContent(value);
    setIsSaved(false);
  };

  const handleManualSave = () => {
    localStorage.setItem("notes-content", content);
    setIsSaved(true);
    toast.success("Notes saved successfully");
  };

  // Load saved content on mount
  useEffect(() => {
    const saved = localStorage.getItem("notes-content");
    if (saved) {
      setContent(saved);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Toolbar */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "edit" | "preview")}>
            <TabsList>
              <TabsTrigger value="edit" className="gap-2">
                <Edit3 className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {isSaved ? "All changes saved" : "Unsaved changes..."}
          </span>
          <Button onClick={handleManualSave} size="sm" variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "edit" ? (
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing... Supports Markdown!

# Heading 1
## Heading 2
**bold** *italic* ~~strikethrough~~
- Bullet list
1. Numbered list
`code`
```code block```
[link](url)"
            className="h-full w-full resize-none border-0 focus-visible:ring-0 p-6 font-mono"
          />
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="prose prose-slate max-w-none dark:prose-invert">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in Edit mode!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
