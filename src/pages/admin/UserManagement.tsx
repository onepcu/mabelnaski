import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUsers, useUpdateUserRole, useDeleteUserRole } from "@/hooks/useUserManagement";
import { Loader2, Users, Trash2, Shield, User, CreditCard, Crown } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const roleConfig = {
  super_admin: { label: "Super Admin", icon: Crown, variant: "default" as const },
  admin: { label: "Admin", icon: Shield, variant: "secondary" as const },
  kasir: { label: "Kasir", icon: CreditCard, variant: "outline" as const },
  user: { label: "User", icon: User, variant: "outline" as const },
};

const UserManagement = () => {
  const { data: users, isLoading } = useUsers();
  const updateRole = useUpdateUserRole();
  const deleteRole = useDeleteUserRole();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRole.mutate(
      { userId, role: newRole as "admin" | "user" | "kasir" | "super_admin" },
      {
        onSuccess: () => setEditingUserId(null),
      }
    );
  };

  const getRoleBadge = (role: string) => {
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
          <p className="text-muted-foreground">Kelola pengguna dan role mereka</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Super Admin</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u) => u.role === "super_admin").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u) => u.role === "admin").length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kasir</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users?.filter((u) => u.role === "kasir").length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>
              Lihat dan kelola role pengguna yang terdaftar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Terdaftar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || "Belum diisi"}
                      </TableCell>
                      <TableCell>{user.phone || "-"}</TableCell>
                      <TableCell>
                        {editingUserId === user.id ? (
                          <Select
                            defaultValue={user.role || "user"}
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="kasir">Kasir</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          getRoleBadge(user.role || "user")
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setEditingUserId(editingUserId === user.id ? null : user.id)
                            }
                          >
                            {editingUserId === user.id ? "Batal" : "Ubah Role"}
                          </Button>
                          {user.role && user.role !== "user" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Role?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Pengguna ini akan dikembalikan ke role "User" biasa.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteRole.mutate(user.id)}
                                  >
                                    Hapus Role
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Belum ada pengguna terdaftar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
