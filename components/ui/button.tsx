import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "disabled:opacity-50 disabled:pointer-events-none",
          // Mobile: Increased padding for better touch targets (min 44px height)
          // Desktop: Standard padding
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 active:scale-[0.98]": variant === 'default',
            "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 active:scale-[0.98]": variant === 'secondary',
            "border border-gray-300 bg-transparent hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98] text-gray-900": variant === 'outline',
            "hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98]": variant === 'ghost',
          },
          {
            // Mobile: min-h-[44px] for touch targets, larger padding
            // Desktop: Standard sizes
            "min-h-[44px] px-6 py-3 md:h-10 md:px-4 md:py-2 text-base md:text-sm": size === 'default',
            "min-h-[44px] px-5 py-2.5 md:h-9 md:px-3 md:py-1.5 text-base md:text-sm": size === 'sm',
            "min-h-[44px] px-8 py-3 md:h-11 md:px-8 md:py-2.5 text-base md:text-base": size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button }