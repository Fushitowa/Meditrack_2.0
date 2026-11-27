# MediTrack

MediTrack is a clinic management system. The frontend is built with React and TypeScript using Vite. It currently opens to an admin dashboard preview; patient, doctor, appointment, clinical-record, and activity data are empty until planned. Authentication and dashboard data are not yet connected to Supabase.

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

The frontend sign-in screen is not yet connected to Supabase. Do not expose a
Supabase service-role key in the frontend; client access must use the publishable
key and rely on the database row-level security policies.

The frontend environment file is `frontend/.env`. Fill in `VITE_SUPABASE_URL`
and `VITE_SUPABASE_ANON_KEY` from your Supabase project's API settings. The
committed `frontend/.env.example` is a template; `.env` files are ignored by Git.

## Organization notes

- Frontend and backend module boundaries are separate so their implementations can evolve independently.
- Shared frontend components, layouts, navigation, configuration, and utilities have dedicated locations.
- Database assets are kept outside the backend source tree so schema evolution remains explicit.
- The frontend provides read-only demo pages. Patient, doctor, appointment, clinical-record, and activity sections currently show empty states:

- Admin: `/admin`, `/admin/patients`, `/admin/doctors`, `/admin/appointments`,
  `/admin/records`, and `/admin/access`.
- Doctor: `/doctor`, `/doctor/appointments`, `/doctor/patients`, and
  `/doctor/records`.

The list pages support local search and status filtering. These routes are not
protected by authentication and must not be used for real patient data until
Supabase integration and server-enforced role authorization are implemented.
