import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Keranjang belanja kosong!");
      return;
    }

    // Format pesan WhatsApp
    let message = "Halo, saya ingin memesan:\n\n";
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Jumlah: ${item.quantity}\n`;
      message += `   Harga: Rp ${(item.price * item.quantity).toLocaleString("id-ID")}\n\n`;
    });

    message += `Total: Rp ${totalPrice.toLocaleString("id-ID")}\n\n`;
    message += "Terima kasih!";

    // Nomor WhatsApp Alam (ganti dengan nomor yang benar)
    // Format: 62 untuk Indonesia, hilangkan angka 0 di depan
    const phoneNumber = "6281234567890"; // Ganti dengan nomor WhatsApp Alam
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Buka WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Optional: Clear cart setelah checkout
    toast.success("Mengarahkan ke WhatsApp...");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
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

                <Button 
                  className="w-full h-12 text-lg mb-3" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Checkout via WhatsApp
                </Button>

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
    </div>
  );
};

export default Cart;
