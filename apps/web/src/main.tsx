import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ModeToggle } from "./components/theme/mode-toggle";
import { ThemeProvider } from "./components/theme/theme-provider";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div>Toto</div>
      <ModeToggle />
    </ThemeProvider>
  </StrictMode>,
);
