import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard = ({ id, name, price, image, category }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    const { data: product } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (product) {
      addToCart(product as any);
      toast.success("Produk berhasil ditambahkan ke keranjang!");
    }
  };
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <Link to={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-1">{category}</p>
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-primary mt-2">
          Rp {price.toLocaleString("id-ID")}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="secondary" onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Tambah ke Keranjang
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
