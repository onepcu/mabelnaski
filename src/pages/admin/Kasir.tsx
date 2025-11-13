import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Minus, Plus, Trash2, Tag, LogOut, ChevronLeft, ChevronRight, History, Printer, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Receipt from "@/components/admin/Receipt";


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
  const { categories } = useCategories();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; couponId: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    checkAccess();
    loadTodayTransactions();
  }, []);

  const loadTodayTransactions = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "completed")
      .gte("created_at", today.toISOString())
      .order("created_at", { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Error",
        description: "Masukkan kode kupon",
        variant: "destructive",
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const { data, error } = await supabase.rpc("validate_coupon", {
        p_code: couponCode.toUpperCase(),
        p_total_price: totalPrice,
        p_items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        }))
      });

      if (error) throw error;

      const result = data as { valid: boolean; message: string; discount: number; coupon_id?: string };

      if (result.valid) {
        setAppliedCoupon({
          code: couponCode.toUpperCase(),
          discount: result.discount,
          couponId: result.coupon_id || ""
        });
        toast({
          title: "Berhasil",
          description: result.message,
        });
      } else {
        toast({
          title: "Gagal",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memvalidasi kupon: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast({
      title: "Berhasil",
      description: "Kupon berhasil dihapus",
    });
  };

  const finalTotal = appliedCoupon ? totalPrice - appliedCoupon.discount : totalPrice;

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

    if (paymentAmount < finalTotal) {
      toast({
        title: "Pembayaran Kurang",
        description: "Jumlah pembayaran kurang dari total",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const { data, error } = await supabase.rpc("process_cashier_transaction", {
        p_items: cart as any,
        p_total_price: finalTotal,
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

      if (appliedCoupon) {
        await supabase.rpc("use_coupon", { p_code: appliedCoupon.code });
      }

      const { error: orderError } = await supabase.from("orders").insert({
        items: cart as any,
        total_price: finalTotal,
        status: "completed",
        customer_name: "Kasir (Offline)",
        customer_phone: "-",
      });

      if (orderError) throw orderError;

      // Store last transaction for receipt
      setLastTransaction({
        orderNumber: `TRX${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleString("id-ID"),
        items: cart,
        subtotal: totalPrice,
        discount: appliedCoupon?.discount || 0,
        total: finalTotal,
        payment: paymentAmount,
        change: result.change,
        couponCode: appliedCoupon?.code,
      });

      // Show receipt dialog
      setShowReceiptDialog(true);

      // Reload transactions
      loadTodayTransactions();

      setCart([]);
      setPayment("");
      setAppliedCoupon(null);
      setCouponCode("");
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

  const addNumberToPayment = (num: string) => {
    setPayment(prev => prev + num);
  };

  const clearPayment = () => {
    setPayment("");
  };

  const backspacePayment = () => {
    setPayment(prev => prev.slice(0, -1));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-lg">
        <h1 className="text-lg md:text-2xl font-bold">Sistem Kasir</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => setShowHistoryDialog(true)}>
            <History className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Riwayat</span>
          </Button>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Keluar</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side - Cart & Calculator */}
        <div className="w-full md:w-1/2 border-r border-border flex flex-col">
          {/* Cart */}
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4 max-h-[40vh] md:max-h-[50vh]">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-4">Keranjang Belanja</h2>
            
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Keranjang kosong
              </p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{item.name}</h4>
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
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Calculator & Payment */}
          <div className="flex-shrink-0 border-t border-border p-3 md:p-4 space-y-2 md:space-y-3 bg-muted/30 overflow-y-auto max-h-[60vh] md:max-h-[50vh]">
            {/* Coupon */}
            <div className="space-y-2">
              {!appliedCoupon ? (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Kode kupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="pl-9"
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !couponCode.trim()}
                  >
                    Pakai
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <div>
                      <p className="font-semibold text-sm">{appliedCoupon.code}</p>
                      <p className="text-xs text-primary">
                        -Rp {appliedCoupon.discount.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveCoupon}
                    className="text-destructive hover:text-destructive"
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-semibold">Rp {totalPrice.toLocaleString("id-ID")}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-primary">
                  <span>Diskon:</span>
                  <span className="font-semibold">-Rp {appliedCoupon.discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-1">
                <span>Total:</span>
                <span className="text-primary">Rp {finalTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Payment Input */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Pembayaran</label>
              <Input
                type="text"
                value={payment ? `Rp ${parseFloat(payment).toLocaleString("id-ID")}` : ""}
                readOnly
                placeholder="Rp 0"
                className="text-xl font-bold text-center"
              />
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-1 md:gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => addNumberToPayment(num.toString())}
                  className="h-10 text-base font-semibold"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={backspacePayment}
                className="h-10 text-base font-semibold"
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addNumberToPayment("0")}
                className="h-10 text-base font-semibold"
              >
                0
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearPayment}
                className="h-10 text-base font-semibold"
              >
                C
              </Button>
            </div>

            {/* Change Display */}
            {payment && parseFloat(payment) >= finalTotal && (
              <div className="text-center p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Kembalian</p>
                <p className="text-lg font-bold text-primary">
                  Rp {(parseFloat(payment) - finalTotal).toLocaleString("id-ID")}
                </p>
              </div>
            )}

            {/* Process Button */}
            <Button
              size="lg"
              onClick={handleProcessTransaction}
              disabled={isProcessing || cart.length === 0}
              className="w-full h-12 text-base font-semibold"
            >
              {isProcessing ? "Memproses..." : "Proses Transaksi"}
            </Button>
          </div>
        </div>

        {/* Right Side - Products */}
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="p-3 md:p-4 border-b border-border space-y-2 md:space-y-3">
            <Input
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-sm"
            />
            <div className="flex flex-wrap gap-1 md:gap-2 overflow-x-auto">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="transition-all"
              >
                Semua Kategori
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category.name);
                    setCurrentPage(1);
                  }}
                  className="transition-all"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 md:p-4">
            {isLoading ? (
              <p className="text-center text-muted-foreground">Memuat produk...</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                  {paginatedProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded"
                      />
                      <div className="w-full">
                        <h3 className="font-semibold line-clamp-1 text-sm">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Stok: {product.stock}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium">
                      {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto print:shadow-none">
          <DialogHeader className="print:hidden">
            <DialogTitle>Transaksi Berhasil!</DialogTitle>
          </DialogHeader>
          
          {lastTransaction && (
            <>
              <Receipt {...lastTransaction} />
              
              <div className="flex gap-2 mt-4 print:hidden">
                <Button
                  onClick={handlePrintReceipt}
                  className="flex-1"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Nota
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowReceiptDialog(false)}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Tutup
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Riwayat Transaksi Hari Ini</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Belum ada transaksi hari ini
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">
                        {transaction.customer_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="font-bold text-primary">
                      Rp {transaction.total_price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {transaction.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-muted-foreground">
                        <span>{item.name} x{item.quantity}</span>
                        <span>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container,
          .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}
