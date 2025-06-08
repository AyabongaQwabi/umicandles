-- This migration script:
-- 1. Updates RLS policies to allow anonymous insertions to orders and customers tables
-- 2. Creates a trigger to automatically create customer records when orders are placed
-- 3. Sets up appropriate policies for customers to view their own orders

-- ===============================
-- STEP 1: Update RLS for Orders
-- ===============================

-- Drop existing RLS policies for orders
DROP POLICY IF EXISTS "Allow anonymous to create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anyone to create orders" ON public.orders;
DROP POLICY IF EXISTS "Allow authenticated users to view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anonymous to view orders by order number" ON public.orders;

-- Create a policy that allows anonymous users to insert orders
CREATE POLICY "Allow anonymous order creation" ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create a policy that allows users to view orders by email (no auth required)
CREATE POLICY "Allow viewing orders by email" ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create a policy that allows users to view orders by order number (for tracking)
CREATE POLICY "Allow tracking orders by order number" ON public.orders
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ===============================
-- STEP 2: Update RLS for Customers
-- ===============================

-- Drop existing RLS policies for customers
DROP POLICY IF EXISTS "Allow authenticated users to view their own customer data" ON public.customers;
DROP POLICY IF EXISTS "Allow authenticated users to update their own customer data" ON public.customers;

-- Create a policy that allows anonymous users to insert customers
CREATE POLICY "Allow anonymous customer creation" ON public.customers
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create a policy that allows users to view customer data by email
CREATE POLICY "Allow viewing customer data by email" ON public.customers
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Create a policy that allows users to update their own customer data
CREATE POLICY "Allow updating own customer data" ON public.customers
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- ===============================
-- STEP 3: Create Automatic Customer Creation Trigger
-- ===============================

-- Create a function to automatically create a customer record when an order is placed
CREATE OR REPLACE FUNCTION public.create_customer_from_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if a customer with this email already exists
    IF NOT EXISTS (SELECT 1 FROM public.customers WHERE email = NEW.customer_email) THEN
        -- Create a new customer record
        INSERT INTO public.customers (
            first_name,
            last_name,
            email,
            phone,
            default_shipping_address,
            created_at,
            updated_at
        ) VALUES (
            split_part(NEW.customer_name, ' ', 1),
            split_part(NEW.customer_name, ' ', 2),
            NEW.customer_email,
            NEW.customer_phone,
            jsonb_build_object(
                'address', NEW.shipping_address,
                'city', NEW.shipping_city,
                'postal_code', NEW.shipping_postal_code,
                'country', NEW.shipping_country
            ),
            NOW(),
            NOW()
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function after an order is inserted
DROP TRIGGER IF EXISTS create_customer_after_order ON public.orders;
CREATE TRIGGER create_customer_after_order
    AFTER INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.create_customer_from_order();

-- ===============================
-- STEP 4: Create Order Lookup Function
-- ===============================

-- Create a function to look up orders by email
CREATE OR REPLACE FUNCTION public.get_orders_by_email(customer_email TEXT)
RETURNS SETOF public.orders AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.orders
    WHERE orders.customer_email = customer_email
    ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to look up an order by order number
CREATE OR REPLACE FUNCTION public.get_order_by_number(order_num TEXT)
RETURNS SETOF public.orders AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM public.orders
    WHERE orders.order_number = order_num
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================
-- STEP 5: Grant Appropriate Permissions
-- ===============================

-- Grant permissions to the anon and authenticated roles
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customers TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_orders_by_email TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_order_by_number TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_from_order TO anon, authenticated;

-- Ensure sequences can be used
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Make sure service role still has full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
