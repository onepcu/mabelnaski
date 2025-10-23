-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create products table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    material TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    color TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products policies - everyone can view, only admins can modify
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Only admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    whatsapp_sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    confirmed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Only admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating products updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products data
INSERT INTO public.products (name, price, image, category, description, material, dimensions, color, stock) VALUES
('Meja Makan Minimalis Jati', 4500000, '/src/assets/product-table.jpg', 'Meja Makan', 'Meja makan minimalis dengan desain modern terbuat dari kayu jati pilihan. Cocok untuk ruang makan keluarga dengan kapasitas 6 orang. Finishing natural yang menampilkan keindahan serat kayu alami.', 'Kayu Jati Solid', '180cm x 90cm x 75cm', 'Natural Wood', 8),
('Sofa Modern 3 Seater', 6800000, '/src/assets/product-sofa.jpg', 'Sofa', 'Sofa modern dengan bahan fabric premium yang nyaman dan tahan lama. Desain minimalis cocok untuk ruang tamu modern. Dilengkapi dengan bantal cushion yang empuk.', 'Fabric Premium & Kayu Mahoni', '200cm x 85cm x 80cm', 'Beige', 5),
('Rak Buku Skandinavia', 3200000, '/src/assets/product-bookshelf.jpg', 'Rak & Storage', 'Rak buku dengan desain Skandinavia yang fungsional dan estetik. Lima tingkat penyimpanan yang luas untuk koleksi buku dan dekorasi Anda. Material kayu berkualitas dengan finishing natural.', 'Kayu Oak & MDF', '120cm x 40cm x 180cm', 'Natural Oak', 12),
('Kursi Santai Arm Chair', 2400000, '/src/assets/product-chair.jpg', 'Kursi', 'Kursi santai dengan desain ergonomis yang nyaman untuk bersantai. Bahan fabric lembut dengan warna hijau yang menenangkan. Cocok untuk sudut baca atau ruang keluarga.', 'Fabric & Kayu Solid', '75cm x 80cm x 85cm', 'Forest Green', 15),
('Tempat Tidur Queen Size', 5500000, '/src/assets/product-bed.jpg', 'Tempat Tidur', 'Tempat tidur queen size dengan frame kayu solid yang kokoh. Desain headboard minimalis yang elegan. Sudah termasuk divan penyimpanan di bagian bawah.', 'Kayu Jati & MDF', '160cm x 200cm x 120cm', 'Walnut Brown', 6),
('Lemari Pakaian 3 Pintu', 7200000, '/src/assets/product-wardrobe.jpg', 'Lemari', 'Lemari pakaian besar dengan 3 pintu dan cermin di tengah. Ruang penyimpanan yang luas dengan gantungan baju dan rak. Material kayu berkualitas tinggi dengan finishing glossy.', 'Kayu Mahoni & Kaca', '180cm x 60cm x 200cm', 'Dark Brown', 4);