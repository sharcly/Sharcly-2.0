"use client";

import { useEffect, useRef } from "react";

/**
 * useMouseGlow
 * A custom hook that tracks the mouse position and updates CSS variables
 * on a target element (or the window) to drive radial light effects.
 */
export function useMouseGlow() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = ev;
      const { left, top } = containerRef.current.getBoundingClientRect();
      
      containerRef.current.style.setProperty("--mouse-x", `${clientX - left}px`);
      containerRef.current.style.setProperty("--mouse-y", `${clientY - top}px`);
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return containerRef;
}
