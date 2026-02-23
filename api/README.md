# PHP/MySQL API (XAMPP)

## 1) Create database schema
Run `project/mysql/schema.sql` in phpMyAdmin (or MySQL CLI).

## 2) Place project in XAMPP htdocs
Expected API base URL in frontend:
- `http://localhost/project/api`

If your folder name is different, update `VITE_API_BASE_URL` in `.env.local`.

## 3) Configure DB credentials (optional)
Default values are used by `api/bootstrap.php`:
- host: `127.0.0.1`
- port: `3306`
- db: `melva`
- user: `root`
- pass: `` (empty)

You can override with environment variables:
- `MELVA_DB_HOST`
- `MELVA_DB_PORT`
- `MELVA_DB_NAME`
- `MELVA_DB_USER`
- `MELVA_DB_PASS`

## 4) Run frontend
From `project/`:
- `npm run dev`

The frontend will call PHP endpoints with cookie sessions.

## Notes
- Password reset currently returns success but does not send real email (no mailer configured).
- Auth/session is now local PHP session based, not Supabase Auth.
