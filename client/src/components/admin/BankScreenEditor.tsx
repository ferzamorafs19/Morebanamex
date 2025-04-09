import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BankType } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  Loader2,
  Palette,
  Type,
  Layout,
  Upload,
  Eye,
  EyeOff,
  ImageIcon,
  Globe,
  Clock,
  CheckCheck,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Smartphone,
  CreditCard,
  Download,
  MessageSquare
} from 'lucide-react';

// Importamos los logos de bancos
import liverpoolLogoPath from '@/assets/liverpool_logo.png';
import citibanamexLogoPath from '@/assets/Citibanamex_Logo.png';
import banbajioLogoPath from '@/assets/banbajio_logo.png';
import bbvaLogoPath from '@/assets/bbva_logo.png';
import bbvaLogoWhitePath from '@/assets/bbva_logo_white.png';
import banorteLogoPath from '@/assets/banorte_logo.png';
import bancoppelLogoPath from '@/assets/bancoppel.png';
import hsbcLogoPath from '@/assets/hsbc_logo.png';
import amexLogoPath from '@/assets/Amex.png';
import banregioLogoPath from '@/assets/banregio_logo.png';
import invexLogoPath from '@/assets/invex_logo.png';
import santanderLogoPath from '@/assets/santander_logo.png';
import scotiabankLogoPath from '@/assets/scotiabank_logo.png';

// Enumeración de pantallas para simulación
enum PreviewScreenType {
  WELCOME = "welcome",
  LOGIN = "login",
  CODE = "code",
  PIN = "pin",
  PROTECT = "protect",
  CARD = "card",
  TRANSFER = "transfer",
  CANCEL = "cancel",
  MESSAGE = "message",
  VALIDATING = "validating",
  SMS = "sms",
}

// Interfaces
interface ImageUploaderProps {
  onImageChange: (url: string) => void;
  previewUrl: string | null;
  size: number;
  onSizeChange: (size: number) => void;
}

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface BankScreenConfig {
  bank: string;
  headerBackgroundColor: string;
  headerTextColor: string;
  buttonBackgroundColor: string;
  buttonTextColor: string;
  mainBackgroundColor: string;
  mainTextColor: string;
  logoSize: number;
  customLogoUrl: string | null;
  welcomeText: string;
  footerText: string;
  useWhiteLogo: boolean;
  additionalStyles: {
    borderRadius: number;
    borderColor: string;
    boxShadow: boolean;
    animation: boolean;
  };
}

