"use client";

import { ThemeSwitcher } from "./theme-switcher";

export default function NavbarClient() {
  return (
    <div className="flex items-center gap-4">
      <ThemeSwitcher />
    </div>
  );
}
