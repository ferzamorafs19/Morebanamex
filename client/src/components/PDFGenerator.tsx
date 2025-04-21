import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import invexLogo from '@assets/Invex.png';

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
        format: 'a4'
      });
      
      // Cargar la imagen como URL
      const img = new Image();
      img.src = invexLogo;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      // Convertir la imagen a una URL base64
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Añadir el logo en la parte superior centrada
        const pageWidth = doc.internal.pageSize.getWidth();
        const imgWidth = 40; // Ancho de la imagen en mm
        const imgHeight = (img.height * imgWidth) / img.width; // Mantener proporción
        doc.addImage(dataUrl, 'PNG', (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);
      }

      // Agregar información del cliente
      doc.setFont('helvetica');
      doc.setFontSize(12);
      doc.text(`${formData.nombre}`, 20, 50);
      doc.text(`${formData.direccion}, RFC: ${formData.rfc}`, 20, 55);
      
      // Agregar el texto de la carta
      doc.setFontSize(11);
      const textoBase = 65;
      doc.text(`Por medio de la presente, yo, ${formData.nombre}, titular de la tarjeta de crédito con`, 20, textoBase);
      doc.text(`terminación ${formData.terminacion}, solicito la cancelación del plástico correspondiente a dicha tarjeta,`, 20, textoBase + 5);
      doc.text(`en cumplimiento del procedimiento establecido por INVEX Banco. Declaro que he`, 20, textoBase + 10);
      doc.text(`destruido físicamente el plástico anterior y lo he colocado dentro de un sobre cerrado,`, 20, textoBase + 15);
      doc.text(`siguiendo las instrucciones proporcionadas por su equipo de atención. Asimismo,`, 20, textoBase + 20);
      doc.text(`confirmo que he colocado de forma visible en el exterior del sobre el folio de`, 20, textoBase + 25);
      doc.text(`seguimiento asignado, y que esta carta firmada se encuentra incluida en el interior del`, 20, textoBase + 30);
      doc.text(`paquete. Solicito que, una vez recibido y validado el contenido del paquete por parte`, 20, textoBase + 35);
      doc.text(`de INVEX, se continúe con el proceso de reposición y emisión del nuevo plástico`, 20, textoBase + 40);
      doc.text(`correspondiente a mi cuenta. Sin más por el momento, agradezco su atención y`, 20, textoBase + 45);
      doc.text(`quedo al pendiente de cualquier requerimiento adicional por parte de su institución.`, 20, textoBase + 50);

      // Agregar sección de firma
      doc.text('Atentamente,', 20, textoBase + 65);
      doc.text('Firma del titular: ____________________________', 20, textoBase + 85);
      doc.text('Fecha: _____ / _____ / _______', 20, textoBase + 95);

      // Guardar el PDF
      const pdfName = `carta_cancelacion_invex_${formData.nombre.replace(/\s+/g, '_')}.pdf`;
      doc.save(pdfName);
      
      toast({
        title: "PDF generado correctamente",
        description: "La carta de cancelación ha sido descargada",
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
          Ingresa los datos para generar la carta de cancelación de tu tarjeta INVEX
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