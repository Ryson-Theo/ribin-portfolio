import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground lg:[a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground lg:[a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 lg:[a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground lg:[a]:hover:bg-muted lg:[a]:hover:text-muted-foreground",
        ghost:
          "lg:hover:bg-muted lg:hover:text-muted-foreground dark:lg:hover:bg-muted/50",
        link: "text-primary underline-offset-4 lg:hover:underline",
      },
      // Flattening icon placement into simple variant states to prevent layout recalculation locks
      iconPosition: {
        none: "",
        start: "pl-1.5",
        end: "pr-1.5",
      }
    },
    defaultVariants: {
      variant: "default",
      iconPosition: "none",
    },
  }
)

interface BadgeProps 
  extends React.ComponentProps<"span">, 
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  iconPosition?: "none" | "start" | "end"
}

function Badge({
  className,
  variant = "default",
  iconPosition = "none",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-icon={iconPosition !== "none" ? `inline-${iconPosition}` : undefined}
      className={cn(badgeVariants({ variant, iconPosition }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }