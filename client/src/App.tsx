import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeContext";
import NotFound from "@/pages/not-found";

// Import pages
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Products from "@/pages/products";
import Sales from "@/pages/sales";
import Support from "@/pages/support";
import Settings from "@/pages/settings";
import Help from "@/pages/help";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/customers" component={Customers} />
      <Route path="/products" component={Products} />
      <Route path="/sales" component={Sales} />
      <Route path="/support" component={Support} />
      <Route path="/settings" component={Settings} />
      <Route path="/help" component={Help} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
