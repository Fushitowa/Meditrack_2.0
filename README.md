# MediTrack

MediTrack is a clinic management system. The frontend is built with React and TypeScript using Vite. Its current screen is a responsive sign-in page; authentication is not yet connected to a backend or Supabase.

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
  migrations/                    Future schema migration files
  schema/                        Future database schema definitions
```

## Organization notes

- Frontend and backend module boundaries are separate so their implementations can evolve independently.
- Shared frontend components, layouts, navigation, configuration, and utilities have dedicated locations.
- Database assets are kept outside the backend source tree so schema evolution remains explicit.
- The frontend entry point renders the authentication module; other modules remain scaffolding for future work.
