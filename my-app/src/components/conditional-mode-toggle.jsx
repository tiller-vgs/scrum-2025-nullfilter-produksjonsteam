"use client";

import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";

export function ConditionalModeToggle() {
  const pathname = usePathname();

  // Don't show on the infoscreen page
  if (pathname === "/infoscreen") {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <ModeToggle />
    </div>
  );
}
