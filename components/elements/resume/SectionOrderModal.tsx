"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { useResumeStore } from "../../../store/useResumeStore";

/**
 * Section display names mapping
 */
const sectionDisplayNames: Record<string, string> = {
  "education": "Education",
  "technical-skills": "Technical Skills",
  "projects": "Projects",
  "experience": "Experience",
};

interface SortableSectionItemProps {
  id: string;
  label: string;
}

/**
 * Individual sortable section item component
 */
const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  id,
  label,
}) => {
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
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 rounded-lg bg-[#151618]/80 border border-[#2d313a] hover:border-[#3d4353] hover:bg-[#1c1d21]/90 transition-all cursor-grab active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <GripVertical className="w-5 h-5 text-[#6d7895] flex-shrink-0" />
      <span className="text-white font-medium">{label}</span>
    </div>
  );
};

/**
 * Modal component for reordering resume sections using drag-and-drop.
 * Excludes "personal-info" from reordering (always stays first).
 * Auto-saves order to store on drag end.
 */
export const SectionOrderModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { sectionOrder, updateSectionOrder } = useResumeStore();

  // Filter out personal-info and get reorderable sections
  const reorderableSections = sectionOrder.filter(
    (id) => id !== "personal-info"
  );

  const [items, setItems] = useState<string[]>(reorderableSections);

  // Update local state when store sectionOrder changes
  React.useEffect(() => {
    const reorderable = sectionOrder.filter((id) => id !== "personal-info");
    setItems(reorderable);
  }, [sectionOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over!.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);

      setItems(newItems);

      // Update store with new order (personal-info always first)
      const newSectionOrder = ["personal-info", ...newItems];
      updateSectionOrder(newSectionOrder);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1c1d21] border-2 border-dashed border-[#2d313a] rounded-3xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-[90vw] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Reorder Sections
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-[#6d7895] text-sm mb-4">
            Drag and drop to reorder sections. Personal Info always appears
            first.
          </p>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={items}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {items.map((id) => (
                  <SortableSectionItem
                    key={id}
                    id={id}
                    label={sectionDisplayNames[id] || id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </DialogContent>
    </Dialog>
  );
};
