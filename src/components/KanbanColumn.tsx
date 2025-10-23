import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "@/components/KanbanCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface Card {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  labels?: string[];
}

interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

interface KanbanColumnProps {
  column: Column;
  onAddCard: (columnId: string, card: Card) => void;
  onCardClick: (card: Card) => void;
}

export function KanbanColumn({ column, onAddCard, onCardClick }: KanbanColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, {
        id: Date.now().toString(),
        title: newCardTitle,
        priority: "medium",
      });
      setNewCardTitle("");
      setIsAdding(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col w-80 bg-background rounded-lg border border-border flex-shrink-0"
    >
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold">{column.title}</h3>
            <span className="text-sm text-muted-foreground">
              {column.cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px]">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <div key={card.id} onClick={() => onCardClick(card)}>
              <KanbanCard card={card} />
            </div>
          ))}
        </SortableContext>

        {/* Add Card Form */}
        {isAdding ? (
          <div className="space-y-2 p-2">
            <Input
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewCardTitle("");
                }
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Add card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewCardTitle("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add card
          </Button>
        )}
      </div>
    </div>
  );
}
