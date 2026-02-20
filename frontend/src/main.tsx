import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import "./index.css";
import App from "./App.tsx";
import { queryClient } from "./lib/queryClient.ts";
import { Toaster } from "sonner";
import { AuthProvider } from "./features/auth/context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster />
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <App />
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
