export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          applicable_products: string[] | null
          code: string
          created_at: string
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          min_purchase: number | null
          updated_at: string
          used_count: number
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          applicable_products?: string[] | null
          code: string
          created_at?: string
          discount_type: string
          discount_value: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_purchase?: number | null
          updated_at?: string
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          applicable_products?: string[] | null
          code?: string
          created_at?: string
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          min_purchase?: number | null
          updated_at?: string
          used_count?: number
          valid_from?: string
          valid_until?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          customer_name: string
          customer_phone: string
          id: string
          items: Json
          status: string
          total_price: number
          whatsapp_sent_at: string | null
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          customer_name: string
          customer_phone: string
          id?: string
          items: Json
          status?: string
          total_price: number
          whatsapp_sent_at?: string | null
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          customer_name?: string
          customer_phone?: string
          id?: string
          items?: Json
          status?: string
          total_price?: number
          whatsapp_sent_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          color: string
          created_at: string | null
          description: string
          dimensions: string
          id: string
          image: string
          images: string[] | null
          material: string
          name: string
          order_count: number | null
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          category: string
          color: string
          created_at?: string | null
          description: string
          dimensions: string
          id?: string
          image: string
          images?: string[] | null
          material: string
          name: string
          order_count?: number | null
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          color?: string
          created_at?: string | null
          description?: string
          dimensions?: string
          id?: string
          image?: string
          images?: string[] | null
          material?: string
          name?: string
          order_count?: number | null
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_content: string | null
          accent_color: string | null
          address: string | null
          created_at: string
          email: string | null
          facebook_url: string | null
          footer_text: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          site_description: string | null
          site_name: string
          theme_mode: string | null
          tiktok_url: string | null
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          about_content?: string | null
          accent_color?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          footer_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description?: string | null
          site_name?: string
          theme_mode?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          about_content?: string | null
          accent_color?: string | null
          address?: string | null
          created_at?: string
          email?: string | null
          facebook_url?: string | null
          footer_text?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description?: string | null
          site_name?: string
          theme_mode?: string | null
          tiktok_url?: string | null
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_cashier_transaction: {
        Args: { p_items: Json; p_payment: number; p_total_price: number }
        Returns: Json
      }
      use_coupon: { Args: { p_code: string }; Returns: undefined }
      validate_coupon: {
        Args: { p_code: string; p_items: Json; p_total_price: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user" | "kasir" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "kasir", "super_admin"],
    },
  },
} as const
