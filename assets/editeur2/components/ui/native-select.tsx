import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@editeur/lib/utils"

const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-9 w-full appearance-none items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
        aria-hidden="true"
      />
    </div>
  )
})
NativeSelect.displayName = "NativeSelect"

const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  React.ComponentProps<"option">
>(({ className, ...props }, ref) => {
  return <option className={cn(className)} ref={ref} {...props} />
})
NativeSelectOption.displayName = "NativeSelectOption"

const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  React.ComponentProps<"optgroup">
>(({ className, ...props }, ref) => {
  return <optgroup className={cn(className)} ref={ref} {...props} />
})
NativeSelectOptGroup.displayName = "NativeSelectOptGroup"

export { NativeSelect, NativeSelectOption, NativeSelectOptGroup }

