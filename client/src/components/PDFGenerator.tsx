import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import banamexLogo from '../assets/Banamex.png';

// Importar el polyfill para PDFKit en el navegador
import '@/lib/pdf-polyfill';

interface PDFFormData {
  nombre: string;
  direccion: string;
  rfc: string;
  terminacion: string;
}

export const PDFGenerator: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<PDFFormData>({
    nombre: '',
    direccion: '',
    rfc: '',
    terminacion: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Validar que todos los campos estén llenos
      if (!formData.nombre || !formData.direccion || !formData.rfc || !formData.terminacion) {
        toast({
          title: "Error de validación",
          description: "Por favor completa todos los campos del formulario",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      // Crear un nuevo documento PDF (formato A4)
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter' // Formato carta (estándar APA)
      });
      
      // Cargar la imagen como URL
      const img = new Image();
      img.src = banamexLogo;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Obtener el ancho de la página
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Convertir la imagen a una URL base64
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Añadir el logo en la parte superior centrada
        const imgWidth = 35; // Ancho de la imagen en mm
        const imgHeight = (img.height * imgWidth) / img.width; // Mantener proporción
        doc.addImage(dataUrl, 'PNG', (pageWidth - imgWidth) / 2, 15, imgWidth, imgHeight);
      }

      // Obtener la fecha actual
      const fecha = new Date();
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      // Información de documento en formato APA
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const marginLeft = 25;
      let currentY = 60;

      // Fecha en la esquina superior derecha (estilo APA)
      doc.text(fechaFormateada, pageWidth - marginLeft - 20, currentY);
      currentY += 15;

      // Información de destinatario (estilo APA)
      doc.text("Banco Nacional de México, S.A.", marginLeft, currentY);
      currentY += 5;
      doc.text("Servicios Financieros Banamex", marginLeft, currentY);
      currentY += 5;
      doc.text("Av. Santa Fe 495, Piso 12", marginLeft, currentY);
      currentY += 5;
      doc.text("Col. Cruz Manca", marginLeft, currentY);
      currentY += 5;
      doc.text("C.P. 05349, Ciudad de México", marginLeft, currentY);
      currentY += 15;

      // Asunto (estilo APA)
      doc.setFont("helvetica", "bold");
      doc.text("ASUNTO: SOLICITUD DE CANCELACIÓN DE TARJETA DE CRÉDITO", marginLeft, currentY);
      doc.setFont("helvetica", "normal");
      currentY += 15;

      // Saludo (estilo APA)
      doc.text("A quien corresponda:", marginLeft, currentY);
      currentY += 10;

      // Cuerpo del texto (estilo APA - primera línea de párrafo con sangría)
      const lineHeight = 6;
      const textWidth = pageWidth - (2 * marginLeft);
      
      // Primer párrafo
      doc.setFontSize(11);
      const parrafo1 = `       Por medio de la presente, yo, ${formData.nombre}, con RFC ${formData.rfc} y domicilio en ${formData.direccion}, titular de la tarjeta de crédito Banamex con terminación ${formData.terminacion}, solicito formalmente la cancelación del plástico correspondiente a dicha tarjeta, de acuerdo con los procedimientos establecidos por su institución.`;
      
      const splitParrafo1 = doc.splitTextToSize(parrafo1, textWidth);
      doc.text(splitParrafo1, marginLeft, currentY);
      currentY += splitParrafo1.length * lineHeight + 5;
      
      // Segundo párrafo
      const parrafo2 = `       Declaro bajo protesta de decir verdad que he destruido físicamente el plástico de la tarjeta siguiendo las instrucciones de seguridad proporcionadas por su equipo de atención al cliente, y he depositado los restos en un sobre cerrado según el protocolo indicado.`;
      
      const splitParrafo2 = doc.splitTextToSize(parrafo2, textWidth);
      doc.text(splitParrafo2, marginLeft, currentY);
      currentY += splitParrafo2.length * lineHeight + 5;
      
      // Tercer párrafo
      const parrafo3 = `       Asimismo, confirmo que he colocado de forma visible en el exterior del sobre el folio de seguimiento asignado para este trámite, y que la presente carta firmada se incluye en el interior del paquete como parte de la documentación requerida.`;
      
      const splitParrafo3 = doc.splitTextToSize(parrafo3, textWidth);
      doc.text(splitParrafo3, marginLeft, currentY);
      currentY += splitParrafo3.length * lineHeight + 5;
      
      // Cuarto párrafo
      const parrafo4 = `       Solicito que, una vez recibido y validado el contenido del paquete, se proceda con el trámite de reposición y emisión del nuevo plástico correspondiente a mi cuenta, de acuerdo con los términos y condiciones establecidos en el contrato de apertura.`;
      
      const splitParrafo4 = doc.splitTextToSize(parrafo4, textWidth);
      doc.text(splitParrafo4, marginLeft, currentY);
      currentY += splitParrafo4.length * lineHeight + 5;
      
      // Quinto párrafo (cierre)
      const parrafo5 = `       Sin otro particular por el momento, agradezco su atención y quedo a la espera de la confirmación de este trámite. Para cualquier aclaración o requerimiento adicional, estoy a su disposición.`;
      
      const splitParrafo5 = doc.splitTextToSize(parrafo5, textWidth);
      doc.text(splitParrafo5, marginLeft, currentY);
      currentY += splitParrafo5.length * lineHeight + 15;

      // Despedida
      doc.text("Atentamente,", marginLeft, currentY);
      currentY += 25;

      // Firma
      doc.setFontSize(11);
      doc.text("_____________________________", marginLeft, currentY);
      currentY += 7;
      doc.text(formData.nombre.toUpperCase(), marginLeft, currentY);
      currentY += 5;
      doc.text(`Titular de la tarjeta con terminación ${formData.terminacion}`, marginLeft, currentY);
      currentY += 5;
      doc.text(`RFC: ${formData.rfc}`, marginLeft, currentY);

      // Guardar el PDF
      const pdfName = `carta_cancelacion_platacard_${formData.nombre.replace(/\s+/g, '_')}.pdf`;
      doc.save(pdfName);
      
      toast({
        title: "PDF generado correctamente",
        description: "La carta de cancelación en formato APA ha sido descargada",
      });
      
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast({
        title: "Error al generar PDF",
        description: "Ocurrió un error al generar el documento. Intente nuevamente.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generar Carta de Cancelación</CardTitle>
        <CardDescription>
          Ingresa los datos para generar la carta de cancelación de tu tarjeta Banamex
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre completo</Label>
          <Input
            id="nombre"
            name="nombre"
            placeholder="Ej. Brandon Ortega"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección completa</Label>
          <Input
            id="direccion"
            name="direccion"
            placeholder="Ej. Zempoala 23, Col. Narvarte, Benito Juárez, 03320, Ciudad de México"
            value={formData.direccion}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rfc">RFC</Label>
          <Input
            id="rfc"
            name="rfc"
            placeholder="Ej. OETB010203"
            value={formData.rfc}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="terminacion">Terminación de tarjeta (últimos 3 dígitos)</Label>
          <Input
            id="terminacion"
            name="terminacion"
            placeholder="Ej. 532"
            value={formData.terminacion}
            onChange={handleChange}
            maxLength={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? "Generando PDF..." : "Generar PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
};