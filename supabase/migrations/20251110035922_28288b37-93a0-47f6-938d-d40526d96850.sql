-- Allow kasir to create orders
CREATE POLICY "Kasir can create orders"
ON public.orders
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'kasir'::app_role));

-- Allow kasir to view orders
CREATE POLICY "Kasir can view orders"
ON public.orders
FOR SELECT
USING (has_role(auth.uid(), 'kasir'::app_role));

-- Create function to reduce product stock for cashier transactions
CREATE OR REPLACE FUNCTION public.process_cashier_transaction(
  p_items jsonb,
  p_total_price numeric,
  p_payment numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  item jsonb;
  v_product_stock integer;
  v_result jsonb;
BEGIN
  -- Check if payment is sufficient
  IF p_payment < p_total_price THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Pembayaran tidak cukup',
      'change', 0
    );
  END IF;

  -- Check stock availability and reduce stock for each item
  FOR item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Check current stock
    SELECT stock INTO v_product_stock
    FROM products
    WHERE id = (item->>'id')::uuid;

    IF v_product_stock < (item->>'quantity')::integer THEN
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Stok ' || (item->>'name')::text || ' tidak mencukupi',
        'change', 0
      );
    END IF;

    -- Reduce stock
    UPDATE products 
    SET stock = stock - (item->>'quantity')::integer
    WHERE id = (item->>'id')::uuid;
  END LOOP;

  -- Return success with change
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Transaksi berhasil',
    'change', p_payment - p_total_price
  );
END;
$$;