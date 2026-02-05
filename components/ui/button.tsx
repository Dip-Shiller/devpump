import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-white/20 bg-transparent hover:bg-white/5 hover:border-purple-500/50 text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_30px_rgba(153,69,255,0.3),0_0_60px_rgba(20,241,149,0.15)] hover:shadow-[0_0_50px_rgba(153,69,255,0.5),0_0_100px_rgba(20,241,149,0.3)] hover:-translate-y-0.5",
        glow:
          "relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-[0_0_40px_rgba(153,69,255,0.4),0_0_80px_rgba(20,241,149,0.2)] hover:shadow-[0_0_60px_rgba(153,69,255,0.6),0_0_120px_rgba(20,241,149,0.4)] hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-700",
        glass:
          "bg-white/5 backdrop-blur-xl border border-white/10 text-foreground hover:bg-white/10 hover:border-white/20",
        purple:
          "bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 hover:text-white hover:border-purple-400/50",
        cyan:
          "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 hover:text-white hover:border-cyan-400/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
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
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
