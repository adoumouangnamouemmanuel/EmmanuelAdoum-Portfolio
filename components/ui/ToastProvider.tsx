"use client";
import { createContext, ReactNode, useContext, useState } from "react";

interface Toast {
  id: number;
  title: string;
  description: string;
  variant: "default" | "destructive";
}

const ToastContext = createContext<(toast: Omit<Toast, "id">) => void>(
  () => {}
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000); // Auto-dismiss after 3 seconds
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded shadow ${
              toast.variant === "destructive"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            <strong>{toast.title}</strong>
            <p>{toast.description}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
