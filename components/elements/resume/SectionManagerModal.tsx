"use client";
import React, { useState, useEffect } from "react";
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
import { GripVertical, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { useResumeStore, AVAILABLE_SECTIONS } from "../../../store/useResumeStore";

/**
 * Section display names mapping
 */
const sectionDisplayNames: Record<string, string> = {
  "personal-info": "Personal Info",
  "education": "Education",
  "technical-skills": "Technical Skills",
  "projects": "Projects",
  "experience": "Experience",
};

interface SortableSectionItemProps {
  id: string;
  label: string;
  onRemove: (id: string) => void;
}

/**
 * Individual sortable section item component with remove button
 */
const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  id,
  label,
  onRemove,
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
      className="flex items-center gap-2 p-3 rounded-lg bg-[#151618]/80 border border-[#2d313a] hover:border-[#3d4353] hover:bg-[#1c1d21]/90 transition-all group"
    >
      <div
        className="cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5 text-[#6d7895] flex-shrink-0" />
      </div>
      <span className="text-white font-medium flex-1">{label}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        className="h-7 w-7 text-[#6d7895] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Remove ${label}`}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};

/**
 * Available section item component with add button
 */
const AvailableSectionItem: React.FC<{
  id: string;
  label: string;
  onAdd: (id: string) => void;
}> = ({ id, label, onAdd }) => {
  return (
    <div className="flex items-center gap-2 p-3 rounded-lg bg-[#151618]/40 border border-dashed border-[#2d313a] hover:border-[#3d4353] hover:bg-[#1c1d21]/50 transition-all group">
      <span className="text-[#6d7895] font-medium flex-1">{label}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdd(id)}
        className="h-7 w-7 text-[#6d7895] hover:text-[#274cbc] hover:bg-[#274cbc]/10"
        aria-label={`Add ${label}`}
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};

/**
 * Modal component for managing resume sections.
 * Features:
 * - Add sections from available list
 * - Remove sections from selected list
 * - Reorder selected sections via drag-and-drop
 * - Personal Info is always present and cannot be removed
 */
export const SectionManagerModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { sectionOrder, addSection, removeSection, updateSectionOrder } = useResumeStore();

  // Filter out personal-info for the reorderable list
  const selectedSections = sectionOrder.filter((id) => id !== "personal-info");

  // Track local state for drag-and-drop
  const [items, setItems] = useState<string[]>(selectedSections);

  // Sync local state when store changes
  useEffect(() => {
    const selected = sectionOrder.filter((id) => id !== "personal-info");
    setItems(selected);
  }, [sectionOrder]);

  // Get available sections that are not yet added
  const availableSections = AVAILABLE_SECTIONS.filter(
    (section) => !sectionOrder.includes(section.id)
  );

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

  const handleAddSection = (sectionId: string) => {
    addSection(sectionId);
  };

  const handleRemoveSection = (sectionId: string) => {
    removeSection(sectionId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1c1d21] border-2 border-dashed border-[#2d313a] rounded-3xl shadow-[0_25px_60px_rgba(3,4,7,0.55)] w-[90vw] max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Manage Resume Sections
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-[#6d7895] text-sm mb-6">
            Add, remove, and reorder sections. Personal Info always appears first and cannot be removed.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Sections Column */}
            <div>
              <h3 className="text-sm font-semibold text-[#a4a7b5] mb-3 uppercase tracking-wide">
                Available Sections
              </h3>
              <div className="flex flex-col gap-2 min-h-[120px]">
                {availableSections.length > 0 ? (
                  availableSections.map((section) => (
                    <AvailableSectionItem
                      key={section.id}
                      id={section.id}
                      label={section.label}
                      onAdd={handleAddSection}
                    />
                  ))
                ) : (
                  <p className="text-[#4d5363] text-sm text-center py-8">
                    All sections added
                  </p>
                )}
              </div>
            </div>

            {/* Selected Sections Column */}
            <div>
              <h3 className="text-sm font-semibold text-[#a4a7b5] mb-3 uppercase tracking-wide">
                Your Sections
              </h3>
              
              {/* Fixed Personal Info section */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#274cbc]/10 border border-[#274cbc]/30 mb-2">
                <div className="w-5 h-5 flex-shrink-0" /> {/* Spacer for alignment */}
                <span className="text-[#89a5ff] font-medium flex-1">Personal Info</span>
                <span className="text-[10px] text-[#6d7895] uppercase">Fixed</span>
              </div>

              {/* Sortable sections */}
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
                    {items.length > 0 ? (
                      items.map((id) => (
                        <SortableSectionItem
                          key={id}
                          id={id}
                          label={sectionDisplayNames[id] || id}
                          onRemove={handleRemoveSection}
                        />
                      ))
                    ) : (
                      <p className="text-[#4d5363] text-sm text-center py-4 border border-dashed border-[#2d313a] rounded-lg">
                        Add sections from the left
                      </p>
                    )}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Re-export with old name for backward compatibility during migration
export { SectionManagerModal as SectionOrderModal };
