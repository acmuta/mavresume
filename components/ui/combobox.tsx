"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type ComboboxItem = string | { name: string; value: string }

interface ComboboxProps {
  items: ComboboxItem[]
  placeholder?: string
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  triggerClassName?: string
  contentClassName?: string
  inputClassName?: string
  itemClassName?: string
  multiSelect?: boolean 
  disableDisplayValue?: boolean
  creatable?: boolean
  onCreateItem?: (value: string) => void
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
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | string[]>(
    controlledValue || (multiSelect ? [] : "")
  )
  const [searchValue, setSearchValue] = React.useState("")
  const [customItems, setCustomItems] = React.useState<Array<{name: string, value: string}>>([])

  React.useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue)
  }, [controlledValue])

  // Reset search when popover closes
  React.useEffect(() => {
    if (!open) {
      setSearchValue("")
    }
  }, [open])

  const handleSelect = (selected: string) => {
    if (multiSelect) {
      const current = Array.isArray(value) ? value : []
      const exists = current.includes(selected)
      const newValue = exists
        ? current.filter((v) => v !== selected)
        : [...current, selected]
      setValue(newValue)
      onChange?.(newValue)
    } else {
      const newValue = selected === value ? "" : selected
      setValue(newValue)
      setSearchValue("")
      setOpen(false)
      onChange?.(newValue)
    }
  }

  const handleCreateItem = (newValue: string) => {
    const trimmedValue = newValue.trim()
    if (!trimmedValue) return

    // Check if item already exists (case-insensitive)
    const normalized = getNormalizedItems()
    const exists = normalized.some(
      (item) => item.value.toLowerCase() === trimmedValue.toLowerCase()
    )

    if (exists) {
      // If exists, select the existing item instead
      const existingItem = normalized.find(
        (item) => item.value.toLowerCase() === trimmedValue.toLowerCase()
      )
      if (existingItem) {
        handleSelect(existingItem.value)
      }
      return
    }

    // Create new custom item
    const customItem = { name: trimmedValue, value: trimmedValue }
    setCustomItems((prev) => {
      // Check if already in custom items
      if (prev.some((item) => item.value.toLowerCase() === trimmedValue.toLowerCase())) {
        return prev
      }
      return [...prev, customItem]
    })

    // Select the new item
    handleSelect(trimmedValue)
    
    // Notify parent component
    onCreateItem?.(trimmedValue)
    
    // Clear search
    setSearchValue("")
  }

  const getNormalizedItems = () => {
    const baseItems = items.map((item) =>
      typeof item === "string"
        ? { name: item, value: item }
        : { name: item.name, value: item.value }
    )
    // Merge with custom items, avoiding duplicates
    const merged = [...baseItems]
    customItems.forEach((customItem) => {
      if (!merged.some((item) => item.value.toLowerCase() === customItem.value.toLowerCase())) {
        merged.push(customItem)
      }
    })
    return merged
  }

  const normalized = getNormalizedItems()

  // Filter items based on search (cmdk handles this, but we need to check if any match)
  const filteredItems = normalized.filter((item) => {
    if (!searchValue.trim()) return true
    const searchLower = searchValue.toLowerCase()
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.value.toLowerCase().includes(searchLower)
    )
  })

  const showCreateOption = creatable && searchValue.trim().length > 0 && filteredItems.length === 0

  const displayValue = multiSelect
  ? Array.isArray(value) && value.length > 0
      ? normalized
          .filter(item => value.includes(item.value))
          .map(item => item.name)
          .join(", ")
      : placeholder
  : typeof value === "string"
      ? normalized.find(item => item.value === value)?.name || placeholder
      : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "min-w-[5rem] max-w-[30rem] justify-between text-left bg-[#151618] border-dotted border-[#6F748B] hover:text-white hover:border-white hover:bg-[#151618] truncate",
            triggerClassName
          )}
        >
          {!disableDisplayValue ? <span className="truncate">{displayValue}</span> : <span>{placeholder}</span>}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("w-[240px] p-0 bg-[#151618] border-[#313339]", contentClassName)}
      >
        <Command 
          className="bg-[#151618] text-white border-[#313339]"
          shouldFilter={false}
        >
          <CommandInput
            placeholder="Search..."
            className={cn("text-sm border-[#6F748B]", inputClassName)}
            value={searchValue}
            onValueChange={setSearchValue}
            onKeyDown={(e) => {
              if (e.key === "Enter" && showCreateOption) {
                e.preventDefault()
                handleCreateItem(searchValue)
              }
            }}
          />
          <CommandList className="text-white border-[#313339]">
            {showCreateOption ? (
              <CommandGroup>
                <CommandItem
                  value={`create-${searchValue}`}
                  onSelect={() => handleCreateItem(searchValue)}
                  className={cn("cursor-pointer text-[#3c67eb] italic", itemClassName)}
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
                    : value === item.value

                  return (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={() => handleSelect(item.value)}
                      className={cn("cursor-pointer text-white", itemClassName)}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          selected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="font-medium">{item.name}</span>
                      <span className="ml-2 text-muted-foreground text-xs">
                        {item.value}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
