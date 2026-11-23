import React from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center" | "right";
  theme?: "dark" | "light";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = "center",
  theme = "light",
  className = "",
}) => {
  const alignClass = {
    left: "text-left items-start",
    center: "text-center items-center mx-auto",
    right: "text-right items-end ml-auto",
  }[align];

  const titleColor = theme === "dark" ? "text-white" : "text-safari-night";
  const descColor = theme === "dark" ? "text-safari-sand/80" : "text-safari-stone";

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs uppercase tracking-widest text-gold-400 font-medium mb-3">
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight ${titleColor}`}
      >
        {title}
      </h2>
      <div className="w-12 h-px bg-gold-400/60 my-4" />
      {description && (
        <p className={`text-base sm:text-lg font-light leading-relaxed ${descColor}`}>
          {description}
        </p>
      )}
    </div>
  );
};
