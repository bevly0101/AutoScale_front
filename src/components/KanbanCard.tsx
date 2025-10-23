import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle } from "lucide-react";

interface Card {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority?: "high" | "medium" | "low";
  labels?: string[];
}

interface KanbanCardProps {
  card: Card;
}

const priorityColors = {
  high: "destructive",
  medium: "default",
  low: "secondary",
} as const;

export function KanbanCard({ card }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card p-3 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors"
    >
      {/* Card Title */}
      <h4 className="font-medium text-sm mb-2">{card.title}</h4>

      {/* Card Description */}
      {card.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.map((label, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {label}
            </Badge>
          ))}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          {/* Priority */}
          {card.priority && (
            <Badge variant={priorityColors[card.priority]} className="text-xs">
              {card.priority}
            </Badge>
          )}

          {/* Due Date */}
          {card.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{card.dueDate}</span>
            </div>
          )}
        </div>

        {/* Assignee */}
        {card.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {card.assignee.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
