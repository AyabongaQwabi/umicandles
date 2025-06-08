-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT NOT NULL,
    shipping_country TEXT NOT NULL,
    items JSONB NOT NULL,
    event_booking JSONB,
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tracking_number TEXT,
    estimated_delivery TEXT,
    notes TEXT
);

-- Create index for faster order lookups
CREATE INDEX idx_orders_order_number ON public.orders(order_number);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX idx_orders_status ON public.orders(status);

-- Create products table (for future use)
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT,
    category TEXT,
    size TEXT,
    details JSONB,
    scent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create index for product lookups
CREATE INDEX idx_products_category ON public.products(category);

-- Create customers table (for future use)
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    default_shipping_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for customer lookups
CREATE INDEX idx_customers_email ON public.customers(email);

-- Create event_bookings table (for future use)
CREATE TABLE public.event_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id),
    date DATE NOT NULL,
    location TEXT NOT NULL,
    event_type TEXT NOT NULL,
    guest_count INTEGER NOT NULL,
    additional_info TEXT,
    price DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for event booking lookups
CREATE INDEX idx_event_bookings_date ON public.event_bookings(date);
CREATE INDEX idx_event_bookings_customer ON public.event_bookings(customer_id);

-- Set up Row Level Security (RLS)
-- Enable RLS on tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Allow anonymous to create orders" ON public.orders
    FOR INSERT TO anon
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view their own orders" ON public.orders
    FOR SELECT TO authenticated
    USING (customer_email = auth.email());

CREATE POLICY "Allow service role full access to orders" ON public.orders
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for products
CREATE POLICY "Allow anyone to view active products" ON public.products
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Allow service role full access to products" ON public.products
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for customers
CREATE POLICY "Allow authenticated users to view their own customer data" ON public.customers
    FOR SELECT TO authenticated
    USING (auth_id = auth.uid());

CREATE POLICY "Allow authenticated users to update their own customer data" ON public.customers
    FOR UPDATE TO authenticated
    USING (auth_id = auth.uid())
    WITH CHECK (auth_id = auth.uid());

CREATE POLICY "Allow service role full access to customers" ON public.customers
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Create policies for event_bookings
CREATE POLICY "Allow authenticated users to view their own event bookings" ON public.event_bookings
    FOR SELECT TO authenticated
    USING (customer_id IN (SELECT id FROM public.customers WHERE auth_id = auth.uid()));

CREATE POLICY "Allow service role full access to event_bookings" ON public.event_bookings
    FOR ALL TO service_role
    USING (true)
    WITH CHECK (true);

-- Grant appropriate permissions
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT ON public.event_bookings TO authenticated;

-- Grant all permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;
