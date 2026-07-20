<div align="center">

# 🍽️ NYC CodeQuest — Restaurant ERP

### **The Complete Restaurant Operating System**

> A full-stack, multi-tenant Restaurant ERP built in 5 hours — featuring public QR self-ordering, a kitchen display system, live order tracking, billing, and a full management dashboard.

---

![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker)
![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=node.js)

</div>

---

## About

NYC CodeQuest is a **multi-tenant SaaS platform** for managing restaurant operations end-to-end. Each user creates one organization (restaurant), then manages menus, tables, orders, kitchen workflow, billing, and customers — all from a single dashboard.

Customers can scan a **QR code** at their table to view the menu, place orders, track preparation status in real time, and pay — no app install required.

---

## Features

| Module | Description |
|--------|-------------|
| **Authentication** | JWT cookie-based auth, signup/login/logout, protected routes |
| **Onboarding** | 5-step wizard to set up restaurant details, contact, address, operations, and compliance IDs |
| **Menu Management** | CRUD for categories and items with images, pricing, prep time, veg/non-veg flags |
| **Table Management** | Create tables with capacity and status tracking (available / occupied / reserved / cleaning) |
| **Order Management** | Place orders linked to tables, track status from pending through completion |
| **Kitchen Display** | Kanban-style board (Incoming → In Progress → Ready & Served) with preparation time tracking and auto-refresh |
| **Billing** | Generate bills, process payments via Cash / UPI / Card |
| **Customer Directory** | Track customer details, order history, and total spend |
| **Public Self-Ordering** | QR code based menu browsing, ordering, live order tracking, and payment |
| **Dashboard Overview** | Revenue, orders, active tables, popular items, and recent order stats |
| **ImageKit Integration** | Direct browser-to-cloud image uploads with server-signed auth |
| **Responsive UI** | Works across desktop, tablet, and mobile |

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | UI |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| Lucide React | Icons |

### Backend

| Technology | Purpose |
|------------|---------|
| Node.js 20 | Runtime |
| Express 5 | REST API framework |
| Mongoose 9 | MongoDB ODM |
| JWT | Authentication (httpOnly cookies) |
| bcryptjs | Password hashing |
| Zod | Environment validation |
| express-validator | Request validation |
| Pino | Structured logging |
| Helmet | Security headers |
| HPP | HTTP parameter pollution protection |
| Compression | Gzip responses |

### Infrastructure

| Tool | Purpose |
|------|---------|
| MongoDB Atlas | Database hosting |
| ImageKit | Image uploads & CDN |
| Docker | Containerization |
| Docker Compose | Multi-service dev & prod environments |

---

## Architecture

```
nyc/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/                     # API client modules (9 files)
│   │   ├── components/              # Shared UI components
│   │   │   ├── dashboard/           # Sidebar, TopBar, StatCard, Badge, Modal, SearchableSelect
│   │   │   └── landing/             # Landing page sections
│   │   ├── context/                 # AuthContext (JWT cookie state)
│   │   ├── pages/
│   │   │   ├── dashboard/           # Overview, Menu, Tables, Orders, Kitchen, Billing, Customers
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── Onboarding.jsx       # 5-step restaurant setup wizard
│   │   │   └── PublicMenu.jsx       # Customer-facing QR menu + ordering
│   │   ├── App.jsx                  # Route config + protected route wrappers
│   │   └── main.jsx
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── modules/                 # Feature modules
│   │   │   ├── auth/                # signup, login, logout, getMe
│   │   │   ├── organization/        # Restaurant CRUD
│   │   │   ├── menu/                # Public menu by org
│   │   │   ├── menuCategory/        # Category CRUD
│   │   │   ├── menuItems/           # Menu item CRUD
│   │   │   ├── tables/              # Table CRUD + public lookup
│   │   │   ├── order/               # Order CRUD + public order + payment
│   │   │   ├── customer/            # Customer CRUD
│   │   │   └── imagekit/            # ImageKit auth params
│   │   └── shared/
│   │       ├── config/              # env, db, logger
│   │       ├── constants/           # env defaults, token config
│   │       ├── dao/                 # Data Access Objects (7 DAOs)
│   │       ├── middlewares/          # auth, org, error, validation
│   │       ├── models/              # Mongoose schemas (7 models)
│   │       ├── router/              # Main API router
│   │       └── utils/               # ApiError, ApiResponse, asyncWrapper, sanitizer
│   └── server.js
│
├── scripts/                         # Dev tooling
├── Dockerfile                       # Multi-stage production build
├── docker-compose.yml               # Development
└── docker-compose.prod.yml          # Production
```

---

## Routes

### Frontend Routes

| Path | Component | Access |
|------|-----------|--------|
| `/` | Landing Page / redirects to dashboard | Public |
| `/sign-up` | SignUp | Public |
| `/sign-in` | SignIn | Public |
| `/onboarding` | 5-step Onboarding Wizard | Auth, no org |
| `/menu/:orgId` | Public QR Menu | Public |
| `/dashboard` | Overview | Auth + Org |
| `/dashboard/menu` | Menu Management | Auth + Org |
| `/dashboard/tables` | Table Management | Auth + Org |
| `/dashboard/orders` | Order Management | Auth + Org |
| `/dashboard/kitchen` | Kitchen Display | Auth + Org |
| `/dashboard/billing` | Billing & Payments | Auth + Org |
| `/dashboard/customers` | Customer Directory | Auth + Org |

