-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Tables (Co-working Tables/Rooms)
create table public.tables (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  image_url text, -- URL from storage
  rate_per_hour numeric not null default 0,
  capacity_min int default 1,
  capacity_max int default 4,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Members (End Users & Admin manually added)
create table public.members (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  phone text unique,
  email text,
  gender text check (gender in ('male', 'female', 'other')),
  wallet_balance numeric default 0,
  affiliate_code text unique, -- For affiliate system
  referred_by uuid references public.members(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Products (Food, Drinks, Services)
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null, -- 'food', 'drink', 'service'
  price numeric not null,
  image_url text,
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Sessions (The core tracking)
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  table_id uuid references public.tables(id),
  start_time timestamp with time zone default timezone('utc'::text, now()) not null,
  end_time timestamp with time zone,
  status text check (status in ('active', 'completed', 'cancelled')) default 'active',
  total_amount numeric default 0, -- Calculated at end
  payment_method text check (payment_method in ('cash', 'visa', 'wallet', 'pending')),
  payment_details jsonb, -- { card_holder_name: "...", wallet_number: "..." }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Session Members (Many-to-Many: Who is in this session)
create table public.session_members (
  session_id uuid references public.sessions(id) on delete cascade,
  member_id uuid references public.members(id),
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  left_at timestamp with time zone,
  primary key (session_id, member_id)
);

-- 6. Session Orders (Products ordered during session)
create table public.session_orders (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity int default 1,
  price_at_order numeric not null, -- In case product price changes later
  status text default 'pending', -- pending, delivered
  ordered_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Game Nights & Tournaments
create table public.game_nights (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  date timestamp with time zone not null,
  status text default 'scheduled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tournaments (
  id uuid default uuid_generate_v4() primary key,
  game_night_id uuid references public.game_nights(id) on delete cascade,
  game_name text not null,
  prizes_structure jsonb, -- e.g. { "1st": 1000, "2nd": 500 }
  winners jsonb, -- e.g. { "1st": member_id, "2nd": member_id }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.tournament_participants (
  tournament_id uuid references public.tournaments(id) on delete cascade,
  member_id uuid references public.members(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (tournament_id, member_id)
);

-- 8. Operations (Cleaning, Maintenance, Expenses)
create table public.cleaning_logs (
  id uuid default uuid_generate_v4() primary key,
  area text not null, -- 'bathroom', 'hall', etc.
  checked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('completed', 'missed')) default 'completed',
  staff_name text, -- If we track staff
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.expenses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  amount numeric not null,
  category text, -- 'maintenance', 'supplies', 'salary'
  is_request boolean default false, -- If true, needs admin approval (Requests module)
  request_status text default 'pending', -- pending, approved, rejected
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS) - Basic setup (Open for now for dev, restrict later)
alter table public.tables enable row level security;
alter table public.members enable row level security;
-- ... repeat for others or create policies
-- For development, we create a policy that allows all access
create policy "Public Access" on public.tables for all using (true);
create policy "Public Access" on public.members for all using (true);
create policy "Public Access" on public.products for all using (true);
create policy "Public Access" on public.sessions for all using (true);
create policy "Public Access" on public.session_members for all using (true);
create policy "Public Access" on public.session_orders for all using (true);
create policy "Public Access" on public.game_nights for all using (true);
create policy "Public Access" on public.tournaments for all using (true);
create policy "Public Access" on public.tournament_participants for all using (true);
create policy "Public Access" on public.cleaning_logs for all using (true);
create policy "Public Access" on public.expenses for all using (true);
