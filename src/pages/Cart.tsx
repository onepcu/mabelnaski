import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, { message: "Nama harus diisi" }).max(100),
  phone: z.string().trim().min(10, { message: "Nomor telepon harus valid" }).max(15),
  address: z.string().trim().min(10, { message: "Alamat minimal 10 karakter" }).max(500),
});

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);

      if (session) {
        // Load profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profile) {
          setCustomerName(profile.full_name || "");
          setCustomerPhone(profile.phone || "");
          setCustomerAddress(profile.address || "");
        }
      }
    };

    checkAuthAndLoadProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        setTimeout(() => {
          supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single()
            .then(({ data: profile }) => {
              if (profile) {
                setCustomerName(profile.full_name || "");
                setCustomerPhone(profile.phone || "");
                setCustomerAddress(profile.address || "");
              }
            });
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      toast.error("Silakan login terlebih dahulu untuk checkout");
      navigate("/auth");
      return;
    }
    setIsDialogOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong!");
      return;
    }

    setIsCheckingOut(true);

    try {
      // Validate input
      const validated = checkoutSchema.parse({ 
        name: customerName, 
        phone: customerPhone,
        address: customerAddress 
      });

      // Update profile with latest data
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase
          .from("profiles")
          .upsert({
            user_id: session.user.id,
            full_name: validated.name,
            phone: validated.phone,
            address: validated.address,
          });
      }

      // Save order to database
      const orderData = {
        customer_name: validated.name,
        customer_phone: validated.phone,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total_price: totalPrice,
        status: "pending"
      };

      const { error } = await supabase
        .from("orders")
        .insert([orderData]);

      if (error) throw error;

      // Format WhatsApp message
      let message = `Halo, saya ${validated.name} ingin memesan:\n\n`;
      
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Jumlah: ${item.quantity}\n`;
        message += `   Harga: Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n\n`;
      });

      message += `Total: Rp ${totalPrice.toLocaleString("id-ID")}\n\n`;
      message += `Nama: ${validated.name}\n`;
      message += `Telepon: ${validated.phone}\n`;
      message += `Alamat: ${validated.address}\n\n`;
      message += "Terima kasih!";

      // WhatsApp number
      const phoneNumber = "6281455095274";
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");
      
      toast.success("Pesanan berhasil disimpan!");
      clearCart();
      setIsDialogOpen(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Gagal membuat pesanan: " + (error.message || "Terjadi kesalahan"));
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex-1">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Keranjang Belanja Kosong
            </h2>
            <p className="text-muted-foreground mb-8">
              Belum ada produk di keranjang Anda. Mulai belanja sekarang!
            </p>
            <Link to="/products">
              <Button size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Mulai Belanja
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6">
          <Link to="/products">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Lanjut Belanja
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-8">Keranjang Belanja</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                          </p>
                          <p className="text-xl font-bold text-primary">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Ringkasan Pesanan
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                    <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Ongkir</span>
                    <span className="text-secondary">GRATIS</span>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between text-xl font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">
                        Rp {totalPrice.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <Button 
                    className="w-full h-12 text-lg mb-3" 
                    size="lg"
                    onClick={handleCheckoutClick}
                  >
                    Checkout via WhatsApp
                  </Button>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Informasi Pembeli</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Masukkan nama Anda"
                          required
                          disabled={isCheckingOut}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="08xx xxxx xxxx"
                          required
                          disabled={isCheckingOut}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Textarea
                          id="address"
                          value={customerAddress}
                          onChange={(e) => setCustomerAddress(e.target.value)}
                          placeholder="Masukkan alamat lengkap pengiriman"
                          required
                          disabled={isCheckingOut}
                          rows={3}
                        />
                        <p className="text-xs text-muted-foreground">
                          Alamat dari profil Anda akan otomatis tersimpan. <Link to="/profile" className="text-primary hover:underline">Edit Profil</Link>
                        </p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isCheckingOut}>
                        {isCheckingOut ? "Memproses..." : "Lanjut ke WhatsApp"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    clearCart();
                    toast.success("Keranjang berhasil dikosongkan");
                  }}
                >
                  Kosongkan Keranjang
                </Button>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2">Informasi</h3>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Gratis ongkir Jabodetabek</li>
                    <li>• Estimasi 3-7 hari kerja</li>
                    <li>• Garansi 1 tahun</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;