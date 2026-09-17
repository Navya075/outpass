import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:border-zinc-900 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-white shadow-xs hover:bg-zinc-800 active:scale-[0.99] transition-all duration-100 font-semibold",
        destructive:
          "bg-rose-600 text-white shadow-xs hover:bg-rose-700 active:scale-[0.99] transition-all duration-100 font-semibold",
        outline:
          "border border-zinc-200 bg-white text-zinc-800 shadow-xs hover:bg-zinc-50 hover:text-zinc-900 hover:border-zinc-300 active:scale-[0.99] transition-all duration-100",
        secondary:
          "bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200 active:scale-[0.99] transition-all duration-100 font-medium",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600",
        link: "text-zinc-900 underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
