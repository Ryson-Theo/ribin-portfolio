import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  size?: "default" | "sm"
  hasTopImage?: boolean
}

function Card({
  className,
  size = "default",
  hasTopImage = false,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col overflow-hidden rounded-xl bg-card text-sm text-card-foreground shadow-xs ring-1 ring-foreground/10",
        "gap-(--card-spacing) py-(--card-spacing) [--card-spacing:--spacing(6)] data-[size=sm]:[--card-spacing:--spacing(4)]",
        hasTopImage && "pt-0",
        className
      )}
      {...props}
    />
  )
}

interface CardHeaderProps extends React.ComponentProps<"div"> {
  hasAction?: boolean
  hasDescription?: boolean
}

function CardHeader({ 
  className, 
  hasAction = false, 
  hasDescription = false, 
  ...props 
}: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      data-has-action={hasAction || undefined}
      data-has-description={hasDescription || undefined}
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) [.border-b]:pb-(--card-spacing)",
        // Fast, explicit data-attribute switches replace resource-heavy child component lookups
        "data-[has-action=true]:grid-cols-[1fr_auto]",
        "data-[has-description=true]:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}