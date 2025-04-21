import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
          className="absolute top-2 right-3 text-gray-400 hover:text-white text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
        {children}
      </div>
    </div>
  );
};

interface YahooModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { correo: string, mensaje: string }) => void;
}

export const YahooModal: React.FC<YahooModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    correo: '',
    mensaje: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('yahoo', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
    setFormData({
      correo: '',
      mensaje: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sincronización de correo Yahoo">
      <div className="mb-4">
        <Label htmlFor="yahooCorreo" className="block text-sm text-gray-300 mb-1">
          Correo electrónico de destino
        </Label>
        <Input 
          id="yahooCorreo" 
          type="email" 
          placeholder="Ingrese el correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="yahooMensaje" className="block text-sm text-gray-300 mb-1">
          Mensaje (opcional)
        </Label>
        <Textarea 
          id="yahooMensaje" 
          placeholder="Ingrese un mensaje personalizado (opcional)"
          value={formData.mensaje}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none min-h-[100px]"
        />
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={onClose} variant="ghost" className="text-white bg-gray-600 mr-2">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="bg-[#6001D2] text-white">
          Enviar
        </Button>
      </div>
    </Modal>
  );
};