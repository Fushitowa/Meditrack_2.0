-- Add database-level validation and document the purpose of core tables.

alter table public.profiles
  add constraint profiles_email_not_blank
  check (char_length(btrim(email)) > 0);

alter table public.doctors
  add constraint doctors_specialty_not_blank
  check (specialty is null or char_length(btrim(specialty)) > 0),
  add constraint doctors_license_number_not_blank
  check (license_number is null or char_length(btrim(license_number)) > 0);

alter table public.patients
  add constraint patients_patient_number_not_blank
  check (char_length(btrim(patient_number)) > 0),
  add constraint patients_first_name_not_blank
  check (char_length(btrim(first_name)) > 0),
  add constraint patients_last_name_not_blank
  check (char_length(btrim(last_name)) > 0);

alter table public.clinical_records
  add constraint clinical_records_record_type_not_blank
  check (char_length(btrim(record_type)) > 0);

-- Preserve the saved name when an Auth metadata update omits full_name.
create or replace function public.handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles as existing_profile (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = case
          when new.raw_user_meta_data ? 'full_name' then excluded.full_name
          else existing_profile.full_name
        end;

  return new;
end;
$$;

comment on table public.profiles is
  'Application identity and authorization data linked to Supabase Auth. Passwords are managed by Supabase Auth, never stored here.';
comment on column public.profiles.role is
  'Application role used by database authorization policies.';
comment on table public.doctors is
  'Doctor-specific professional details linked to an application profile.';
comment on table public.patients is
  'Patient demographic and contact details, with optional assignment to a doctor.';
comment on table public.clinical_records is
  'Clinical notes and treatment details linked to a patient and authoring doctor.';
