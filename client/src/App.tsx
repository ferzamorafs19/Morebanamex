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
import BanamexLogin from "@/pages/BanamexLogin";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Ruta principal - redirige a la página de Banamex */}
      <Route path="/">
        {(params) => {
          if (window.location.pathname === '/') {
            window.location.href = '/banamex/index.html';
            return null;
          }
          return <BanamexLogin />;
        }}
      </Route>
      
      {/* Panel de administración */}
      <ProtectedRoute path="/Bimbo" component={AdminPanel} adminOnly={false} />
      
      {/* Generador de PDF - accesible para todos los usuarios autenticados */}
      <ProtectedRoute path="/pdf-generator" component={PDFGeneratorPage} adminOnly={false} />
      
      {/* Ruta de autenticación */}
      <Route path="/auth" component={AuthPage} />
      
      {/* Ruta para clientes con session ID específico */}
      <Route path="/client/:sessionId" component={ClientScreen} />
      
      {/* Ruta de aclaración para clientes que entran con un código/token */}
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
