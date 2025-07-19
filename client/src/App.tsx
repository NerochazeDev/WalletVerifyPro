import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SecurityAlertPage from "@/pages/security-alert";
import WalletVerification from "@/pages/wallet-verification";
import NotFound from "@/pages/not-found";

function Router() {
  const [, navigate] = useLocation();

  const handleVerifyNow = () => {
    navigate("/verify");
  };

  return (
    <Switch>
      <Route path="/" component={() => <SecurityAlertPage onVerifyNow={handleVerifyNow} />} />
      <Route path="/verify" component={WalletVerification} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
