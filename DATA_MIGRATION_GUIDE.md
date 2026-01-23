# Data Migration Guide: Vercel Postgres → AWS RDS

This guide will help you migrate all your data from Vercel Postgres to AWS RDS.

## ⚠️ Important Notes

- **Schema is already migrated** ✅ (tables created on AWS RDS)
- **Data needs to be migrated** ⏳ (this guide)
- **Both databases will work** during migration (dual deployment)

## 📋 Prerequisites

You need PostgreSQL client tools installed:

### Windows:
1. **Option A: Download PostgreSQL** (includes pg_dump and psql)
   - Download from: https://www.postgresql.org/download/windows/
   - Install PostgreSQL (includes command-line tools)
   - Add to PATH: `C:\Program Files\PostgreSQL\16\bin` (adjust version)

2. **Option B: Use WSL (Windows Subsystem for Linux)**
   - Install WSL: `wsl --install`
   - Then: `sudo apt-get install postgresql-client`

### Mac:
```bash
brew install postgresql
```

### Linux:
```bash
sudo apt-get install postgresql-client
```

## 🚀 Method 1: Using Scripts (Recommended)

### Step 1: Export Data from Vercel Postgres

1. **Get your Vercel Postgres connection string:**
   - Go to Vercel Dashboard → Storage → Your Database
   - Click "Connection String" or "Settings"
   - Copy the connection string (looks like: `postgres://...`)

2. **Run the export script:**
   ```powershell
   # Set your Vercel Postgres connection string
   $env:VERCEL_DATABASE_URL="your-vercel-postgres-connection-string"
   
   # Run export
   npm run export:vercel
   ```

   This will create `vercel-data-export.sql` file.

### Step 2: Import Data to AWS RDS

```powershell
# Set your AWS RDS connection string
$env:AWS_DATABASE_URL="postgresql://league_ladder_db:Uzi090206@leagueladder-db.cfyya8csgcfp.eu-north-1.rds.amazonaws.com:5432/league_ladder?sslmode=require"

# Run import
npm run import:aws
```

## 🔧 Method 2: Manual Commands (If Scripts Don't Work)

### Step 1: Export from Vercel Postgres

```bash
# Replace with your actual Vercel Postgres connection string
pg_dump "your-vercel-postgres-connection-string" --no-owner --no-acl --data-only --inserts > vercel-data-export.sql
```

**Flags explained:**
- `--no-owner`: Don't include ownership commands
- `--no-acl`: Don't include access control commands
- `--data-only`: Only export data (not schema, since we already created tables)
- `--inserts`: Use INSERT statements (more compatible)

### Step 2: Import to AWS RDS

```bash
# Replace with your actual AWS RDS connection string
psql "postgresql://league_ladder_db:Uzi090206@leagueladder-db.cfyya8csgcfp.eu-north-1.rds.amazonaws.com:5432/league_ladder?sslmode=require" < vercel-data-export.sql
```

## 🎯 Method 3: Using Vercel Dashboard (No Tools Needed)

If you don't have pg_dump installed, you can export data manually:

### Step 1: Export Data from Vercel

1. **Go to Vercel Dashboard** → Storage → Your Database
2. **Click "Query" tab**
3. **For each table, run export queries:**

   ```sql
   -- Export Users
   SELECT * FROM users;
   
   -- Export Leagues
   SELECT * FROM leagues;
   
   -- Export Players
   SELECT * FROM players;
   
   -- Export Matches
   SELECT * FROM matches;
   
   -- Export Challenges
   SELECT * FROM challenges;
   
   -- Export Ratings
   SELECT * FROM player_ratings;
   
   -- ... (export all tables)
   ```

4. **Copy the results** and save them

### Step 2: Import to AWS RDS

1. **Connect to AWS RDS** using pgAdmin or psql
2. **For each table, insert the data:**

   ```sql
   -- Import Users
   INSERT INTO users (id, name, email, ...) VALUES (...);
   
   -- Import Leagues
   INSERT INTO leagues (id, name, ...) VALUES (...);
   
   -- ... (import all tables)
   ```

## 📊 Method 4: Using Prisma Studio (Visual Method)

### Step 1: Export from Vercel

1. **Set Vercel connection:**
   ```powershell
   $env:DATABASE_URL="your-vercel-postgres-connection-string"
   ```

2. **Open Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

3. **Manually copy data** from each table

### Step 2: Import to AWS RDS

1. **Set AWS RDS connection:**
   ```powershell
   $env:DATABASE_URL="postgresql://league_ladder_db:Uzi090206@leagueladder-db.cfyya8csgcfp.eu-north-1.rds.amazonaws.com:5432/league_ladder?sslmode=require"
   ```

2. **Open Prisma Studio:**
   ```bash
   npm run prisma:studio
   ```

3. **Manually paste data** into each table

⚠️ **Note:** This method is slow for large datasets.

## ✅ Verification

After importing, verify the data:

```powershell
# Set AWS RDS connection
$env:DATABASE_URL="postgresql://league_ladder_db:Uzi090206@leagueladder-db.cfyya8csgcfp.eu-north-1.rds.amazonaws.com:5432/league_ladder?sslmode=require"

# Check data counts
npx prisma studio
```

Or use SQL queries:
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM leagues;
SELECT COUNT(*) FROM players;
SELECT COUNT(*) FROM matches;
-- ... check all tables
```

## 🐛 Troubleshooting

### Error: "pg_dump: command not found"
- **Solution:** Install PostgreSQL client tools (see Prerequisites)

### Error: "Connection refused"
- **Solution:** Check RDS security group allows your IP
- **Solution:** Verify connection string is correct

### Error: "Table already exists"
- **Solution:** This is normal if schema was already created
- **Solution:** Use `--data-only` flag in pg_dump

### Error: "Foreign key constraint violation"
- **Solution:** Import tables in correct order (users → players → matches)
- **Solution:** Or disable foreign key checks temporarily

### Error: "SSL connection required"
- **Solution:** Add `?sslmode=require` to connection string

## 📝 Data Migration Checklist

- [ ] Export data from Vercel Postgres
- [ ] Verify export file was created
- [ ] Import data to AWS RDS
- [ ] Verify data counts match
- [ ] Test a few records manually
- [ ] Verify relationships work (foreign keys)
- [ ] Test app functionality with AWS RDS

## 🎉 Next Steps

After data migration is complete:
1. ✅ Verify all data is in AWS RDS
2. ✅ Test app functionality
3. ✅ Proceed to Phase 3: Set up AWS Amplify
4. ✅ Update Amplify environment variables
5. ✅ Deploy and test

---

**Remember:** Both databases will work during migration. Test thoroughly before switching!