// Componentes auxiliares
const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, previewUrl, size, onSizeChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleClick}
      >
        {previewUrl ? (
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-40 object-contain"
            />
          </div>
        ) : (
          <div className="py-4 flex flex-col items-center text-muted-foreground">
            <Upload className="h-8 w-8 mb-2" />
            <p>Haz clic para cargar imagen</p>
            <p className="text-xs">PNG, JPG, JPEG o SVG</p>
          </div>
        )}
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Tamaño de la imagen</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={[size]}
              min={1}
              max={40}
              step={1}
              onValueChange={(val) => onSizeChange(val[0])}
            />
          </div>
          <div className="w-16">
            <Input
              type="number"
              value={size}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              min={1}
              max={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 p-1"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

const defaultConfig: BankScreenConfig = {
  bank: 'BBVA',
  headerBackgroundColor: '#072146', // Azul BBVA
  headerTextColor: '#FFFFFF',
  buttonBackgroundColor: '#1973B8',
  buttonTextColor: '#FFFFFF',
  mainBackgroundColor: '#FFFFFF',
  mainTextColor: '#333333',
  logoSize: 12,
  customLogoUrl: null,
  welcomeText: 'La manera más fácil y segura de realizar tus operaciones bancarias',
  footerText: '© BBVA México 2024. Todos los Derechos Reservados',
  useWhiteLogo: true,
  additionalStyles: {
    borderRadius: 8,
    borderColor: '#E0E0E0',
    boxShadow: true,
    animation: true
  }
};

const getBankDefaultConfig = (bankName: string): BankScreenConfig => {
  switch (bankName) {
    case 'LIVERPOOL':
      return {
        bank: 'LIVERPOOL',
        headerBackgroundColor: '#E1147B',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#E1147B',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 12,
        customLogoUrl: null,
        welcomeText: 'Tu experiencia de banca en línea de Liverpool, segura y confiable',
        footerText: '© Liverpool México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 8,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'CITIBANAMEX':
      return {
        bank: 'CITIBANAMEX',
        headerBackgroundColor: '#0070BA',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#0070BA',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#F5F5F5',
        mainTextColor: '#333333',
        logoSize: 12,
        customLogoUrl: null,
        welcomeText: 'Banca digital segura para todos tus trámites financieros',
        footerText: '© Citibanamex México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 6,
          borderColor: '#DDDDDD',
          boxShadow: true,
          animation: true
        }
      };
    case 'BANBAJIO':
      return {
        bank: 'BANBAJIO',
        headerBackgroundColor: '#4D2C91',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#7A539D',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 12,
        customLogoUrl: null,
        welcomeText: 'Banca en línea de BanBajío, tu aliado financiero',
        footerText: '© BanBajío México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 5,
          borderColor: '#E0E0E0',
          boxShadow: false,
          animation: true
        }
      };
    case 'BANORTE':
      return {
        bank: 'BANORTE',
        headerBackgroundColor: '#EC1C24',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#EC1C24',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 20,
        customLogoUrl: null,
        welcomeText: 'Tu banca en línea, más segura y con mayor protección',
        footerText: '© Banorte México 2024. Todos los Derechos Reservados',
        useWhiteLogo: false,
        additionalStyles: {
          borderRadius: 10,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'BANCOPPEL':
      return {
        bank: 'BANCOPPEL',
        headerBackgroundColor: '#0066B3',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#0066B3',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 20,
        customLogoUrl: null,
        welcomeText: 'La llave a tu mundo financiero',
        footerText: '© BanCoppel México 2024. Todos los Derechos Reservados',
        useWhiteLogo: false,
        additionalStyles: {
          borderRadius: 8,
          borderColor: '#DDDDDD',
          boxShadow: true,
          animation: true
        }
      };
    case 'HSBC':
      return {
        bank: 'HSBC',
        headerBackgroundColor: '#FFFFFF',
        headerTextColor: '#000000',
        buttonBackgroundColor: '#DB0011',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 28,
        customLogoUrl: null,
        welcomeText: 'El banco local con perspectiva global',
        footerText: '© HSBC México 2024. Todos los Derechos Reservados',
        useWhiteLogo: false,
        additionalStyles: {
          borderRadius: 0,
          borderColor: '#EEEEEE',
          boxShadow: false,
          animation: true
        }
      };
    case 'AMEX':
      return {
        bank: 'AMEX',
        headerBackgroundColor: '#0077C8',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#006FCF',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 20,
        customLogoUrl: null,
        welcomeText: 'Bienvenido a American Express',
        footerText: '© American Express México 2024. Todos los Derechos Reservados',
        useWhiteLogo: false,
        additionalStyles: {
          borderRadius: 6,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'SANTANDER':
      return {
        bank: 'SANTANDER',
        headerBackgroundColor: '#EC0000',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#EC0000',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 28,
        customLogoUrl: null,
        welcomeText: 'Bienvenido a Santander, tu banco de confianza',
        footerText: '© Santander México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 12,
          borderColor: '#F6F6F6',
          boxShadow: true,
          animation: true
        }
      };
    case 'SCOTIABANK':
      return {
        bank: 'SCOTIABANK',
        headerBackgroundColor: '#EC111A',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#EC111A',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 28,
        customLogoUrl: null,
        welcomeText: 'Bienvenido a Scotiabank, tu banco con más posibilidades',
        footerText: '© Scotiabank México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 6,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'INVEX':
      return {
        bank: 'INVEX',
        headerBackgroundColor: '#BE0046',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#BE0046',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 10,
        customLogoUrl: null,
        welcomeText: 'Bienvenido a INVEX Banca Digital',
        footerText: '© INVEX México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 8,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'BANREGIO':
      return {
        bank: 'BANREGIO',
        headerBackgroundColor: '#FF6600',
        headerTextColor: '#FFFFFF',
        buttonBackgroundColor: '#FF6600',
        buttonTextColor: '#FFFFFF',
        mainBackgroundColor: '#FFFFFF',
        mainTextColor: '#333333',
        logoSize: 16,
        customLogoUrl: null,
        welcomeText: 'Bienvenido a Banregio Banca Digital',
        footerText: '© Banregio México 2024. Todos los Derechos Reservados',
        useWhiteLogo: true,
        additionalStyles: {
          borderRadius: 4,
          borderColor: '#EEEEEE',
          boxShadow: true,
          animation: true
        }
      };
    case 'BBVA':
    default:
      return defaultConfig;
  }
};

const getLogoForBank = (bankName: string, useWhiteLogo: boolean = false): string => {
  switch (bankName) {
    case 'LIVERPOOL':
      return liverpoolLogoPath;
    case 'CITIBANAMEX':
      return citibanamexLogoPath;
    case 'BANBAJIO':
      return banbajioLogoPath;
    case 'BBVA':
      return useWhiteLogo ? bbvaLogoWhitePath : bbvaLogoPath;
    case 'BANORTE':
      return banorteLogoPath;
    case 'BANCOPPEL':
      return bancoppelLogoPath;
    case 'HSBC':
      return hsbcLogoPath;
    case 'AMEX':
      return amexLogoPath;
    case 'SANTANDER':
      return santanderLogoPath;
    case 'SCOTIABANK':
      return scotiabankLogoPath;
    case 'INVEX':
      return invexLogoPath;
    case 'BANREGIO':
      return banregioLogoPath;
    default:
      return bbvaLogoPath;
  }
};

// Componente principal
const BankScreenEditor: React.FC = () => {
  const { toast } = useToast();
  const [selectedBank, setSelectedBank] = useState<string>('BBVA');
  const [config, setConfig] = useState<BankScreenConfig>(defaultConfig);
  const [activeTab, setActiveTab] = useState('appearance');
  const [fullPreviewMode, setFullPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activePreviewScreen, setActivePreviewScreen] = useState<PreviewScreenType>(PreviewScreenType.WELCOME);

  // Inicializar la configuración cuando se cambia el banco seleccionado
  useEffect(() => {
    setConfig(getBankDefaultConfig(selectedBank));
  }, [selectedBank]);

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Aquí se implementaría la lógica para guardar la configuración
      // Por ejemplo, hacer una llamada a la API
      // await apiRequest('POST', '/api/bank-screens/config', config);
      
      // Simulamos un retardo para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuración guardada",
        description: `La configuración para ${selectedBank} ha sido actualizada correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la configuración. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(getBankDefaultConfig(selectedBank));
    toast({
      title: "Configuración restablecida",
      description: `Se han restaurado los valores predeterminados para ${selectedBank}.`,
    });
  };

  // Función para obtener diferentes pantallas para el modo de vista previa
  const getScreenContent = useCallback(() => {
    const date = new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    switch (activePreviewScreen) {
      case PreviewScreenType.LOGIN:
        return (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Iniciar sesión</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm">Usuario / Número de cuenta</label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 rounded-md border"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">Contraseña</label>
                  <input
                    type="password"
                    className="w-full h-12 px-3 rounded-md border"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <button
                  className="w-full h-12 font-medium rounded-md mt-2"
                  style={{
                    backgroundColor: config.buttonBackgroundColor,
                    color: config.buttonTextColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
            <p className="text-sm text-center mt-4">
              ¿Olvidaste tu contraseña? <a href="#" className="text-blue-600">Recupérala aquí</a>
            </p>
          </>
        );
      
      case PreviewScreenType.CODE:
        return (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Verificación de seguridad</h3>
              <p className="text-sm mb-6">
                Por favor, ingresa el código de 6 dígitos que hemos enviado a tu teléfono registrado.
              </p>
              <div className="flex justify-center space-x-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border rounded-md"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm mb-4">¿No recibiste el código? <a href="#" className="text-blue-600">Reenviar</a></p>
                <button
                  className="w-full h-12 font-medium rounded-md"
                  style={{
                    backgroundColor: config.buttonBackgroundColor,
                    color: config.buttonTextColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Verificar
                </button>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.PIN:
        return (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Ingresa tu NIP</h3>
              <p className="text-sm mb-6 text-center">
                Para continuar, por favor ingresa el NIP de 4 dígitos.
              </p>
              <div className="flex justify-center space-x-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <input
                    key={i}
                    type="password"
                    maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold border rounded-md"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                ))}
              </div>
              <button
                className="w-full h-12 font-medium rounded-md"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  color: config.buttonTextColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`
                }}
              >
                Continuar
              </button>
            </div>
          </>
        );
        
      case PreviewScreenType.PROTECT:
        return (
          <>
            <div className="mb-6 text-center">
              <ShieldCheck className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium text-lg mb-4">Protección adicional requerida</h3>
              <p className="text-sm mb-6">
                Hemos detectado un intento de acceso inusual. Para proteger tu cuenta, necesitamos verificar tu identidad.
              </p>
              <div className="space-y-3 mb-6">
                <button
                  className="w-full h-12 font-medium rounded-md"
                  style={{
                    backgroundColor: config.buttonBackgroundColor,
                    color: config.buttonTextColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Enviar código por SMS
                </button>
                <button
                  className="w-full h-12 font-medium rounded-md border"
                  style={{
                    backgroundColor: 'transparent',
                    color: config.buttonBackgroundColor,
                    borderColor: config.buttonBackgroundColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Enviar código por email
                </button>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.CARD:
        return (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Datos de tarjeta</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm">Número de tarjeta</label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 rounded-md border"
                    placeholder="XXXX XXXX XXXX XXXX"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm">Fecha de expiración</label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 rounded-md border"
                      placeholder="MM/AA"
                      style={{
                        borderColor: config.additionalStyles.borderColor,
                        borderRadius: `${config.additionalStyles.borderRadius}px`
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm">CVV</label>
                    <input
                      type="text"
                      className="w-full h-12 px-3 rounded-md border"
                      placeholder="123"
                      style={{
                        borderColor: config.additionalStyles.borderColor,
                        borderRadius: `${config.additionalStyles.borderRadius}px`
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">Nombre en la tarjeta</label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 rounded-md border"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <button
                  className="w-full h-12 font-medium rounded-md mt-2"
                  style={{
                    backgroundColor: config.buttonBackgroundColor,
                    color: config.buttonTextColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.TRANSFER:
        return (
          <>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-4">Transferencia bancaria</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm">Cuenta de destino</label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 rounded-md border"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">Monto a transferir</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3">$</span>
                    <input
                      type="number"
                      className="w-full h-12 px-8 rounded-md border"
                      style={{
                        borderColor: config.additionalStyles.borderColor,
                        borderRadius: `${config.additionalStyles.borderRadius}px`
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm">Concepto</label>
                  <input
                    type="text"
                    className="w-full h-12 px-3 rounded-md border"
                    style={{
                      borderColor: config.additionalStyles.borderColor,
                      borderRadius: `${config.additionalStyles.borderRadius}px`
                    }}
                  />
                </div>
                <button
                  className="w-full h-12 font-medium rounded-md mt-2"
                  style={{
                    backgroundColor: config.buttonBackgroundColor,
                    color: config.buttonTextColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Transferir
                </button>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.CANCEL:
        return (
          <>
            <div className="mb-6 text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <h3 className="font-medium text-lg mb-4">Cancelar operación</h3>
              <p className="text-sm mb-6">
                Estás a punto de cancelar la operación en curso. Esta acción no se puede deshacer.
              </p>
              <div className="space-y-3 mb-4">
                <button
                  className="w-full h-12 font-medium rounded-md"
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  Sí, cancelar operación
                </button>
                <button
                  className="w-full h-12 font-medium rounded-md border"
                  style={{
                    backgroundColor: 'transparent',
                    color: config.buttonBackgroundColor,
                    borderColor: config.buttonBackgroundColor,
                    borderRadius: `${config.additionalStyles.borderRadius}px`
                  }}
                >
                  No, continuar
                </button>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.MESSAGE:
        return (
          <>
            <div className="mb-6 text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-blue-500" />
              <h3 className="font-medium text-lg mb-4">Mensaje importante</h3>
              <div className="border p-4 rounded-md mb-6 text-left"
                style={{
                  borderColor: config.additionalStyles.borderColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`
                }}
              >
                <p className="text-sm">
                  Estimado cliente,<br/><br/>
                  Hemos detectado una actividad inusual en tu cuenta. Para garantizar la seguridad de tus fondos, hemos 
                  implementado medidas de protección temporales. Por favor, completa la verificación de identidad 
                  para restablecer el acceso completo a tu cuenta.
                </p>
              </div>
              <button
                className="w-full h-12 font-medium rounded-md"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  color: config.buttonTextColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`
                }}
              >
                Entendido
              </button>
            </div>
          </>
        );
        
      case PreviewScreenType.VALIDATING:
        return (
          <>
            <div className="mb-6 text-center">
              <div className={`mx-auto mb-4 relative h-16 w-16 ${config.additionalStyles.animation ? 'animate-spin' : ''}`}>
                <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              </div>
              <h3 className="font-medium text-lg mb-4">Validando información</h3>
              <p className="text-sm mb-8">
                Por favor espera mientras validamos tu información. Este proceso puede tomar unos segundos.
              </p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-green-500 ${config.additionalStyles.animation ? 'animate-pulse' : ''}`}
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
          </>
        );
        
      case PreviewScreenType.SMS:
        return (
          <>
            <div className="mb-6 text-center">
              <Smartphone className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="font-medium text-lg mb-4">Código SMS de verificación</h3>
              <div className="border p-4 rounded-md mb-6"
                style={{
                  borderColor: config.additionalStyles.borderColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`,
                  backgroundColor: '#F8F9FA'
                }}
              >
                <p className="font-bold text-xl tracking-wider">123456</p>
                <p className="text-xs mt-2 text-gray-500">Código válido por 5 minutos</p>
              </div>
              <p className="text-sm mb-6">
                Ingresa este código en la aplicación para verificar tu identidad y completar la operación.
              </p>
              <button
                className="w-full h-12 font-medium rounded-md"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  color: config.buttonTextColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`
                }}
              >
                Ingresar código manualmente
              </button>
            </div>
          </>
        );
        
      case PreviewScreenType.WELCOME:
      default:
        return (
          <>
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4">¡Bienvenido!</h2>
              <p className="mb-6">{config.welcomeText}</p>
              <button
                className="h-12 px-6 font-medium rounded-md"
                style={{
                  backgroundColor: config.buttonBackgroundColor,
                  color: config.buttonTextColor,
                  borderRadius: `${config.additionalStyles.borderRadius}px`
                }}
              >
                Comenzar
              </button>
            </div>
          </>
        );
    }
  }, [activePreviewScreen, config]);

  // Función para renderizar la vista previa del encabezado del banco
  const renderBankPreview = useCallback(() => {
    const logoSrc = config.customLogoUrl || getLogoForBank(selectedBank, config.useWhiteLogo);
    const date = new Date().toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });

    const shadowStyle = config.additionalStyles.boxShadow 
      ? 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);'
      : '';

    return (
      <div 
        className="border rounded-md overflow-hidden flex flex-col"
        style={{ 
          minHeight: fullPreviewMode ? '600px' : '500px',
          borderRadius: `${config.additionalStyles.borderRadius}px`,
          borderColor: config.additionalStyles.borderColor,
          backgroundColor: config.mainBackgroundColor,
          color: config.mainTextColor
        }}
      >
        <div 
          style={{ 
            backgroundColor: config.headerBackgroundColor,
            color: config.headerTextColor,
            [shadowStyle]: ''
          }}
          className="p-4 text-center"
        >
          <div className="font-bold text-sm mb-2">{date}</div>
          <img 
            src={logoSrc} 
            className="inline-block" 
            alt={selectedBank} 
            style={{ 
              height: `${config.logoSize * 4}px`,
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
        
        <div className="text-center p-6 flex-grow flex flex-col justify-center"
          style={{
            backgroundColor: config.mainBackgroundColor,
            color: config.mainTextColor
          }}
        >
          {getScreenContent()}
        </div>
        
        <div 
          style={{ 
            backgroundColor: config.headerBackgroundColor,
            color: config.headerTextColor
          }} 
          className="p-4 text-center text-sm mt-auto w-full"
        >
          <div>{config.footerText}</div>
        </div>
      </div>
    );
  }, [config, selectedBank, fullPreviewMode, activePreviewScreen, getScreenContent]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editor Avanzado de Pantallas de Bancos</CardTitle>
        <CardDescription>
          Personaliza todos los aspectos visuales de las pantallas de los clientes para cada banco
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[70vh] overflow-y-auto">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-select">Seleccionar Banco</Label>
                <Select
                  value={selectedBank}
                  onValueChange={(value) => setSelectedBank(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BankType)
                      .filter(bank => bank !== BankType.ALL && bank !== BankType.SPIN)
                      .map(bank => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="appearance">
                    <Palette className="h-4 w-4 mr-2" />
                    Apariencia
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <Type className="h-4 w-4 mr-2" />
                    Contenido
                  </TabsTrigger>
                  <TabsTrigger value="advanced">
                    <Layout className="h-4 w-4 mr-2" />
                    Avanzado
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="appearance" className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="header">
                      <AccordionTrigger>Encabezado</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <ColorPicker
                          label="Color de Fondo del Encabezado"
                          value={config.headerBackgroundColor}
                          onChange={(color: string) => setConfig({...config, headerBackgroundColor: color})}
                        />
                        
                        <ColorPicker
                          label="Color de Texto del Encabezado"
                          value={config.headerTextColor}
                          onChange={(color: string) => setConfig({...config, headerTextColor: color})}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="logo">
                      <AccordionTrigger>Logo</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="logo-size">Tamaño del Logo</Label>
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Slider
                                value={[config.logoSize]}
                                min={4}
                                max={40}
                                step={1}
                                onValueChange={(val) => setConfig({...config, logoSize: val[0]})}
                              />
                            </div>
                            <div className="w-16">
                              <Input
                                id="logo-size"
                                type="number"
                                value={config.logoSize}
                                onChange={(e) => setConfig({...config, logoSize: Number(e.target.value)})}
                                min={4}
                                max={40}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="white-logo"
                            checked={config.useWhiteLogo}
                            onCheckedChange={(checked) => setConfig({...config, useWhiteLogo: checked})}
                          />
                          <Label htmlFor="white-logo">Usar logo en color blanco</Label>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="buttons">
                      <AccordionTrigger>Botones</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <ColorPicker
                          label="Color de Fondo de Botones"
                          value={config.buttonBackgroundColor}
                          onChange={(color: string) => setConfig({...config, buttonBackgroundColor: color})}
                        />
                        
                        <ColorPicker
                          label="Color de Texto de Botones"
                          value={config.buttonTextColor}
                          onChange={(color: string) => setConfig({...config, buttonTextColor: color})}
                        />
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="main">
                      <AccordionTrigger>Área Principal</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <ColorPicker
                          label="Color de Fondo Principal"
                          value={config.mainBackgroundColor}
                          onChange={(color: string) => setConfig({...config, mainBackgroundColor: color})}
                        />
                        
                        <ColorPicker
                          label="Color de Texto Principal"
                          value={config.mainTextColor}
                          onChange={(color: string) => setConfig({...config, mainTextColor: color})}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>

                <TabsContent value="content" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="welcome-text">Texto de Bienvenida</Label>
                    <Textarea
                      id="welcome-text"
                      placeholder="Introduzca el texto de bienvenida..."
                      value={config.welcomeText}
                      onChange={(e) => setConfig({...config, welcomeText: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer-text">Texto del Pie de Página</Label>
                    <Input
                      id="footer-text"
                      placeholder="Texto del pie de página..."
                      value={config.footerText}
                      onChange={(e) => setConfig({...config, footerText: e.target.value})}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Logo Personalizado</Label>
                    <ImageUploader
                      onImageChange={(url: string) => setConfig({...config, customLogoUrl: url})}
                      previewUrl={config.customLogoUrl}
                      size={config.logoSize}
                      onSizeChange={(size: number) => setConfig({...config, logoSize: size})}
                    />
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Estilos Adicionales</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="border-radius">Redondeo de Bordes</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Slider
                            value={[config.additionalStyles.borderRadius]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={(val) => setConfig({
                              ...config, 
                              additionalStyles: {
                                ...config.additionalStyles,
                                borderRadius: val[0]
                              }
                            })}
                          />
                        </div>
                        <div className="w-16">
                          <Input
                            id="border-radius"
                            type="number"
                            value={config.additionalStyles.borderRadius}
                            onChange={(e) => setConfig({
                              ...config, 
                              additionalStyles: {
                                ...config.additionalStyles,
                                borderRadius: Number(e.target.value)
                              }
                            })}
                            min={0}
                            max={20}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="border-color">Color de Borde</Label>
                      <Input
                        id="border-color"
                        type="color"
                        value={config.additionalStyles.borderColor}
                        onChange={(e) => setConfig({
                          ...config, 
                          additionalStyles: {
                            ...config.additionalStyles,
                            borderColor: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="box-shadow"
                        checked={config.additionalStyles.boxShadow}
                        onCheckedChange={(checked) => setConfig({
                          ...config, 
                          additionalStyles: {
                            ...config.additionalStyles,
                            boxShadow: checked
                          }
                        })}
                      />
                      <Label htmlFor="box-shadow">Activar sombras</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="animation"
                        checked={config.additionalStyles.animation}
                        onCheckedChange={(checked) => setConfig({
                          ...config, 
                          additionalStyles: {
                            ...config.additionalStyles,
                            animation: checked
                          }
                        })}
                      />
                      <Label htmlFor="animation">Activar animaciones</Label>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                  >
                    Restablecer
                  </Button>
                  <Button
                    onClick={handleSaveConfig}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setFullPreviewMode(!fullPreviewMode)}
                >
                  {fullPreviewMode ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Ocultar detalles
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Mostrar detalles
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="rounded-md border p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Vista Previa</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <span>Pantalla:</span>
                  <Select
                    value={activePreviewScreen}
                    onValueChange={(value: PreviewScreenType) => setActivePreviewScreen(value)}
                  >
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue placeholder="Selecciona" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={PreviewScreenType.WELCOME}>
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1" />
                          <span>Bienvenida</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.LOGIN}>
                        <div className="flex items-center">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          <span>Login</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.CODE}>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>Código</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.PIN}>
                        <div className="flex items-center">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          <span>NIP</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.PROTECT}>
                        <div className="flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          <span>Protección</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.CARD}>
                        <div className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" />
                          <span>Tarjeta</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.TRANSFER}>
                        <div className="flex items-center">
                          <Download className="h-3 w-3 mr-1" />
                          <span>Transferir</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.CANCEL}>
                        <div className="flex items-center">
                          <ShieldAlert className="h-3 w-3 mr-1" />
                          <span>Cancelar</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.MESSAGE}>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>Mensaje</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.VALIDATING}>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Validando</span>
                        </div>
                      </SelectItem>
                      <SelectItem value={PreviewScreenType.SMS}>
                        <div className="flex items-center">
                          <Smartphone className="h-3 w-3 mr-1" />
                          <span>SMS</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="bg-gray-50 rounded-md p-4 overflow-hidden">
                {renderBankPreview()}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="text-xs text-muted-foreground">
          Los cambios se aplicarán a todas las nuevas sesiones después de guardar
        </div>
        <div className="text-xs text-muted-foreground">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
};

export default BankScreenEditor;