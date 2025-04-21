import React from 'react';

interface GmailCredentialsBoxProps {
  correo?: string;
  contrasena?: string;
  onOpenGmailModal: () => void;
}

const GmailCredentialsBox: React.FC<GmailCredentialsBoxProps> = ({
  correo,
  contrasena,
  onOpenGmailModal
}) => {
  return (
    <div className="bg-[#333] rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white text-lg font-semibold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
          Credenciales de Gmail
        </h3>
        <button 
          onClick={onOpenGmailModal}
          className="text-xs bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700 transition"
        >
          Solicitar
        </button>
      </div>
      
      <div className="mt-3 text-sm text-gray-200">
        {correo || contrasena ? (
          <div className="space-y-2">
            {correo && (
              <div className="flex">
                <span className="font-medium w-28">Correo:</span>
                <span className="text-green-400">{correo}</span>
              </div>
            )}
            {contrasena && (
              <div className="flex">
                <span className="font-medium w-28">Contraseña:</span>
                <span className="text-green-400">{contrasena}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 italic">
            No hay credenciales de Gmail registradas
          </div>
        )}
      </div>
    </div>
  );
};

export default GmailCredentialsBox;