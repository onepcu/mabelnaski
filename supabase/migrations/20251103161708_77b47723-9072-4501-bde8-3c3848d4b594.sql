-- Add images array column to products table (empty by default)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS images text[];

-- Populate images array with existing image for all products
UPDATE products 
SET images = ARRAY[image]
WHERE images IS NULL;

-- Add order_count column for tracking product popularity
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS order_count integer DEFAULT 0;

-- Create function to update product order count
CREATE OR REPLACE FUNCTION update_product_order_count()
RETURNS TRIGGER AS $$
DECLARE
  item jsonb;
BEGIN
  -- Loop through items in the order
  FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
  LOOP
    -- Increment order_count for each product
    UPDATE products 
    SET order_count = order_count + (item->>'quantity')::integer
    WHERE id = (item->>'id')::uuid;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically update order counts
DROP TRIGGER IF EXISTS update_order_count_trigger ON orders;
CREATE TRIGGER update_order_count_trigger
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_product_order_count();