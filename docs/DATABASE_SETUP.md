# Database Setup Guide

## Option 1: Neon (Free Cloud - Recommended for Quick Start)

Neon provides free PostgreSQL hosting with no credit card required.

### Step 1: Create Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create a new project called "verified-care"

### Step 2: Get Connection String
1. In your Neon dashboard, click on your project
2. Click "Connection Details"
3. Copy the connection string (looks like):
   ```
   postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

### Step 3: Update .env
1. Open `.env` in the project root
2. Replace the DATABASE_URL:
   ```
   DATABASE_URL="postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/verified_care?sslmode=require"
   ```

### Step 4: Push Schema
```bash
cd /Users/yannleborgne/Desktop/Verified-Care-Project
pnpm db:push
```

---

## Option 2: Docker (Local Development)

### Prerequisites
1. Install Docker Desktop from [https://docker.com](https://docker.com/products/docker-desktop/)
2. Start Docker Desktop

### Step 1: Start Services
```bash
cd /Users/yannleborgne/Desktop/Verified-Care-Project
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432
- Redis on port 6379
- Adminer (DB UI) on port 8080

### Step 2: Verify Running
```bash
docker-compose ps
```

### Step 3: Push Schema
```bash
pnpm db:push
```

### Step 4: Access Database UI
Open [http://localhost:8080](http://localhost:8080)
- System: PostgreSQL
- Server: postgres
- Username: verified_care
- Password: verified_care_dev_2026
- Database: verified_care

### Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset database (delete all data)
docker-compose down -v
docker-compose up -d
```

---

## Option 3: Install PostgreSQL Directly (macOS)

### Using Homebrew
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL
brew services start postgresql@15

# Create database
createdb verified_care

# Create user
psql -c "CREATE USER verified_care WITH PASSWORD 'verified_care_dev_2026';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE verified_care TO verified_care;"
```

---

## Verify Connection

After setting up the database, test the connection:

```bash
cd /Users/yannleborgne/Desktop/Verified-Care-Project

# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Open Prisma Studio (visual database browser)
pnpm db:studio
```

Prisma Studio will open at [http://localhost:5555](http://localhost:5555)

---

## Database Schema

The database includes 32 tables:

### Core Tables
- `users` - All user accounts
- `participants` - NDIS participant profiles
- `providers` - Service provider profiles
- `coordinators` - Support coordinator profiles

### Booking & Services
- `bookings` - Service bookings
- `booking_check_ins` - GPS check-in/out records
- `provider_services` - Services offered by providers
- `provider_service_areas` - Geographic coverage

### Compliance
- `provider_documents` - Uploaded verification documents
- `compliance_requirements` - Required document types
- `abn_verifications` - ABN verification results
- `screening_checks` - Worker screening records

### Financial
- `invoices` - Generated invoices
- `invoice_line_items` - Invoice details
- `payments` - Payment records
- `provider_payouts` - Provider payment disbursements

### Communication
- `conversations` - Chat threads
- `messages` - Chat messages
- `notifications` - User notifications

### System
- `audit_logs` - Activity tracking
- `feature_flags` - Feature toggles
- `system_settings` - Platform configuration
