import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface Card {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  labels?: string[];
}

interface CardDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: Card;
  onUpdate: (updates: Partial<Card>) => void;
  onDelete: () => void;
}

export function CardDetailsModal({
  open,
  onOpenChange,
  card,
  onUpdate,
  onDelete,
}: CardDetailsModalProps) {
  const [editedCard, setEditedCard] = useState(card);
  const [newLabel, setNewLabel] = useState("");

  const handleSave = () => {
    onUpdate(editedCard);
    toast.success("Card updated successfully");
    onOpenChange(false);
  };

  const handleAddLabel = () => {
    if (newLabel.trim()) {
      setEditedCard({
        ...editedCard,
        labels: [...(editedCard.labels || []), newLabel.trim()],
      });
      setNewLabel("");
    }
  };

  const handleRemoveLabel = (index: number) => {
    setEditedCard({
      ...editedCard,
      labels: editedCard.labels?.filter((_, i) => i !== index),
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this card?")) {
      onDelete();
      toast.success("Card deleted");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={editedCard.title}
              onChange={(e) =>
                setEditedCard({ ...editedCard, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editedCard.description || ""}
              onChange={(e) =>
                setEditedCard({ ...editedCard, description: e.target.value })
              }
              rows={4}
            />
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            <Input
              id="assignee"
              value={editedCard.assignee || ""}
              onChange={(e) =>
                setEditedCard({ ...editedCard, assignee: e.target.value })
              }
              placeholder="Enter assignee name"
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={editedCard.priority}
                onValueChange={(value: "high" | "medium" | "low") =>
                  setEditedCard({ ...editedCard, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={editedCard.dueDate || ""}
                onChange={(e) =>
                  setEditedCard({ ...editedCard, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* Labels */}
          <div className="space-y-2">
            <Label>Labels</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedCard.labels?.map((label, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {label}
                  <button
                    onClick={() => handleRemoveLabel(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add label..."
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddLabel();
                }}
              />
              <Button onClick={handleAddLabel} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Card
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
