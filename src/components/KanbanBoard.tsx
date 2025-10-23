import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/KanbanColumn";
import { KanbanCard } from "@/components/KanbanCard";
import { CardDetailsModal } from "@/components/CardDetailsModal";

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

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    color: "#E0E0E0",
    cards: [
      {
        id: "1",
        title: "Design new landing page",
        description: "Create mockups for the new homepage",
        priority: "high",
        assignee: "Bea Rosen",
        labels: ["Design", "UI/UX"],
      },
      {
        id: "2",
        title: "Update documentation",
        priority: "low",
        assignee: "Will Rodrigues",
        labels: ["Documentation"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    color: "#FFC107",
    cards: [
      {
        id: "3",
        title: "Implement user authentication",
        description: "Add login and signup functionality",
        priority: "high",
        assignee: "Carter Poplin",
        labels: ["Backend", "Security"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    color: "#2196F3",
    cards: [
      {
        id: "4",
        title: "Code review for API endpoints",
        priority: "medium",
        assignee: "Emily Anderson",
        labels: ["Backend"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#4CAF50",
    cards: [
      {
        id: "5",
        title: "Set up project repository",
        priority: "high",
        labels: ["DevOps"],
      },
    ],
  },
];

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<{ card: Card; columnId: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = columns
      .flatMap((col) => col.cards)
      .find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveCard(null);
      return;
    }

    const activeCardId = active.id as string;
    const overColumnId = over.id as string;

    // Find the card and its current column
    let sourceColumn: Column | undefined;
    let card: Card | undefined;

    for (const col of columns) {
      const foundCard = col.cards.find((c) => c.id === activeCardId);
      if (foundCard) {
        sourceColumn = col;
        card = foundCard;
        break;
      }
    }

    if (!card || !sourceColumn) {
      setActiveCard(null);
      return;
    }

    // Remove card from source column and add to target column
    const newColumns = columns.map((col) => {
      if (col.id === sourceColumn!.id) {
        return {
          ...col,
          cards: col.cards.filter((c) => c.id !== activeCardId),
        };
      }
      if (col.id === overColumnId) {
        return {
          ...col,
          cards: [...col.cards, card!],
        };
      }
      return col;
    });

    setColumns(newColumns);
    setActiveCard(null);
  };

  const handleAddCard = (columnId: string, card: Card) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, card] }
          : col
      )
    );
  };

  const handleUpdateCard = (cardId: string, columnId: string, updates: Partial<Card>) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? {
              ...col,
              cards: col.cards.map((card) =>
                card.id === cardId ? { ...card, ...updates } : card
              ),
            }
          : col
      )
    );
  };

  const handleDeleteCard = (cardId: string, columnId: string) => {
    setColumns(
      columns.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
          : col
      )
    );
  };

  return (
    <div className="flex-1 overflow-x-auto bg-muted/10">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 p-6 h-full">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddCard={handleAddCard}
              onCardClick={(card) => setSelectedCard({ card, columnId: column.id })}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 opacity-80">
              <KanbanCard card={activeCard} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {selectedCard && (
        <CardDetailsModal
          open={!!selectedCard}
          onOpenChange={(open) => !open && setSelectedCard(null)}
          card={selectedCard.card}
          onUpdate={(updates) =>
            handleUpdateCard(selectedCard.card.id, selectedCard.columnId, updates)
          }
          onDelete={() => {
            handleDeleteCard(selectedCard.card.id, selectedCard.columnId);
            setSelectedCard(null);
          }}
        />
      )}
    </div>
  );
}
