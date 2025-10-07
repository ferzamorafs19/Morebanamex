import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { PDFGenerator } from '@/components/PDFGenerator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PDFGeneratorPage() {
  const { user } = useAuth();

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Generador de Documentos</h1>
      
      <Tabs defaultValue="carta-cancelacion" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="carta-cancelacion">Carta de Cancelación Banamex</TabsTrigger>
        </TabsList>
        
        <TabsContent value="carta-cancelacion" className="mt-6">
          <PDFGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}