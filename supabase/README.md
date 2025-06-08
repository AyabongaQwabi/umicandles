# Supabase Setup for Umi Candles

This directory contains the Supabase migration files and setup instructions for the Umi Candles project.

## Getting Started

### Prerequisites

1. Install the Supabase CLI:
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. Login to Supabase:
   \`\`\`bash
   supabase login
   \`\`\`

### Setting Up Your Local Development Environment

1. Initialize Supabase in your project (if not already done):
   \`\`\`bash
   supabase init
   \`\`\`

2. Link your project to your Supabase instance:
   \`\`\`bash
   supabase link --project-ref your-project-ref
   \`\`\`

   You can find your project reference in the Supabase dashboard URL: `https://app.supabase.com/project/your-project-ref`

3. Start the local Supabase development environment:
   \`\`\`bash
   supabase start
   \`\`\`

### Running Migrations

To apply the migrations to your local development environment:

\`\`\`bash
supabase db reset
\`\`\`

This will apply all migrations in the `supabase/migrations` directory.

To apply migrations to your remote Supabase instance:

\`\`\`bash
supabase db push
\`\`\`

### Database Schema

The database schema includes the following tables:

1. **orders** - Stores customer orders
   - Contains order details, customer information, and shipping information
   - Includes JSON fields for items and event bookings

2. **products** - Stores product information
   - Contains product details, pricing, and categorization

3. **customers** - Stores customer information
   - Links to Supabase Auth for authentication

4. **event_bookings** - Stores event booking information
   - Links to customers for relationship management

### Row Level Security (RLS)

The migration sets up Row Level Security policies to ensure data security:

- Anonymous users can create orders but cannot view them
- Authenticated users can only view their own orders and customer data
- The service role has full access to all tables

### Seeding Data

You can use the `lib/supabase-setup.ts` file to seed your database with initial product data:

\`\`\`typescript
import { seedProducts } from '../lib/supabase-setup';

// Seed the products table
seedProducts().then(result => {
  console.log('Seeding result:', result);
});
\`\`\`

## Troubleshooting

If you encounter issues with the migrations:

1. Check the Supabase CLI logs:
   \`\`\`bash
   supabase logs
   \`\`\`

2. Verify your database schema:
   \`\`\`typescript
   import { verifyDatabaseSchema } from '../lib/supabase-setup';

   verifyDatabaseSchema().then(result => {
     console.log('Schema verification:', result);
   });
   \`\`\`

3. Reset your local database:
   \`\`\`bash
   supabase db reset
   \`\`\`

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli/introduction)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/managing-environments)
