create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('admin', 'doctor', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.doctors (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  specialty text,
  license_number text unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  patient_number text not null unique,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  sex text check (sex in ('female', 'male', 'intersex', 'unknown')),
  phone text,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  assigned_doctor_id uuid references public.doctors (profile_id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients (id) on delete cascade,
  doctor_id uuid not null references public.doctors (profile_id) on delete restrict,
  visit_date timestamptz not null default now(),
  record_type text not null,
  diagnosis text,
  notes text,
  treatment_plan text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index patients_assigned_doctor_id_idx on public.patients (assigned_doctor_id);
create index clinical_records_patient_visit_idx
  on public.clinical_records (patient_id, visit_date desc);
create index clinical_records_doctor_id_idx on public.clinical_records (doctor_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger doctors_set_updated_at
before update on public.doctors
for each row execute function public.set_updated_at();

create trigger patients_set_updated_at
before update on public.patients
for each row execute function public.set_updated_at();

create trigger clinical_records_set_updated_at
before update on public.clinical_records
for each row execute function public.set_updated_at();

create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

create or replace function public.can_access_patient(target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.patients
      where id = target_patient_id
        and assigned_doctor_id = (select auth.uid())
    );
$$;

revoke all on function public.is_admin() from public;
revoke all on function public.can_access_patient(uuid) from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.can_access_patient(uuid) to authenticated;

alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.patients enable row level security;
alter table public.clinical_records enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_admin()));

create policy "Admins can manage profiles"
on public.profiles for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Doctors can read their own doctor profile"
on public.doctors for select to authenticated
using (profile_id = (select auth.uid()));

create policy "Admins can manage doctor profiles"
on public.doctors for all to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins and assigned doctors can read patients"
on public.patients for select to authenticated
using ((select public.can_access_patient(id)));

create policy "Admins and assigned doctors can add patients"
on public.patients for insert to authenticated
with check (
  (select public.is_admin())
  or assigned_doctor_id = (select auth.uid())
);

create policy "Admins and assigned doctors can update patients"
on public.patients for update to authenticated
using ((select public.can_access_patient(id)))
with check (
  (select public.is_admin())
  or assigned_doctor_id = (select auth.uid())
);

create policy "Admins can delete patients"
on public.patients for delete to authenticated
using ((select public.is_admin()));

create policy "Admins and assigned doctors can read clinical records"
on public.clinical_records for select to authenticated
using ((select public.can_access_patient(patient_id)));

create policy "Admins and assigned doctors can add clinical records"
on public.clinical_records for insert to authenticated
with check (
  (select public.is_admin())
  or (
    doctor_id = (select auth.uid())
    and (select public.can_access_patient(patient_id))
  )
);

create policy "Admins and record doctors can update clinical records"
on public.clinical_records for update to authenticated
using (
  (select public.is_admin())
  or (
    doctor_id = (select auth.uid())
    and (select public.can_access_patient(patient_id))
  )
)
with check (
  (select public.is_admin())
  or (
    doctor_id = (select auth.uid())
    and (select public.can_access_patient(patient_id))
  )
);

create policy "Admins can delete clinical records"
on public.clinical_records for delete to authenticated
using ((select public.is_admin()));
