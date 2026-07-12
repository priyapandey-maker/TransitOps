# TransitOps Database Setup

This folder contains the SQL scripts required to initialize the TransitOps ERP MySQL database.

## Prerequisites
- MySQL 8.0 or higher
- The database specified in your `.env` (e.g. `transitops_db`) must be created first.

## Required Environment Variables
Ensure the following variables are present in your `server/.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=transitops_db
```

## Database Creation Steps
1. Open your MySQL client or CLI.
2. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE transitops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE transitops_db;
   ```

## Import Order
You **must** run the scripts in the following order to avoid foreign key constraint errors:

1. **`schema.sql`**: Creates all 10 base tables, relationships, indexes, and constraints.
   ```bash
   mysql -u root -p transitops_db < database/schema.sql
   ```

2. **`seed.sql`**: Injects the required roles and the default admin user.
   ```bash
   mysql -u root -p transitops_db < database/seed.sql
   ```

## Default Admin Credentials
After running the seeder, you can log in using:
- **Email:** `admin@transitops.local`
- **Password:** `Admin@123`

### Regenerating the Password Hash
If you ever need to generate a new bcrypt hash manually for testing or password resets directly in the database, you can run this Node script from the terminal inside the `server/` folder:
```bash
node -e "console.log(require('bcrypt').hashSync('YourNewPassword123', 10));"
```
Then update the database manually:
```sql
UPDATE users SET password_hash = '<hash>' WHERE email = 'admin@transitops.local';
```
