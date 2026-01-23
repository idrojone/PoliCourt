import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

export const TrashDroppable: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'trash',
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 border ${
        isOver ? 'bg-red-100 border-red-500 text-red-600' : 'bg-background border-dashed border-gray-300 text-gray-500'
      }`}
    >
      <Trash2 size={20} />
      <span className="text-sm font-medium">{isOver ? 'Soltar para eliminar' : 'Arrastra aquí para eliminar'}</span>
    </div>
  );
};