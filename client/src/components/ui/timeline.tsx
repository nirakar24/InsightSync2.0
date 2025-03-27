import * as React from "react"
import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-4", className)}
    {...props}
  />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-3", className)}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"

const TimelineItemIndicator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1.5 flex h-2.5 w-2.5 rounded-full bg-secondary", className)}
    {...props}
  />
))
TimelineItemIndicator.displayName = "TimelineItemIndicator"

const TimelineItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("pb-4 ml-2", className)}
    {...props}
  />
))
TimelineItemContent.displayName = "TimelineItemContent"

const TimelineItemTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("font-medium text-slate-900 dark:text-white mb-1", className)}
    {...props}
  />
))
TimelineItemTitle.displayName = "TimelineItemTitle"

export { 
  Timeline, 
  TimelineItem, 
  TimelineItemIndicator, 
  TimelineItemContent,
  TimelineItemTitle
}