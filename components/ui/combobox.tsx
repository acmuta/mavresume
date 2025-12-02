"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
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
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<string | string[]>(
    controlledValue || (multiSelect ? [] : "")
  )

  React.useEffect(() => {
    if (controlledValue !== undefined) setValue(controlledValue)
  }, [controlledValue])

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
      setOpen(false)
      onChange?.(newValue)
    }
  }

  const normalized = items.map((item) =>
    typeof item === "string"
      ? { name: item, value: item }
      : { name: item.name, value: item.value }
  )

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
        <Command className="bg-[#151618] text-white border-[#313339]">
          <CommandInput
            placeholder="Search..."
            className={cn("text-sm border-[#6F748B]", inputClassName)}
          />
          <CommandList className="text-white border-[#313339]">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {normalized.map((item) => {
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
