import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserWithRole {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string | null;
  created_at: string;
}

export const useUsers = () => {
  return useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      // First get all user roles (super_admin can see all via RLS)
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) throw rolesError;

      // Get all profiles (super_admin can see all via RLS)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) throw profilesError;

      // Combine data - use user_roles as base since that's what we need
      const usersWithRoles: UserWithRole[] = [];
      
      // Add users with roles
      roles.forEach((role) => {
        const profile = profiles.find((p) => p.user_id === role.user_id);
        usersWithRoles.push({
          id: role.user_id,
          email: role.user_id, // Will show user_id since we can't access auth.users
          full_name: profile?.full_name || null,
          phone: profile?.phone || null,
          role: role.role,
          created_at: role.created_at || new Date().toISOString(),
        });
      });

      // Add users without roles (from profiles)
      profiles.forEach((profile) => {
        if (!roles.find((r) => r.user_id === profile.user_id)) {
          usersWithRoles.push({
            id: profile.user_id,
            email: profile.user_id,
            full_name: profile.full_name,
            phone: profile.phone,
            role: "user",
            created_at: profile.created_at,
          });
        }
      });

      return usersWithRoles;
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string;
      role: "admin" | "user" | "kasir" | "super_admin";
    }) => {
      // Check if role exists
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from("user_roles")
          .update({ role })
          .eq("user_id", userId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Role pengguna berhasil diperbarui");
    },
    onError: (error: Error) => {
      toast.error("Gagal memperbarui role: " + error.message);
    },
  });
};

export const useDeleteUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-with-roles"] });
      toast.success("Role pengguna berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error("Gagal menghapus role: " + error.message);
    },
  });
};