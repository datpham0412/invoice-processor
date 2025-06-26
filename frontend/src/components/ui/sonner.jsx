"use client"

import { Toaster as Sonner } from "sonner"

const Toaster = (props) => {
  return (
    <Sonner
      {...props}
      position="top-right"
      toastOptions={{
        style: {
         "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        },
      }}
    />
  );
};

export { Toaster };
