# MediTrack

MediTrack is a clinic management system. The frontend is built with React and TypeScript using Vite and signs users in through Supabase Auth. Doctor accounts are managed through Supabase; patient, appointment, clinical-record, and activity data remain empty previews.

## Run the frontend

```powershell
cd frontend
npm install
npm run dev
```

Create a production build with `npm run build` from the `frontend` directory.

## Project layout

```text
frontend/
  src/
    app/                         Application composition and entry points
    assets/                      Images, icons, and fonts
    components/shared/           Reusable interface components
    config/                      Frontend configuration
    layouts/                     Shared page layout boundaries
    navigation/                  Navigation definitions
    modules/
      authentication/            Authentication and authorization UI boundary
      admin/                     Admin-facing module boundary
      doctors/                   Doctor-facing module boundary
      patients/                  Patient management module boundary
      doctor-roles-permissions/  Doctor role and permission module boundary
      clinical-records/          Clinical record module boundary
      dashboard/                 Dashboard module boundary
    services/api/                Frontend API integration boundary
    utils/                       Frontend utilities and helpers
backend/
  src/
    api/routes/                  API route organization
    config/                      Backend configuration boundary
    database/                    Database connection/configuration boundary
    middleware/                  Shared request middleware boundary
    modules/
      authentication/
      admin-management/
      doctor-management/
      patient-management/
      doctor-roles-permissions/
      clinical-records/
      dashboard/
    services/                    Cross-module backend services
    utils/                       Backend utilities and helpers
database/
  migrations/                    Supabase SQL migrations
  schema/                        Future database schema definitions
```

## Supabase database

The initial schema is in `database/migrations/20261126220000_initial_schema.sql`.
It creates staff profiles (linked to Supabase Auth), doctors, patients, and
clinical records. Row-level security lets admins manage all records and doctors
access only patients assigned to them. New Auth users receive a `staff` profile
by default; roles must be assigned by an administrator.

To set it up:

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. In the project dashboard, open **SQL Editor**, paste the contents of the
   migration file, and run it.
3. Create your first user under **Authentication → Users**.
4. In the SQL Editor, promote that account to admin, replacing the email:

   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'admin@yourclinic.com';
   ```

The sign-in screen uses Supabase Auth. Do not expose a Supabase service-role key
in the frontend; browser access uses the publishable key and relies on database
row-level security policies.

The frontend environment file is `frontend/.env`. Fill in `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings. The
committed `frontend/.env.example` is a template; `.env` files are ignored by Git.

To enable admin-managed doctor accounts, link this repository to your Supabase
project with the Supabase CLI, replacing `your-project-ref` with the project
reference from the Supabase dashboard, then deploy the protected Edge Functions:

```powershell
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy create-doctor
supabase functions deploy complete-password-change
```

The admin creates doctor accounts from **Admin → Doctors**. Name, specialty,
and email are stored in `profiles` and `doctors`. The temporary password is
handled only by Supabase Auth, shown once after creation, and required to be
changed at the doctor's first sign-in. Passwords are never stored in or shown
in the doctor directory. The Edge Functions use Supabase's server-side
`SUPABASE_SERVICE_ROLE_KEY`; never add that key to `frontend/.env` or any
`VITE_` variable.

## Organization notes

- Frontend and backend module boundaries are separate so their implementations can evolve independently.
- Shared frontend components, layouts, navigation, configuration, and utilities have dedicated locations.
- Database assets are kept outside the backend source tree so schema evolution remains explicit.
- The frontend provides read-only demo pages for the empty patient, appointment, clinical-record, and activity sections. The admin doctor directory is connected to Supabase:

- Admin: `/admin`, `/admin/patients`, `/admin/doctors`, `/admin/appointments`,
  `/admin/records`, and `/admin/access`.
- Doctor: `/doctor`, `/doctor/appointments`, `/doctor/patients`, and
  `/doctor/records`.

The admin and doctor workspaces require an authenticated account with the
matching role. Patient, appointment, clinical-record, and activity pages still
show empty preview data and are not connected to live clinic data.
