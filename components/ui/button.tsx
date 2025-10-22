import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"

    const variantStyles = {
      default: "bg-primary text-white hover:bg-primary/90",
      outline: "border border-secondary bg-background text-foreground hover:bg-secondary",
    }

    const sizeStyles = {
      default: "h-10 px-4 py-2 text-base",
      sm: "h-9 px-3 text-sm",
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button }
