import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Package, Ruler, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import { Product } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat produk");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product as any);
      toast.success("Produk berhasil ditambahkan ke keranjang!");
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product as any);
      navigate("/cart");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Produk tidak ditemukan</p>
          <div className="text-center mt-4">
            <Link to="/products">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Produk
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
        <Link to="/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Produk
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-foreground">{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Material</p>
                    <p className="text-sm text-muted-foreground">{product.material}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Ruler className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Dimensi</p>
                    <p className="text-sm text-muted-foreground">{product.dimensions}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Palette className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Warna</p>
                    <p className="text-sm text-muted-foreground">{product.color}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-start space-x-3">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground">Stok</p>
                    <p className="text-sm text-muted-foreground">
                      {product.stock > 0 ? `${product.stock} unit tersedia` : "Stok habis"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                className="w-full h-12 text-lg" 
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.stock > 0 ? "Tambah ke Keranjang" : "Stok Habis"}
              </Button>
              <Button 
                variant="secondary" 
                className="w-full h-12 text-lg" 
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Beli Sekarang
              </Button>
            </div>

            {/* Additional Info */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Informasi Pengiriman</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Gratis ongkir untuk area Jabodetabek</li>
                  <li>• Estimasi pengiriman 3-7 hari kerja</li>
                  <li>• Garansi 1 tahun untuk kerusakan produksi</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;