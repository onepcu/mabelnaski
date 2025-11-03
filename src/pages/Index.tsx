import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { ProductSkeleton } from "@/components/ProductSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, HeadphonesIcon } from "lucide-react";
import heroImage from "@/assets/hero-furniture.jpg";

const Index = () => {
  const { products, isLoading } = useProducts();
  // Featured products based on order count (trending)
  const featuredProducts = [...products]
    .sort((a, b) => (b.order_count || 0) - (a.order_count || 0))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Furniture Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in slide-in-from-bottom-4 duration-700">
              Koleksi Mebel Premium untuk Rumah Impian
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90 animate-in slide-in-from-bottom-5 duration-700">
              Temukan furnitur berkualitas tinggi dengan desain modern dan material pilihan. 
              Wujudkan rumah yang nyaman dan estetik.
            </p>
            <div className="flex flex-wrap gap-4 animate-in slide-in-from-bottom-6 duration-700">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">
                  Lihat Katalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                <Truck className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Gratis Ongkir</h3>
              <p className="text-muted-foreground">
                Pengiriman gratis untuk wilayah Jabodetabek
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Garansi Resmi</h3>
              <p className="text-muted-foreground">
                Garansi 1 tahun untuk semua produk
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10">
                <HeadphonesIcon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Customer Support</h3>
              <p className="text-muted-foreground">
                Tim kami siap membantu 24/7
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Produk Unggulan</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pilihan terbaik dari koleksi kami yang paling diminati
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isLoading ? (
              [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  category={product.category}
                />
              ))
            )}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button size="lg" variant="outline">
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Siap Mengubah Rumah Anda?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Konsultasikan kebutuhan mebel Anda dengan tim profesional kami
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary" className="h-12 px-8 text-lg">
              Konsultasi Gratis
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;