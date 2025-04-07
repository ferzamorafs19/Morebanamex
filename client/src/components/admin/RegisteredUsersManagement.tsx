import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, UserCheck, UserX } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import { UserRole } from "@shared/schema";

export type UserData = {
  id: number;
  username: string;
  role: UserRole;
  lastLogin?: string;
  active: boolean;
};

export default function RegisteredUsersManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserData[]>([]);

  // Consultar usuarios regulares
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/users/regular"],
    queryFn: async ({ signal }) => {
      const response = await fetch("/api/users/regular", { signal });
      if (!response.ok) {
        throw new Error("Error al cargar usuarios registrados");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  // Mutation para cambiar el estado de un usuario
  const toggleStatusMutation = useMutation({
    mutationFn: async (username: string) => {
      const response = await apiRequest(
        "PUT",
        `/api/users/regular/${username}/toggle-status`,
        {}
      );
      if (!response.ok) {
        throw new Error("Error al cambiar el estado del usuario");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users/regular"] });
      toast({
        title: "Estado actualizado",
        description: "El estado del usuario ha sido actualizado correctamente.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Función para cambiar el estado de un usuario
  const handleToggleStatus = (user: UserData) => {
    toggleStatusMutation.mutate(user.username);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error al cargar usuarios: {error instanceof Error ? error.message : "Error desconocido"}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usuarios Registrados</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay usuarios registrados</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Último acceso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: UserData) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>
                    {user.lastLogin ? formatDate(new Date(user.lastLogin)) : "Nunca"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                      disabled={toggleStatusMutation.isPending}
                    >
                      {user.active ? (
                        <>
                          <UserX className="h-4 w-4 mr-2" />
                          Desactivar
                        </>
                      ) : (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Activar
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}