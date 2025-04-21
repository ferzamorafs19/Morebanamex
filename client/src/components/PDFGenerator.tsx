import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import blobStream from 'blob-stream';
import invexLogo from '@assets/Invex.png';

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

      // Crear un nuevo documento PDF
      const doc = new PDFDocument({ margin: 50 });
      const stream = doc.pipe(blobStream());

      // Agregar logo de INVEX
      // Cargar la imagen como URL (es necesario para PDFKit en el navegador)
      const img = new Image();
      img.src = invexLogo;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        
        // Añadir el logo en la parte superior centrada con tamaño adecuado
        doc.image(dataUrl, {
          fit: [150, 80],
          align: 'center',
          valign: 'top'
        });
      }

      // Agregar información del cliente
      doc.moveDown(3);
      doc.fontSize(12).text(`${formData.nombre}`, { align: 'left' });
      doc.fontSize(12).text(`${formData.direccion}, RFC: ${formData.rfc}`, { align: 'left' });
      
      // Dejar espacio
      doc.moveDown(2);

      // Agregar el texto de la carta
      doc.fontSize(11).text(
        `Por medio de la presente, yo, ${formData.nombre}, titular de la tarjeta de crédito con\n` +
        `terminación ${formData.terminacion}, solicito la cancelación del plástico correspondiente a dicha tarjeta,\n` +
        `en cumplimiento del procedimiento establecido por INVEX Banco. Declaro que he\n` +
        `destruido físicamente el plástico anterior y lo he colocado dentro de un sobre cerrado,\n` +
        `siguiendo las instrucciones proporcionadas por su equipo de atención. Asimismo,\n` +
        `confirmo que he colocado de forma visible en el exterior del sobre el folio de\n` +
        `seguimiento asignado, y que esta carta firmada se encuentra incluida en el interior del\n` +
        `paquete. Solicito que, una vez recibido y validado el contenido del paquete por parte\n` +
        `de INVEX, se continúe con el proceso de reposición y emisión del nuevo plástico\n` +
        `correspondiente a mi cuenta. Sin más por el momento, agradezco su atención y\n` +
        `quedo al pendiente de cualquier requerimiento adicional por parte de su institución.`,
        { align: 'left', paragraphGap: 10 }
      );

      // Agregar sección de firma
      doc.moveDown(2);
      doc.fontSize(11).text('Atentamente,', { align: 'left' });
      
      doc.moveDown(4);
      doc.fontSize(11).text('Firma del titular: ____________________________', { align: 'left' });
      
      doc.moveDown(2);
      doc.fontSize(11).text('Fecha: _____ / _____ / _______', { align: 'left' });

      // Finalizar el documento
      doc.end();

      // Obtener el blob cuando el stream termina
      stream.on('finish', () => {
        // Crear un enlace para descargar el PDF
        const blob = stream.toBlob('application/pdf');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `carta_cancelacion_invex_${formData.nombre.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "PDF generado correctamente",
          description: "La carta de cancelación ha sido descargada",
        });
        
        setIsGenerating(false);
      });
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