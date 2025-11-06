import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import LandingPage from "./pages/LandingPage";
import SetupPage from "./pages/SetupPage";
import ChoreSetupPage from "./pages/ChoreSetupPage";

import KidChoresPage from "./pages/KidChoresPage";
import SettingsPage from "./pages/SettingsPage";
import NetWorthPage from "./pages/NetWorthPage";
import ParentManagementPage from "./pages/ParentManagementPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import ParentLoginPage from "./pages/ParentLoginPage";
import ChildSelectPage from "./pages/ChildSelectPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<RoleSelectionPage />} />
      <Route path="/parent-login" element={<ParentLoginPage />} />
      <Route path="/child-select" element={<ChildSelectPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/chores" element={<ChoreSetupPage />} />

      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/manage" element={<ParentManagementPage />} />
      <Route path="/kid/:kidId/chores" element={<KidChoresPage />} />
      <Route path="/kid/:kidId/networth" element={<NetWorthPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
