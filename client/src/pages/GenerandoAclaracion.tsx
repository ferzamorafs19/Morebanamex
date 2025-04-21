import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import invexLogo from '../assets/invex_logo.png';

const GenerandoAclaracion: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [, setLocation] = useLocation();

  // Efecto para animar la barra de progreso y simular carga
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Efecto para redirigir a la página del cliente después de completar la barra
  useEffect(() => {
    if (progress === 100) {
      const redirectTimeout = setTimeout(() => {
        // Verificar si la URL contiene un código de sesión
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
          // Si hay un código de sesión en la URL, redirigir al cliente
          const sessionId = pathParts[1];
          setLocation(`/client/${sessionId}`);
        }
      }, 500);

      return () => clearTimeout(redirectTimeout);
    }
  }, [progress, setLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center p-4">
      <img 
        src={invexLogo} 
        alt="INVEX Logo" 
        className="w-48 mb-8" 
      />
      
      <h1 className="text-2xl font-bold mb-4 text-[#BE0046]">Generando aclaración</h1>
      
      <div className="w-full max-w-md mb-6">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-[#BE0046] rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">Procesando información, por favor espere...</p>
      </div>
      
      <div className="max-w-md text-gray-700 text-sm">
        <p className="mb-2">
          Estamos preparando la información para su aclaración con INVEX.
        </p>
        <p>
          Este proceso puede tomar unos momentos. Por favor no cierre esta ventana.
        </p>
      </div>
    </div>
  );
};

export default GenerandoAclaracion;