import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';
import type { DraggableAttributes } from '@dnd-kit/core';


interface SortableCardProps {
  id: string;
  children: ReactNode;
}
interface SortableCardChildProps {
  dragListeners?: Record<string, unknown>;
  dragAttributes?: DraggableAttributes;
}

export function SortableCard({ id, children }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="card"   
    >
      {React.Children.map(children, child => {
        if (React.isValidElement<SortableCardChildProps>(child)) {
          return React.cloneElement(child, {
            dragListeners: listeners,
          });
        }
        return child;
      })}
    </div>
  );
}