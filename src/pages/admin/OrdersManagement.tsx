import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CheckCircle, Edit } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  items: any;
  total_price: number;
  status: string;
  created_at: string;
}

const OrdersManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editPhone, setEditPhone] = useState("");
  const [editName, setEditName] = useState("");

  useEffect(() => {
    checkAdminAndLoad();
  }, []);

  const checkAdminAndLoad = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast.error("Tidak memiliki akses admin");
        navigate("/");
        return;
      }

      await loadOrders();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data");
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat pesanan");
      return;
    }

    setOrders(data || []);
  };

  const handleConfirmOrder = async (orderId: string, items: any) => {
    if (!confirm("Konfirmasi pesanan ini? Stok produk akan dikurangi.")) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update order status
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
          confirmed_by: session.user.id,
        })
        .eq("id", orderId);

      if (orderError) throw orderError;

      // Update product stock
      for (const item of items) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (product) {
          const { error: stockError } = await supabase
            .from("products")
            .update({ stock: product.stock - item.quantity })
            .eq("id", item.id);

          if (stockError) throw stockError;
        }
      }

      toast.success("Pesanan berhasil dikonfirmasi");
      await loadOrders();
    } catch (error: any) {
      toast.error("Gagal konfirmasi pesanan: " + error.message);
    }
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setEditName(order.customer_name);
    setEditPhone(order.customer_phone);
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;

    try {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: editName,
          customer_phone: editPhone,
        })
        .eq("id", editingOrder.id);

      if (error) throw error;

      toast.success("Pesanan berhasil diupdate");

      setEditingOrder(null);
      loadOrders();
    } catch (error: any) {
      toast.error("Error: " + error.message);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AdminLayout title="Manajemen Pesanan">
      <Card>
          <CardHeader>
            <CardTitle>Daftar Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Telepon</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.customer_phone}</TableCell>
                    <TableCell>Rp {order.total_price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "confirmed" ? "default" : "secondary"}>
                        {order.status === "confirmed" ? "Terkonfirmasi" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Detail Pesanan</DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div>
                                  <p className="font-semibold">Nama: {selectedOrder.customer_name}</p>
                                  <p>Telepon: {selectedOrder.customer_phone}</p>
                                </div>
                                <div>
                                  <p className="font-semibold mb-2">Item:</p>
                                  <ul className="space-y-1">
                                    {selectedOrder.items.map((item: any, idx: number) => (
                                      <li key={idx}>
                                        {item.name} x{item.quantity} - Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <p className="text-lg font-bold">
                                  Total: Rp {selectedOrder.total_price.toLocaleString("id-ID")}
                                </p>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {order.status === "pending" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConfirmOrder(order.id, order.items)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Konfirmasi
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Order Dialog */}
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pesanan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nama Customer</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Nomor WhatsApp</Label>
                <Input
                  id="edit-phone"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveEdit} className="flex-1">
                  Simpan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingOrder(null)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </AdminLayout>
  );
};

export default OrdersManagement;