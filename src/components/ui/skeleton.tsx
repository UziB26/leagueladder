import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "default" | "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

export function Skeleton({
  className,
  variant = "default",
  width,
  height,
  ...props
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseClasses = "animate-pulse bg-gray-800 rounded"
  
  const variantClasses = {
    default: "",
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-md",
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === "number" ? `${width}px` : width
  if (height) style.height = typeof height === "number" ? `${height}px` : height

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
      {...props}
    />
  )
}

// Pre-built skeleton components for common use cases

export function SkeletonText({
  lines = 1,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? "w-3/4" : "w-full"}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({
  size = 40,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}

export function SkeletonButton({
  className,
}: {
  className?: string
}) {
  return (
    <Skeleton
      variant="rectangular"
      height={44}
      className={cn("w-24 md:w-32", className)}
    />
  )
}

export function SkeletonCard({
  className,
}: {
  className?: string
}) {
  return (
    <div className={cn("bg-gray-900 rounded-lg border border-gray-700 p-6", className)}>
      <div className="space-y-4">
        <Skeleton variant="text" className="h-6 w-1/2" />
        <SkeletonText lines={3} />
        <div className="flex gap-2">
          <SkeletonButton />
          <SkeletonButton />
        </div>
      </div>
    </div>
  )
}
