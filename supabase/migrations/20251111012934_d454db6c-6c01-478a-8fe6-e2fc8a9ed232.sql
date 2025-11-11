-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC NOT NULL CHECK (discount_value > 0),
  min_purchase NUMERIC DEFAULT 0,
  applicable_products UUID[] DEFAULT NULL,
  max_uses INTEGER DEFAULT NULL,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

CREATE POLICY "Only admins can insert coupons"
ON public.coupons
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update coupons"
ON public.coupons
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete coupons"
ON public.coupons
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to validate and apply coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code TEXT,
  p_total_price NUMERIC,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_discount NUMERIC := 0;
  v_item JSONB;
  v_applicable BOOLEAN := false;
BEGIN
  -- Get coupon details
  SELECT * INTO v_coupon
  FROM coupons
  WHERE code = p_code
    AND is_active = true
    AND valid_from <= now()
    AND (valid_until IS NULL OR valid_until >= now())
    AND (max_uses IS NULL OR used_count < max_uses);

  -- Check if coupon exists
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'message', 'Kode kupon tidak valid atau sudah kadaluarsa',
      'discount', 0
    );
  END IF;

  -- Check minimum purchase
  IF v_coupon.min_purchase > 0 AND p_total_price < v_coupon.min_purchase THEN
    RETURN jsonb_build_object(
      'valid', false,
      'message', 'Minimum belanja Rp ' || v_coupon.min_purchase || ' untuk menggunakan kupon ini',
      'discount', 0
    );
  END IF;

  -- Check if coupon applies to specific products
  IF v_coupon.applicable_products IS NOT NULL THEN
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
      IF (v_item->>'id')::uuid = ANY(v_coupon.applicable_products) THEN
        v_applicable := true;
        EXIT;
      END IF;
    END LOOP;

    IF NOT v_applicable THEN
      RETURN jsonb_build_object(
        'valid', false,
        'message', 'Kupon ini tidak berlaku untuk produk yang dipilih',
        'discount', 0
      );
    END IF;
  END IF;

  -- Calculate discount
  IF v_coupon.discount_type = 'percentage' THEN
    v_discount := (p_total_price * v_coupon.discount_value / 100);
    -- Cap at 100% discount
    IF v_discount > p_total_price THEN
      v_discount := p_total_price;
    END IF;
  ELSE
    v_discount := v_coupon.discount_value;
    -- Cap discount to total price
    IF v_discount > p_total_price THEN
      v_discount := p_total_price;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'message', 'Kupon berhasil diterapkan',
    'discount', v_discount,
    'coupon_id', v_coupon.id
  );
END;
$$;

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION public.use_coupon(p_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE code = p_code;
END;
$$;