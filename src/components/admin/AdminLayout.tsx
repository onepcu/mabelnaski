import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout berhasil");
    navigate("/");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/20">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger />
              <div className="flex-1">
                {title && <h1 className="text-2xl font-bold">{title}</h1>}
              </div>
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default AdminLayout;
