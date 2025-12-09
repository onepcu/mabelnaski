-- Create site_settings table for website configuration
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  site_name text NOT NULL DEFAULT 'MebelKu',
  site_description text DEFAULT 'Toko Furniture Modern',
  logo_url text,
  
  -- Contact Info
  whatsapp_number text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  
  -- Social Media
  instagram_url text DEFAULT '',
  facebook_url text DEFAULT '',
  tiktok_url text DEFAULT '',
  
  -- Theme Settings
  primary_color text DEFAULT '142 70% 45%',
  secondary_color text DEFAULT '142 40% 90%',
  accent_color text DEFAULT '142 60% 55%',
  theme_mode text DEFAULT 'light' CHECK (theme_mode IN ('light', 'dark', 'system')),
  
  -- Page Content
  hero_title text DEFAULT 'Selamat Datang',
  hero_subtitle text DEFAULT 'Temukan Produk Berkualitas',
  about_content text DEFAULT '',
  footer_text text DEFAULT '',
  
  -- Metadata
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view site settings (needed for frontend)
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- Only super_admin can update site settings
CREATE POLICY "Only super_admin can update site settings" 
ON public.site_settings 
FOR UPDATE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Only super_admin can insert site settings
CREATE POLICY "Only super_admin can insert site settings" 
ON public.site_settings 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

-- Only super_admin can delete site settings
CREATE POLICY "Only super_admin can delete site settings" 
ON public.site_settings 
FOR DELETE 
USING (has_role(auth.uid(), 'super_admin'::app_role));

-- Insert default settings
INSERT INTO public.site_settings (site_name, site_description) 
VALUES ('MebelKu', 'Toko Furniture Berkualitas');

-- Add trigger for updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update user_roles policies to allow super_admin to manage all roles
DROP POLICY IF EXISTS "Only admins can manage roles" ON public.user_roles;

CREATE POLICY "Super admin can manage all roles" 
ON public.user_roles 
FOR ALL 
USING (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admin can view roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));