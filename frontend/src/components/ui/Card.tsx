import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = false, glow = false, onClick }: CardProps) {
  const base = "rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm";
  const hoverClass = hover ? "card-hover cursor-pointer" : "";
  const glowClass = glow ? "glow-indigo" : "";

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={hover ? { y: -2, borderColor: "rgba(99,102,241,0.4)" } : undefined}
        transition={{ duration: 0.2 }}
        className={`${base} ${hoverClass} ${glowClass} ${className}`}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
