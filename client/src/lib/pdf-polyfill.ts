// Polyfills necesarios para pdfkit en el navegador
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.global = window;
}

export {};