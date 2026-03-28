"use client";

import React, { useEffect, useState } from "react";
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import {
  useResumeStore,
  AVAILABLE_SECTIONS,
} from "../../../store/useResumeStore";
import { CORE_SECTION_ID, getSectionLabelById } from "@/lib/resume/sections";

interface SortableSectionItemProps {
  id: string;
  label: string;
  onRemove: (id: string) => void;
}

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
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 rounded-[1.25rem] border border-[#2b3242] bg-[#10121a]/82 p-3 transition-all hover:border-[#4b5a82] hover:bg-[#161b25]"
    >
      <div
        className="cursor-grab text-[#6d7895] active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 shrink-0" />
      </div>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        className="h-8 w-8 rounded-full text-[#6d7895] hover:bg-[#1c2230] hover:text-white"
        aria-label={`Remove ${label}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const AvailableSectionItem: React.FC<{
  id: string;
  label: string;
  onAdd: (id: string) => void;
}> = ({ id, label, onAdd }) => {
  return (
    <div className="flex items-center gap-3 rounded-[1.25rem] border border-dashed border-[#2b3242] bg-[#10121a]/45 p-3 transition-all hover:border-[#4b5a82] hover:bg-[#161b25]/70">
      <span className="flex-1 text-sm text-[#cfd3e1]">{label}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onAdd(id)}
        className="h-8 w-8 rounded-full text-[#89a5ff] hover:bg-[#1c2230] hover:text-white"
        aria-label={`Add ${label}`}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const SectionManagerModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ open, onOpenChange }) => {
  const { sectionOrder, addSection, removeSection, updateSectionOrder } =
    useResumeStore();

  const selectedSections = sectionOrder.filter((id) => id !== CORE_SECTION_ID);
  const [items, setItems] = useState<string[]>(selectedSections);

  useEffect(() => {
    const selected = sectionOrder.filter((id) => id !== CORE_SECTION_ID);
    setItems(selected);
  }, [sectionOrder]);

  const availableSections = AVAILABLE_SECTIONS.filter(
    (section) => !sectionOrder.includes(section.id),
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over!.id as string);
      const newItems = arrayMove(items, oldIndex, newIndex);

      setItems(newItems);
      updateSectionOrder([CORE_SECTION_ID, ...newItems]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-4xl rounded-[2rem] border border-[#2b3242] bg-[radial-gradient(circle_at_top,_rgba(39,76,188,0.16),_transparent_40%),linear-gradient(180deg,_rgba(17,19,25,0.96),_rgba(11,12,16,0.98))] text-white shadow-[0_30px_80px_rgba(3,4,7,0.45)]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight text-white">
            Manage resume sections
          </DialogTitle>
        </DialogHeader>

        <div className="py-2">
          <p className="max-w-2xl text-sm leading-relaxed text-[#a4a7b5]">
            Add, remove, and reorder sections. Personal Info always stays first.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Available sections
              </p>
              <div className="mt-4 flex flex-col gap-3">
                {availableSections.length > 0 ? (
                  availableSections.map((section) => (
                    <AvailableSectionItem
                      key={section.id}
                      id={section.id}
                      label={section.label}
                      onAdd={addSection}
                    />
                  ))
                ) : (
                  <div className="rounded-[1.25rem] border border-dashed border-[#2b3242] bg-[#0f1117]/55 px-4 py-6 text-sm text-[#6d7895]">
                    All available sections are already added.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-[#2b3242] bg-[#10121a]/65 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#89a5ff]">
                Current section order
              </p>

              <div className="mt-4 rounded-[1.25rem] border border-[#274cbc]/30 bg-[#274cbc]/10 p-3">
                <p className="text-sm font-medium text-[#8fa5ff]">
                  Personal Info
                </p>
                <p className="mt-1 text-xs text-[#6d7895]">
                  Fixed at the top of the resume
                </p>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mt-3 flex flex-col gap-3">
                    {items.length > 0 ? (
                      items.map((id) => (
                        <SortableSectionItem
                          key={id}
                          id={id}
                          label={getSectionLabelById(id)}
                          onRemove={removeSection}
                        />
                      ))
                    ) : (
                      <div className="rounded-[1.25rem] border border-dashed border-[#2b3242] bg-[#0f1117]/55 px-4 py-6 text-sm text-[#6d7895]">
                        Add sections from the left column.
                      </div>
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

export { SectionManagerModal as SectionOrderModal };
