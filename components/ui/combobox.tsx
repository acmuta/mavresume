"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ComboboxItem = string | { name: string; value: string };

interface ComboboxProps {
  items: ComboboxItem[];
  placeholder?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  triggerClassName?: string;
  contentClassName?: string;
  inputClassName?: string;
  itemClassName?: string;
  multiSelect?: boolean;
  disableDisplayValue?: boolean;
  creatable?: boolean;
  onCreateItem?: (value: string) => void;
}

export function Combobox({
  items,
  placeholder = "Select an option...",
  value: controlledValue,
  onChange,
  triggerClassName,
  contentClassName,
  inputClassName,
  itemClassName,
  multiSelect = false,
  disableDisplayValue = false,
  creatable = true,
  onCreateItem,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<string | string[]>(
    controlledValue || (multiSelect ? [] : ""),
  );
  const [searchValue, setSearchValue] = React.useState("");
  const [customItems, setCustomItems] = React.useState<
    Array<{ name: string; value: string }>
  >([]);

  React.useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue);
  }, [controlledValue]);

  React.useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  const handleSelect = (selected: string) => {
    if (multiSelect) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(selected);
      const newValue = exists
        ? current.filter((v) => v !== selected)
        : [...current, selected];
      setValue(newValue);
      onChange?.(newValue);
    } else {
      const newValue = selected === value ? "" : selected;
      setValue(newValue);
      setSearchValue("");
      setOpen(false);
      onChange?.(newValue);
    }
  };

  const handleCreateItem = (newValue: string) => {
    const trimmedValue = newValue.trim();
    if (!trimmedValue) return;

    const normalized = getNormalizedItems();
    const exists = normalized.some(
      (item) => item.value.toLowerCase() === trimmedValue.toLowerCase(),
    );

    if (exists) {
      const existingItem = normalized.find(
        (item) => item.value.toLowerCase() === trimmedValue.toLowerCase(),
      );
      if (existingItem) {
        handleSelect(existingItem.value);
      }
      return;
    }

    const customItem = { name: trimmedValue, value: trimmedValue };
    setCustomItems((prev) => {
      if (
        prev.some((item) => item.value.toLowerCase() === trimmedValue.toLowerCase())
      ) {
        return prev;
      }
      return [...prev, customItem];
    });

    handleSelect(trimmedValue);
    onCreateItem?.(trimmedValue);
    setSearchValue("");
  };

  const getNormalizedItems = () => {
    const baseItems = items.map((item) =>
      typeof item === "string"
        ? { name: item, value: item }
        : { name: item.name, value: item.value },
    );

    const merged = [...baseItems];
    customItems.forEach((customItem) => {
      if (
        !merged.some(
          (item) =>
            item.value.toLowerCase() === customItem.value.toLowerCase(),
        )
      ) {
        merged.push(customItem);
      }
    });
    return merged;
  };

  const normalized = getNormalizedItems();

  const filteredItems = normalized.filter((item) => {
    if (!searchValue.trim()) return true;
    const searchLower = searchValue.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.value.toLowerCase().includes(searchLower)
    );
  });

  const showCreateOption =
    creatable && searchValue.trim().length > 0 && filteredItems.length === 0;

  const displayValue = multiSelect
    ? Array.isArray(value) && value.length > 0
      ? normalized
          .filter((item) => value.includes(item.value))
          .map((item) => item.name)
          .join(", ")
      : placeholder
    : typeof value === "string"
      ? normalized.find((item) => item.value === value)?.name || placeholder
      : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 w-full min-w-0 justify-between rounded-2xl border-[#2b3242] bg-[#10121a]/88 px-4 text-left text-sm text-white shadow-none hover:border-[#4b5a82] hover:bg-[#161b25] hover:text-white",
            triggerClassName,
          )}
        >
          {!disableDisplayValue ? (
            <span className="truncate text-[#cfd3e1]">{displayValue}</span>
          ) : (
            <span className="truncate text-[#6d7895]">{placeholder}</span>
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 text-[#6d7895]" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          "w-[280px] rounded-2xl border border-[#2b3242] bg-[#111319]/96 p-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl",
          contentClassName,
        )}
      >
        <Command className="bg-transparent text-white" shouldFilter={false}>
          <CommandInput
            placeholder="Search..."
            className={cn("border-[#2b3242] text-sm", inputClassName)}
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCreateOption) {
                e.preventDefault();
                handleCreateItem(searchValue);
              }
            }}
          />
          <CommandList className="max-h-[260px]">
            {showCreateOption ? (
              <CommandGroup>
                <CommandItem
                  value={`create-${searchValue}`}
                  onSelect={() => handleCreateItem(searchValue)}
                  className={cn(
                    "cursor-pointer text-[#89a5ff]",
                    itemClassName,
                  )}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create &apos;{searchValue.trim()}&apos;</span>
                </CommandItem>
              </CommandGroup>
            ) : filteredItems.length === 0 ? (
              <CommandEmpty>No results found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredItems.map((item) => {
                  const selected = multiSelect
                    ? Array.isArray(value) && value.includes(item.value)
                    : value === item.value;

                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item.value)}
                      className={cn(
                        "cursor-pointer rounded-xl text-white aria-selected:bg-[#161b25] aria-selected:text-white",
                        itemClassName,
                      )}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-xs text-[#6d7895]">
                        {item.value}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
