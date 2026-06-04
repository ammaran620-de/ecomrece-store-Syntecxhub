"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<"default" | "hover" | "click" | "input">("default");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setCursorType("click");
    const handleMouseUp = () => setCursorType("default");

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isLinkOrBtn = target.closest("a") || target.closest("button") || target.closest(".interactive-hover");
      const isInput = target.closest("input") || target.closest("textarea") || target.closest("select");
      
      if (isLinkOrBtn) {
        setCursorType("hover");
      } else if (isInput) {
        setCursorType("input");
      } else {
        setCursorType("default");
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "var(--color-accent-primary)",
      borderColor: "transparent",
      borderRadius: "50%",
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(108, 99, 255, 0.15)",
      borderColor: "var(--color-accent-primary)",
      borderWidth: 1,
      borderRadius: "50%",
    },
    click: {
      width: 24,
      height: 24,
      backgroundColor: "var(--color-accent-ice)",
      borderColor: "transparent",
      borderRadius: "50%",
    },
    input: {
      width: 4,
      height: 24,
      backgroundColor: "var(--color-text-primary)",
      borderColor: "transparent",
      borderRadius: "0px",
    }
  };

  const getPositionOffset = () => {
    switch (cursorType) {
      case "hover": return -24;
      case "click": return -12;
      case "input": return -2;
      default: return -6;
    }
  };

  return (
    <>
      {/* Central dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: mousePosition.x + getPositionOffset(),
          y: mousePosition.y + (cursorType === "input" ? -12 : getPositionOffset()),
        }}
        variants={variants}
        animate={cursorType}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-border-dim rounded-full pointer-events-none z-[9998] hidden md:block"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: cursorType === "hover" ? 1.4 : cursorType === "click" ? 0.7 : 1,
          borderColor: cursorType === "hover" ? "var(--color-accent-ice)" : "rgba(255,255,255,0.06)"
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.25 }}
      />
    </>
  );
}