### API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/signup` | Register | Public |
| `POST` | `/api/auth/login` | Login (sets cookies) | Public |
| `GET` | `/api/auth/me` | Current user | Auth |
| `POST` | `/api/auth/logout` | Clear cookies | Public |
| `POST` | `/api/organizations` | Create restaurant | Auth |
| `GET` | `/api/organizations` | Get restaurant | Auth |
| `PUT` | `/api/organizations` | Update restaurant | Auth |
| `DELETE` | `/api/organizations` | Delete restaurant | Auth |
| `POST` | `/api/menu-categories` | Create category | Auth + Org |
| `GET` | `/api/menu-categories` | List categories | Auth + Org |
| `PUT` | `/api/menu-categories/:id` | Update category | Auth + Org |
| `DELETE` | `/api/menu-categories/:id` | Delete category | Auth + Org |
| `POST` | `/api/menu-items` | Create menu item | Auth + Org |
| `GET` | `/api/menu-items` | List menu items | Auth + Org |
| `PUT` | `/api/menu-items/:id` | Update menu item | Auth + Org |
| `DELETE` | `/api/menu-items/:id` | Delete menu item | Auth + Org |
| `GET` | `/api/menu-items/:categoryId` | Items by category | Auth + Org |
| `POST` | `/api/tables` | Create table | Auth + Org |
| `GET` | `/api/tables` | List tables | Auth + Org |
| `PUT` | `/api/tables/:id` | Update table | Auth + Org |
| `DELETE` | `/api/tables/:id` | Delete table | Auth + Org |
| `GET` | `/api/tables/public/:orgId/number/:num` | Public table lookup | Public |
| `GET` | `/api/menu/:orgId` | Menu by restaurant | Public |
| `POST` | `/api/orders` | Place order | Auth + Org |
| `GET` | `/api/orders` | List orders | Auth + Org |
| `GET` | `/api/orders/:id` | Order details | Auth + Org |
| `PUT` | `/api/orders/:id/status` | Update order status | Auth + Org |
| `PUT` | `/api/orders/:id/payment` | Process payment | Auth + Org |
| `POST` | `/api/orders/public/:orgId` | Public self-order | Public |
| `GET` | `/api/orders/public/:orderId` | Public order tracking | Public |
| `PUT` | `/api/orders/public/:orderId/payment` | Public payment | Public |
| `POST` | `/api/customers` | Create customer | Auth + Org |
| `GET` | `/api/customers` | List customers | Auth + Org |
| `PUT` | `/api/customers/:id` | Update customer | Auth + Org |
| `DELETE` | `/api/customers/:id` | Delete customer | Auth + Org |
| `GET` | `/api/imagekit/auth` | Upload auth params | Auth |

---

## Database Models

### User
| Field | Type |
|-------|------|
| name | String |
| email | String (unique) |
| password | String (hashed, bcrypt) |

### Organization
| Field | Type |
|-------|------|
| owner | ObjectId → User |
| name | String |
| type | String |
| description | String |
| contact | { phone, email, website } |
| address | { line1, line2, city, state, country, pincode } |
| gstNumber | String |
| fssaiNumber | String |
| panNumber | String |
| settings | { tableCount, openingTime, closingTime, currency, timezone } |
| logo | String |
| banner | String |

### MenuCategory
| Field | Type |
|-------|------|
| organization | ObjectId → Organization |
| name | String |
| description | String |
| isActive | Boolean |
| sortOrder | Number |

### MenuItem
| Field | Type |
|-------|------|
| organization | ObjectId → Organization |
| category | ObjectId → MenuCategory |
| name | String |
| description | String |
| image | String |
| price | Number |
| isVeg | Boolean |
| isAvailable | Boolean |
| preparationTime | Number |

### Table
| Field | Type |
|-------|------|
| organization | ObjectId → Organization |
| tableNumber | Number |
| capacity | Number |
| status | String (available / occupied / reserved / cleaning) |
| qrCode | String |

### Order
| Field | Type |
|-------|------|
| organization | ObjectId → Organization |
| table | ObjectId → Table |
| items | [{ menuItem, quantity, price }] |
| totalAmount | Number |
| status | String (pending / preparing / served / completed / cancelled) |
| paymentStatus | String (pending / paid / refunded) |
| paymentMethod | String (cash / card / upi / online) |
| orderNumber | String |

### Customer
| Field | Type |
|-------|------|
| organization | ObjectId → Organization |
| name | String |
| phone | String |
| email | String |
| city | String |
| orders | Number |
| spent | Number |

---

## Security

- **JWT** in httpOnly cookies (7-day expiry) — not accessible via JavaScript
- **bcryptjs** password hashing (salt rounds: 10)
- **Helmet** for HTTP security headers
- **HPP** for HTTP parameter pollution protection
- **CORS** configured for development and production origins
- **Zod** for environment variable validation
- **express-validator** for API input validation
- **Morgan** for request logging

---

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB instance (local or Atlas)
- ImageKit account (for image uploads)

### Clone

```bash
git clone https://github.com/YOUR_USERNAME/nyc.git
cd nyc
```

### Environment Variables

**Server** — `server/.env`

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
SMTP_MAIL=false
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

**Client** — `client/.env`

```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=NYC CodeQuest
```

### Install Dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### Run Development

```bash
# Server (port 5000)
cd server && npm run dev

# Client (port 5173)
cd client && npm run dev
```

---

## Docker

### Development

```bash
docker compose up
```

### Production

```bash
docker compose -f docker-compose.prod.yml up --build
```

### Stop

```bash
docker compose down
```

---

## Demo Flow

```
Sign Up → Onboard Restaurant → Create Menu Categories & Items → Add Tables
→ Customer scans QR → Browses menu → Places order → Kitchen sees order
→ Chef marks preparing → Chef marks served → Generate bill → Process payment
```

---

## Project Stats

| Metric | Value |
|--------|------:|
| Feature Modules | 9 |
| Frontend Pages | 12 |
| API Endpoints | 30+ |
| Database Models | 7 |
| Docker Support | Multi-stage |

---

## License

MIT
