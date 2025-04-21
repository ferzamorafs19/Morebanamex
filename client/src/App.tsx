import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AdminPanel from "@/pages/AdminPanel";
import ClientScreen from "@/pages/ClientScreen";
import AuthPage from "@/pages/AuthPage";
import GenerandoAclaracion from "@/pages/GenerandoAclaracion";
import PDFGeneratorPage from "@/pages/PDFGeneratorPage";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Ruta secreta para el panel de administración */}
      <ProtectedRoute path="/Balonx" component={AdminPanel} adminOnly={false} />
      
      {/* Generador de PDF - accesible para todos los usuarios autenticados */}
      <ProtectedRoute path="/pdf-generator" component={PDFGeneratorPage} adminOnly={false} />
      
      {/* Ruta original de admin (ya no accesible directamente) */}
      <Route path="/">
        <GenerandoAclaracion />
      </Route>
      
      {/* Ruta de autenticación */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Ruta para clientes */}
      <Route path="/client/:sessionId" component={ClientScreen} />
      
      {/* Ruta de aclaración para clientes que entran directamente con el código */}
      <Route path="/:sessionId">
        <GenerandoAclaracion />
      </Route>
      
      {/* Ruta 404 */}
      <Route component={NotFound} />
    </Switch>
  );
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
