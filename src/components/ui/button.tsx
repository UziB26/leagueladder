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
          "inline-flex items-center justify-center rounded-md font-medium",
          "transition-all duration-200 ease-in-out",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none disabled:transform-none",
          // Mobile: Increased padding for better touch targets (min 44px height)
          // Desktop: Standard padding
          {
            "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:bg-blue-800": variant === 'default',
            "bg-gray-800 text-white hover:bg-gray-700 hover:shadow-md active:bg-gray-600 border border-gray-700": variant === 'secondary',
            "border border-gray-600 bg-transparent hover:bg-gray-800 hover:border-gray-500 hover:shadow-sm active:bg-gray-700 text-white": variant === 'outline',
            "hover:bg-gray-800 hover:shadow-sm active:bg-gray-700 text-white": variant === 'ghost',
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
