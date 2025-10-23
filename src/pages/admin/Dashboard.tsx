import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, orders: 0 });

  useEffect(() => {
    const checkAdmin = async () => {
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
          toast.error("Anda tidak memiliki akses admin");
          navigate("/");
          return;
        }

        setIsAdmin(true);

        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        const { count: ordersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        setStats({
          products: productsCount || 0,
          orders: ordersCount || 0,
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Gagal memuat data");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout berhasil");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Total Produk
              </CardTitle>
              <CardDescription>Jumlah produk dalam database</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.products}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Total Pesanan
              </CardTitle>
              <CardDescription>Pesanan yang masuk</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.orders}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/admin/products">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Kelola Produk</CardTitle>
                <CardDescription>
                  Tambah, edit, atau hapus produk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buka Manajemen Produk</Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/orders">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Kelola Pesanan</CardTitle>
                <CardDescription>
                  Konfirmasi dan kelola pesanan masuk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Buka Manajemen Pesanan</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;