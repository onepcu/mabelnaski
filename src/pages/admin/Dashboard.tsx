import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, FolderTree, TrendingUp, Award } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ 
    products: 0, 
    orders: 0, 
    categories: 0,
    todaySales: 0,
    topProduct: { name: "", count: 0 }
  });

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

        const { count: categoriesCount } = await supabase
          .from("categories")
          .select("*", { count: "exact", head: true });

        // Get today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data: todayOrders } = await supabase
          .from("orders")
          .select("total_price")
          .gte("created_at", today.toISOString());

        const todaySales = todayOrders?.reduce((sum, order) => sum + Number(order.total_price), 0) || 0;

        // Get top selling product
        const { data: topProductData } = await supabase
          .from("products")
          .select("name, order_count")
          .order("order_count", { ascending: false })
          .limit(1)
          .single();

        setStats({
          products: productsCount || 0,
          orders: ordersCount || 0,
          categories: categoriesCount || 0,
          todaySales,
          topProduct: topProductData ? { name: topProductData.name, count: topProductData.order_count } : { name: "-", count: 0 }
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
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <FolderTree className="h-5 w-5" />
                Total Kategori
              </CardTitle>
              <CardDescription>Jumlah kategori produk</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{stats.categories}</p>
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

          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Penjualan Hari Ini
              </CardTitle>
              <CardDescription>Total penjualan hari ini</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">Rp {stats.todaySales.toLocaleString("id-ID")}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Produk Terlaris
              </CardTitle>
              <CardDescription>Item terjual terbanyak</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.topProduct.name}</p>
              <p className="text-muted-foreground mt-1">{stats.topProduct.count} terjual</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;