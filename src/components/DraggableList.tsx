import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { GripVertical } from 'lucide-react';

interface DraggableListProps {
  initialItems?: string[];
}

// ISSUE-053: Drag-and-drop broken — onDragOver is missing e.preventDefault().
// The browser marks every potential drop target as non-droppable by default.
// The only way to allow a drop is to cancel the dragover event via preventDefault().
// Without it, the cursor shows the "no-drop" icon and onDrop never fires.
const DraggableList = ({
  initialItems = [
    'Research market trends',
    'Design system architecture',
    'Write unit tests',
    'Code review',
    'Deploy to staging',
  ],
}: DraggableListProps) => {
  const [items, setItems] = useState(initialItems);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GripVertical className="h-4 w-4" />
          Task Priority (Drag to Reorder)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              draggable
              role='button'
              tabIndex={0}
              onDragStart={() => {
                setDraggedIndex(index);
              }}
              // BUG ISSUE-053: onDragOver handler is absent entirely.
              // Without onDragOver={(e) => e.preventDefault()} the browser
              // rejects every drop target and onDrop never fires — items
              // cannot be reordered regardless of how the user drags them.
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDragEnter={() => setDragOverIndex(index)}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex === null || draggedIndex === index) return;
                const reordered = [...items];
                const [moved] = reordered.splice(draggedIndex, 1);
                reordered.splice(index, 0, moved);
                setItems(reordered);
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`flex items-center gap-2 p-2.5 border rounded text-sm select-none transition-colors ${
                draggedIndex === index
                  ? 'opacity-40 bg-muted'
                  : dragOverIndex === index
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300'
                    : 'bg-background hover:bg-muted/50'
              }`}
              style={{ cursor: 'grab' }}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="flex-1">{item}</span>
              <span className="text-[10px] text-muted-foreground">#{index + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Tip: Try dragging a row — drops never land because dragover preventDefault is missing.
        </p>
      </CardContent>
    </Card>
  );
};

export default DraggableList;
