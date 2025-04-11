import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AdminPanel from "@/pages/AdminPanel";
import ClientScreen from "@/pages/ClientScreen";
import AuthPage from "@/pages/AuthPage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  // Determinar si estamos en un dominio de cliente o en el de administrador
  const isClientDomain = window.location.hostname.includes('aclaracion.info') && 
                         !window.location.hostname.includes('panel.aclaracion.info');
  
  // También comprobar si estamos en localhost o en Replit preview para desarrollo
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname.includes('.repl.co');
  
  if (isClientDomain && !isLocalhost) {
    // En dominio de cliente, solo mostrar la ruta del cliente
    return (
      <Switch>
        <Route path="/:sessionId" component={ClientScreen} />
        <Route path="/" component={() => {
          return <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl">Escanee un código QR o use un enlace directo para acceder</h1>
          </div>
        }} />
        <Route component={NotFound} />
      </Switch>
    );
  } else {
    // En dominio de administrador o en desarrollo local
    return (
      <Switch>
        <ProtectedRoute path="/" component={AdminPanel} adminOnly={false} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/client/:sessionId" component={ClientScreen} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
