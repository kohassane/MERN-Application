# OISSU Backend API

Backend REST API pour l'Office Ivoirien du Sport Scolaire et Universitaire (OISSU).

**Stack:** Node.js · Express · TypeScript · Prisma · SQLite · JWT

---

## Setup & Installation

```bash
# 1. Go to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy environment file and configure
cp .env.example .env
# Edit .env with your values (especially JWT_SECRET in production)

# 4. Generate Prisma client
npx prisma generate

# 5. Run database migrations
npx prisma migrate dev --name init

# 6. Seed the database with initial data
npm run db:seed

# 7. Start development server
npm run dev
```

The API will be available at `http://localhost:5000/api`.

---

## Default Admin Credentials

| Field       | Value              |
|-------------|--------------------|
| Identifiant | `admin`            |
| Email       | `admin@oissu.ci`   |
| Password    | `Admin@2024`       |
| Role        | DIRECTEUR_GENERAL  |

---

## Environment Variables

| Variable       | Default                    | Description                    |
|----------------|----------------------------|--------------------------------|
| `DATABASE_URL` | `file:./dev.db`            | SQLite database path           |
| `JWT_SECRET`   | *(change in production)*   | Secret key for JWT signing     |
| `JWT_EXPIRES_IN` | `7d`                     | JWT token expiry               |
| `PORT`         | `5000`                     | Server port                    |
| `NODE_ENV`     | `development`              | Environment                    |
| `FRONTEND_URL` | `http://localhost:5173`    | Allowed CORS origin            |

---

## API Endpoints

### Health
| Method | Path      | Auth | Description              |
|--------|-----------|------|--------------------------|
| GET    | /health   | No   | API health check         |

### Authentication — `/api/auth`
| Method | Path              | Auth | Description                    |
|--------|-------------------|------|--------------------------------|
| POST   | /login            | No   | Login with identifiant/password |
| POST   | /logout           | Yes  | Logout (invalidate client token) |
| GET    | /me               | Yes  | Get current user profile       |
| PUT    | /me/password      | Yes  | Change own password            |

