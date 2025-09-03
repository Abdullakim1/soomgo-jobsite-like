create or replace function public.create_tables_if_not_exists()
returns void
language plpgsql
as $$
begin
  -- Create instructor_rates table if not exists
  if not exists (select 1 from information_schema.tables where table_name = 'instructor_rates') then
    create table instructor_rates (
      id uuid primary key default uuid_generate_v4(),
      instructor_id uuid references profiles(id) on delete cascade,
      min_rate numeric not null,
      desired_rate numeric not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  end if;
  
  -- Create ratings table if not exists
  if not exists (select 1 from information_schema.tables where table_name = 'ratings') then
    create table ratings (
      id uuid primary key default uuid_generate_v4(),
      instructor_id uuid references profiles(id) on delete cascade,
      company_id uuid references profiles(id) on delete cascade,
      job_id uuid references jobs(id) on delete cascade,
      score numeric(2,1) check (score between 1 and 5),
      feedback text,
      created_at timestamptz not null default now()
    );
  end if;
  
  -- Add verification columns if not exists
  if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'verified') then
    alter table profiles add column verified boolean default false;
    alter table profiles add column verification_data jsonb;
  end if;
end;
$$;
