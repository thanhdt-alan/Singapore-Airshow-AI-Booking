-- ============================================================
-- 0. DỌN DẸP (Xóa bảng cũ nếu có để tạo lại từ đầu)
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS check_booking_conflict(uuid, timestamptz, timestamptz);
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.bookings;
DROP TABLE IF EXISTS public.profiles;

-- ============================================================
-- 1. CÀI ĐẶT EXTENSION
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- 2. BẢNG PROFILES (Lưu thông tin Attendee)
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  avatar_url text,
  company text,
  role_title text,
  attendee_type text check (attendee_type in ('buyer', 'seller', 'partner', 'government', 'OEM')),
  industries text[], 
  interests text[],
  intent text,
  preferred_meeting_duration integer default 30 check (preferred_meeting_duration in (15, 30)),
  meet_me_location text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 3. BẢNG BOOKINGS (Lịch hẹn)
-- ============================================================
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  from_id uuid references public.profiles(id) not null,
  to_id uuid references public.profiles(id) not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text default 'Requested' check (status in ('Requested', 'Accepted', 'Rejected', 'Reschedule Proposed', 'Cancelled')),
  notes text,
  location text,
  response_message text,
  alternative_slot text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 4. BẢNG MESSAGES (Chat P2P)
-- ============================================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references public.profiles(id) not null,
  receiver_id uuid references public.profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================================
-- 5. BẢO MẬT (ROW LEVEL SECURITY - RLS)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.messages enable row level security;

-- Policies cho PROFILES
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update own profile" 
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert with check (auth.uid() = id);

-- Policies cho BOOKINGS
create policy "View bookings involved in" 
  on public.bookings for select 
  using (auth.uid() = from_id or auth.uid() = to_id or (select is_admin from profiles where id = auth.uid()) = true);

create policy "Create booking" 
  on public.bookings for insert 
  with check (auth.uid() = from_id);

create policy "Update booking involved in" 
  on public.bookings for update 
  using (auth.uid() = from_id or auth.uid() = to_id);

-- ============================================================
-- 6. TRIGGER & FUNCTIONS (Logic tự động)
-- ============================================================

-- Trigger: Tự động tạo Profile rỗng khi User đăng ký Auth
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function: Kiểm tra trùng lịch
create or replace function check_booking_conflict(
  target_user_id uuid, 
  new_start timestamp with time zone, 
  new_end timestamp with time zone
) returns boolean as $$
declare
  conflict_count int;
begin
  select count(*) into conflict_count
  from public.bookings
  where (from_id = target_user_id or to_id = target_user_id)
    and status in ('Accepted', 'Requested')
    and (
      (start_time <= new_start and end_time > new_start) or
      (start_time < new_end and end_time >= new_end) or
      (start_time >= new_start and end_time <= new_end)
    );
  return conflict_count > 0;
end;
$$ language plpgsql;