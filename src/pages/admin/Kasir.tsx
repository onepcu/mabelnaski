import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export default function Kasir() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, isLoading } = useProducts();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (!roleData || (roleData.role !== "kasir" && roleData.role !== "admin")) {
      navigate("/");
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki akses ke halaman ini",
        variant: "destructive",
      });
    }
  };

  const addToCart = (product: typeof products[0]) => {
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stok Tidak Cukup",
          description: "Jumlah melebihi stok yang tersedia",
          variant: "destructive",
        });
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      if (product.stock === 0) {
        toast({
          title: "Stok Habis",
          description: "Produk ini sedang tidak tersedia",
          variant: "destructive",
        });
        return;
      }
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          stock: product.stock,
        },
      ]);
    }
  };

  const updateQuantity = (id: string, change: number) => {
    const item = cart.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.id !== id));
      return;
    }

    if (newQuantity > item.stock) {
      toast({
        title: "Stok Tidak Cukup",
        description: "Jumlah melebihi stok yang tersedia",
        variant: "destructive",
      });
      return;
    }

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleProcessTransaction = async () => {
    if (cart.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Tambahkan produk terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const paymentAmount = parseFloat(payment);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: "Pembayaran Tidak Valid",
        description: "Masukkan jumlah pembayaran yang valid",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Process transaction and reduce stock
      const { data, error } = await supabase.rpc("process_cashier_transaction", {
        p_items: cart as any,
        p_total_price: totalPrice,
        p_payment: paymentAmount,
      });

      if (error) throw error;

      const result = data as { success: boolean; message: string; change: number };

      if (!result.success) {
        toast({
          title: "Transaksi Gagal",
          description: result.message,
          variant: "destructive",
        });
        return;
      }

      // Create order record
      const { error: orderError } = await supabase.from("orders").insert({
        items: cart as any,
        total_price: totalPrice,
        status: "completed",
        customer_name: "Kasir (Offline)",
        customer_phone: "-",
      });

      if (orderError) throw orderError;

      toast({
        title: "Transaksi Berhasil",
        description: `Kembalian: Rp ${result.change.toLocaleString("id-ID")}`,
      });

      // Reset
      setCart([]);
      setPayment("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout title="Kasir">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Produk</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Memuat produk...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Rp {product.price.toLocaleString("id-ID")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Stok: {product.stock}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart & Payment */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Keranjang
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Keranjang kosong
                </p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Rp {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-lg">Total</Label>
                <p className="text-3xl font-bold text-primary">
                  Rp {totalPrice.toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <Label htmlFor="payment">Jumlah Pembayaran</Label>
                <Input
                  id="payment"
                  type="number"
                  placeholder="0"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>

              {payment && parseFloat(payment) >= totalPrice && (
                <div>
                  <Label>Kembalian</Label>
                  <p className="text-2xl font-bold text-green-600">
                    Rp{" "}
                    {(parseFloat(payment) - totalPrice).toLocaleString("id-ID")}
                  </p>
                </div>
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleProcessTransaction}
                disabled={isProcessing || cart.length === 0}
              >
                {isProcessing ? "Memproses..." : "Proses Transaksi"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