**Login request body:**
```json
{ "identifiant": "admin", "password": "Admin@2024" }
```
**Login response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": "...", "identifiant": "admin", "role": "DIRECTEUR_GENERAL", ... }
  }
}
```

### Users — `/api/users`
All routes require authentication + role: `DIRECTEUR_GENERAL`, `CHEF_SERVICE_RH`, or `CHEF_SERVICE_INFORMATIQUE`.

| Method | Path              | Description                    |
|--------|-------------------|--------------------------------|
| GET    | /                 | List users (pagination + search) |
| POST   | /                 | Create user                    |
| GET    | /:id              | Get user by ID                 |
| PUT    | /:id              | Update user (no password)      |
| DELETE | /:id              | Deactivate user (soft delete)  |
| PUT    | /:id/activate     | Reactivate user                |

**Query params for GET /:** `page`, `limit`, `search`

### Events — `/api/events`
| Method | Path    | Auth     | Description                        |
|--------|---------|----------|------------------------------------|
| GET    | /       | No       | List events (pagination, filter)   |
| GET    | /:id    | No       | Event details with results         |
| POST   | /       | Yes (*)  | Create event                       |
| PUT    | /:id    | Yes (*)  | Update event                       |
| DELETE | /:id    | Yes (*)  | Delete event                       |

**Query params for GET /:** `page`, `limit`, `search`, `category`

(*) Roles: `DIRECTEUR_GENERAL`, `CHEF_DEPT_DEV_SPORTIF`, `CHEF_SERVICE_COMPETITION`, `CHEF_SERVICE_INFORMATIQUE`

### Results — `/api/results`
| Method | Path    | Auth     | Description                         |
|--------|---------|----------|-------------------------------------|
| GET    | /       | No       | List results (pagination, filter)   |
| GET    | /:id    | No       | Result details with teams           |
| POST   | /       | Yes (*)  | Create result with teams            |
| PUT    | /:id    | Yes (*)  | Update result (replaces teams)      |
| DELETE | /:id    | Yes (*)  | Delete result                       |

**Query params for GET /:** `page`, `limit`, `search`, `category`, `sort` (asc/desc)

(*) Same roles as Events.

**Create result body:**
```json
{
  "eventId": "uuid",
  "eventName": "Championnat Football 2024",
  "date": "2024-03-15",
  "category": "Football",
  "teams": [
    { "name": "Équipe A", "score": 3, "position": 1 },
    { "name": "Équipe B", "score": 1, "position": 2 }
  ]
}
```

### Products — `/api/products`
| Method | Path          | Auth     | Description              |
|--------|---------------|----------|--------------------------|
| GET    | /             | No       | List products            |
| GET    | /:id          | No       | Product details          |
| POST   | /             | Yes (*)  | Create product           |
| PUT    | /:id          | Yes (*)  | Update product           |
| DELETE | /:id          | Yes (*)  | Delete product           |
| PATCH  | /:id/stock    | Yes (*)  | Toggle inStock           |

**Query params for GET /:** `page`, `limit`, `search`, `category`, `inStock` (true/false), `featured` (true/false)

(*) Roles: `DIRECTEUR_GENERAL`, `CHEF_DEPT_AFFAIRES_ADMIN_FIN`, `CHEF_SERVICE_BUDGET`, `CHEF_SERVICE_INFORMATIQUE`

### Partners — `/api/partners`
| Method | Path    | Auth     | Description         |
|--------|---------|----------|---------------------|
| GET    | /       | No       | List partners       |
| GET    | /:id    | No       | Partner details     |
| POST   | /       | Yes (*)  | Create partner      |
| PUT    | /:id    | Yes (*)  | Update partner      |
| DELETE | /:id    | Yes (*)  | Delete partner      |

**Query params for GET /:** `tier` (PLATINUM/GOLD/SILVER/BRONZE)

(*) Roles: `DIRECTEUR_GENERAL`, `CHEF_DEPT_COMMUNICATION`, `CHEF_SERVICE_COMMUNICATION`, `CHEF_SERVICE_INFORMATIQUE`

### News — `/api/news`
| Method | Path    | Auth     | Description           |
|--------|---------|----------|-----------------------|
| GET    | /       | No       | List news articles    |
| GET    | /:id    | No       | Article details       |
| POST   | /       | Yes (*)  | Create article        |
| PUT    | /:id    | Yes (*)  | Update article        |
| DELETE | /:id    | Yes (*)  | Delete article        |

**Query params for GET /:** `page`, `limit`, `search`

(*) Same roles as Partners.

### Orders — `/api/orders`
All routes require authentication.

| Method | Path          | Auth       | Description                   |
|--------|---------------|------------|-------------------------------|
| GET    | /             | Yes        | List own orders (admin: all)  |
| GET    | /:id          | Yes        | Get order (own or admin)      |
| POST   | /             | Yes        | Create order from cart        |
| PUT    | /:id/status   | Yes (**)   | Update order status           |
| DELETE | /:id          | Yes        | Cancel pending order          |

(**) Roles: `DIRECTEUR_GENERAL`, `CHEF_DEPT_AFFAIRES_ADMIN_FIN`, `CHEF_SERVICE_BUDGET`, `CHEF_SERVICE_INFORMATIQUE`

**Create order body:**
```json
{
  "items": [
    { "productId": "uuid", "quantity": 2 },
    { "productId": "uuid", "quantity": 1 }
  ]
}
```

**Order statuses:** `PENDING` → `CONFIRMED` → `SHIPPED` → `DELIVERED` | `CANCELLED`

### Search — `/api/search`
| Method | Path    | Auth | Description                            |
|--------|---------|------|----------------------------------------|
| GET    | /       | No   | Search across events, products, news, results |

**Query params:** `q` (min 2 characters)

**Response structure:**
```json
{
  "success": true,
  "data": {
    "query": "football",
    "total": 5,
    "results": {
      "events": { "data": [...], "count": 2 },
      "products": { "data": [...], "count": 1 },
      "news": { "data": [...], "count": 1 },
      "results": { "data": [...], "count": 1 }
    }
  }
}
```

---

## Response Format

All responses follow a consistent format:

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Paginated success:**
```json
{
  "success": true,
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  },
  "message": "..."
}
```

**Error:**
```json
{
  "success": false,
  "error": "ErrorType",
  "message": "Human readable message"
}
```

---

## Role Permissions Table

| Role | Users | Events | Results | Products | Partners | News | Orders |
|------|-------|--------|---------|----------|----------|------|--------|
| DIRECTEUR_GENERAL | Full | Full | Full | Full | Full | Full | Full |
| CHEF_SERVICE_INFORMATIQUE | Full | Full | Full | Full | Full | Full | Full |
| CHEF_DEPT_AFFAIRES_ADMIN_FIN | - | - | - | Manage | - | - | Status |
| CHEF_SERVICE_RH | Manage | - | - | - | - | - | - |
| CHEF_DEPT_DEV_SPORTIF | - | Manage | Manage | - | - | - | - |
| CHEF_SERVICE_COMPETITION | - | Manage | Manage | - | - | - | - |
| CHEF_SERVICE_BUDGET | - | - | - | Manage | - | - | Status |
| CHEF_DEPT_COMMUNICATION | - | - | - | - | Manage | Manage | - |
| CHEF_SERVICE_COMMUNICATION | - | - | - | - | Manage | Manage | - |
| All authenticated users | - | Read | Read | Read | Read | Read | Own |
| Public (unauthenticated) | - | Read | Read | Read | Read | Read | - |

---

## Authentication

Use JWT Bearer tokens:
```
Authorization: Bearer <token>
```

Tokens expire after 7 days by default (configurable via `JWT_EXPIRES_IN`).

---

## Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript to dist/
npm run start        # Run compiled production server
npm run db:generate  # Regenerate Prisma client
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio (visual DB browser)
```
