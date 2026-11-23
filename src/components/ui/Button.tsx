import React from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "dark";
  size?: "sm" | "md" | "lg";
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-sans tracking-wider uppercase text-xs transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-4 py-2 text-[11px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-xs font-semibold",
  }[size];

  const variantStyles = {
    primary:
      "bg-gold-400 text-safari-night hover:bg-gold-300 active:bg-gold-500 font-semibold shadow-sm hover:shadow-md",
    secondary:
      "bg-safari-night text-safari-sand hover:bg-safari-dark border border-gold-400/30 hover:border-gold-400",
    outline:
      "border border-safari-border text-safari-cream hover:border-gold-400 hover:text-gold-300 bg-transparent",
    ghost:
      "text-safari-cream hover:text-gold-300 hover:bg-white/5 bg-transparent",
    dark:
      "bg-safari-dark text-white hover:bg-safari-night border border-safari-border",
  }[variant];

  const combinedStyles = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedStyles}>
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedStyles} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin text-current" />
      ) : (
        leftIcon && <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
