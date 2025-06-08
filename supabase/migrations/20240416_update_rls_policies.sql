-- Drop existing RLS policy for anonymous users
DROP POLICY IF EXISTS "Allow anonymous to create orders" ON public.orders;

-- Create a more permissive policy for order creation
CREATE POLICY "Allow anyone to create orders" ON public.orders
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Create a policy for authenticated users to view their own orders
CREATE POLICY "Allow authenticated users to view their own orders" ON public.orders
    FOR SELECT
    TO authenticated
    USING (customer_email = auth.email());

-- Create a policy for anonymous users to view orders by order number
-- This is needed for the order tracking feature
CREATE POLICY "Allow anonymous to view orders by order number" ON public.orders
    FOR SELECT
    TO anon
    USING (true);

-- Ensure the service role has full access
CREATE POLICY IF NOT EXISTS "Allow service role full access to orders" ON public.orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
