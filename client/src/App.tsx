import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConfigProvider } from "@/config-system/hooks/useConfig";
import Home from "./pages/Home";
import { useIndustryConfig } from "@/hooks/useIndustryConfig";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
        <ConfigProviderWrapper>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ConfigProviderWrapper>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Wrapper component to provide config context
function ConfigProviderWrapper({ children }: { children: React.ReactNode }) {
  const { industryId } = useIndustryConfig();
  const projectId = 'default-project'; // TODO: Get from route or user context

  return (
    <ConfigProvider projectId={projectId} industryId={industryId}>
      {children}
    </ConfigProvider>
  );
}

export default App;
