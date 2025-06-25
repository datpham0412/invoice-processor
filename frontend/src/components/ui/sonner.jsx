"use client"

import { Toaster as Sonner } from "sonner"

const Toaster = (props) => {
  return (
    <Sonner
      {...props}
      position="top-right"
      toastOptions={{
        style: {
          backgroundColor: "#1f2937", // default fallback (gray-800)
          color: "#ffffff",
        },
        success: {
          style: {
            backgroundColor: "#16a34a", // green-600
            color: "#ffffff",
          },
        },
        error: {
          style: {
            backgroundColor: "#dc2626", // red-600
            color: "#ffffff",
          },
        },
      }}
    />
  );
};

export { Toaster };
