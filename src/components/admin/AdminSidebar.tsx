import { useState, useEffect } from "react";
import { Home, Package, FolderTree, ShoppingCart, CreditCard, Tag, Settings, Users, Crown } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";

const adminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Kelola Produk", url: "/admin/products", icon: Package },
  { title: "Kelola Kategori", url: "/admin/categories", icon: FolderTree },
  { title: "Kelola Pesanan", url: "/admin/orders", icon: ShoppingCart },
  { title: "Kelola Kupon", url: "/admin/coupons", icon: Tag },
  { title: "Kasir", url: "/admin/kasir", icon: CreditCard },
];

const superAdminMenuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: Home },
  { title: "Pengaturan Website", url: "/admin/settings", icon: Settings },
  { title: "Manajemen User", url: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setUserRole(data?.role || null);
      }
    };

    checkRole();
  }, []);

  const isSuperAdmin = userRole === "super_admin";
  const menuItems = isSuperAdmin ? superAdminMenuItems : adminMenuItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            {isSuperAdmin && <Crown className="h-3 w-3" />}
            {isSuperAdmin ? "Super Admin" : "Menu Admin"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}