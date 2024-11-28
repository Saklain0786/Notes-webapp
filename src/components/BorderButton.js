import React from "react";
import { Button } from "./ui/moving-border.tsx";

export function BorderButton({text}) {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 h-12"
      >
      {text}
      </Button>
    </div>
  );
}
