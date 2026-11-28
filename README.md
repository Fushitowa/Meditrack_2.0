# MediTrack

MediTrack is the clinic management project I am building to bring patient, doctor, and clinical information into one organized workspace. It uses separate views for administrators and doctors, with account authentication and database permissions handled through Supabase.

The interface is currently strongest in the admin and doctor areas, especially account sign-in and doctor management. Patient, appointment, clinical-record, and activity sections are also included, but several of those pages are still preview experiences rather than fully connected clinic workflows.

## What is included

### For administrators

- Sign in with a Supabase account
- View the admin dashboard
- Create doctor accounts
- Assign a doctor name and specialty
- Open patient, appointment, record, and access-management sections
- Manage role-based access

When I create a doctor account, MediTrack stores the doctor's name and specialty in Supabase, generates the account with a temporary password, and requires the doctor to change that password on the first sign-in.

### For doctors

- Sign in to a dedicated doctor workspace
- View assigned patients
- Open appointment and clinical-record sections
- Change the temporary password after account creation

## Technology used

- React 19
- TypeScript
- Vite
- React Router
- Supabase Auth
- Supabase PostgreSQL
- Supabase Edge Functions
- Row-level security (RLS)

The frontend and backend folders are kept as separate areas of the repository, while Supabase migrations describe the shared database structure.

## Running the frontend

I use Node.js and npm for the React application.

1. Open a terminal in the repository.
2. Go to the frontend folder:

   ```powershell
   cd frontend
   ```

3. Install the dependencies:

   ```powershell
   npm install
   ```

4. Create `frontend/.env` using `.env.example` as a guide:

   ```text
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-publishable-key
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

To create a production build:

```powershell
npm run build
```

The production output can be previewed locally with:

```powershell
npm run preview
```

## Setting up Supabase

MediTrack uses a Supabase project for authentication and for the profile, doctor, patient, and clinical-record tables.

1. Create a project at [supabase.com](https://supabase.com).
2. Open the project's SQL Editor.
3. Run the SQL migration files from `database/migrations/` from oldest to newest:

   - `20261126220000_initial_schema.sql`
   - `20261127153000_database_integrity.sql`

4. Copy the project URL and publishable key into `frontend/.env`.

The migrations create the application tables, authorization functions, row-level security policies, and timestamp behavior. Do not rerun migrations that have already been applied.

### Creating my first administrator

After I create the first account in Supabase **Authentication > Users**, I promote that account to an administrator from the SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'admin@yourclinic.com';
```

I replace the email in the query with the email of the account I created.

## Doctor account functions

The repository includes two Supabase Edge Functions:

- `create-doctor` creates a doctor account and saves the doctor's profile
- `complete-password-change` completes the required first-password-change workflow

Before deploying them, I link the repository to my Supabase project:

```powershell
supabase login
supabase link --project-ref your-project-ref
supabase functions deploy create-doctor
supabase functions deploy complete-password-change
```

After deployment, an administrator can create a doctor account from **Admin > Doctors**.

The Edge Functions use the Supabase service-role key securely on the server. I never add that key to `frontend/.env`, commit it to Git, or expose it through a `VITE_` environment variable.

## Available routes

### Public

- `/login` - Sign in
- `/change-password` - Change a temporary password

### Administrator

- `/admin` - Admin dashboard
- `/admin/patients` - Patient management preview
- `/admin/doctors` - Doctor management
- `/admin/appointments` - Appointment preview
- `/admin/records` - Clinical-record preview
- `/admin/access` - Roles and permissions preview

### Doctor

- `/doctor` - Doctor dashboard
- `/doctor/appointments` - Assigned appointments preview
- `/doctor/patients` - Assigned patients preview
- `/doctor/records` - Clinical-record preview

The admin and doctor pages require an authenticated account with the corresponding role.

## Project structure

```text
frontend/
  src/
    app/                         Application routes
    assets/                      Images, icons, and fonts
    auth/                        Sign-in and role handling
    components/shared/           Shared interface components
    config/                      Supabase client configuration
    layouts/                     Shared workspace layouts
    modules/
      authentication/            Sign-in and password-change pages
      admin/                     Administrator doctor panel
      dashboard/                 Administrator dashboard
      doctors/                   Doctor dashboard
      portal/                   Shared portal section pages
      patients/                  Patient module area
      clinical-records/          Clinical-record module area
      doctor-roles-permissions/  Role and permission module area
    navigation/                  Navigation definitions
    services/api/                Frontend API integration
    utils/                       Shared frontend helpers

backend/
  src/
    api/routes/                  API route organization
    config/                      Backend configuration
    database/                    Database connection structure
    middleware/                  Shared middleware
    modules/                     Feature-specific backend modules
    services/                    Backend services
    utils/                       Backend utilities

database/
  migrations/                    Ordered Supabase database migrations
  schema/                        Reserved for additional schema definitions

supabase/
  functions/
    create-doctor/               Doctor account creation
    complete-password-change/    First-login password completion
    _shared/                     Shared Edge Function helpers
```

## Current project status

The foundation is already in place: role-aware sign-in, protected workspaces, Supabase profiles, doctor accounts, database migrations, row-level security, and temporary-password handling.

I am continuing to build this project, and the next phase is to connect the preview sections to real patient and clinical workflows. Those pages should not yet be treated as a complete electronic medical record system.

## Database security

The initial migration enables row-level security on the main data tables. Administrators can manage application records, while doctors are intended to access only their assigned patients and records.

Still, before I use MediTrack in a real clinic, I would complete additional testing for:

- Authentication and session handling
- Role changes and account deletion
- Doctor assignment rules
- Patient privacy and audit requirements
- Input validation
- Backup and recovery procedures
- Compliance with applicable local healthcare rules
