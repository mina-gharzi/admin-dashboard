# Shopino Admin 📊

### Role-Based E-Commerce Admin Dashboard

Shopino Admin is a staff-facing admin dashboard for an e-commerce platform, built with **React, TypeScript, and a centralized RBAC (role-based access control) system**. It covers everything a store's internal team needs: order management, product catalog, customer records, team management, and analytics — each gated by role.

Built as a portfolio project with a strong focus on **type safety, a single source of truth for permissions, and realistic multi-role workflows** rather than a generic single-admin CRUD panel.

---

## 🚀 Live Demo

[View Live Demo](#) <!-- add your Netlify/Vercel link here -->

---

## ✨ Features

### 🔐 Role-Based Access Control (RBAC)
Five distinct staff roles, each with different page and action access:

| Role | Persian Label | Access |
|---|---|---|
| `system_admin` | مدیر کل سیستم | Full access — the only role that can manage the team and reset system data |
| `admin` | ادمین | Manage products/orders — no team management or data reset |
| `sales_manager` | مدیر فروش | Manage products/orders, view analytics |
| `salesperson` | فروشنده | Manage products/orders, no analytics access |
| `analyst` | تحلیل‌گر | Read-only everywhere — for reporting, not editing |

Permissions are defined **once** in `utils/permissions.ts` and consumed everywhere they're needed — route guards (`RequireRole`), Sidebar visibility, and sensitive in-page actions (delete, team management, data reset) — so there's no risk of a permission rule being enforced in one place and forgotten in another.

### 📦 Core Modules
- **Dashboard** — stats overview, revenue chart, recent orders, top products, activity feed
- **Products** — catalog table with filters, create/edit modal, product detail page
- **Orders** — order table with filters, status management, order detail page
- **Customers** — customer table with filters, customer detail page
- **Analytics** — category breakdown, order-status chart, low-stock products, top products
- **Team** — staff management (system_admin only)
- **Settings** — account & system settings

### 🧰 Quality-of-life details
- CSV export utility with UTF-8 BOM handling so Persian text opens correctly in Excel (a common gotcha most implementations miss)
- Global search in the header with debounced queries
- Notification panel
- Mobile-responsive sidebar
- Persian/RTL throughout, with the Estedad font family

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI and type-safe component architecture |
| Vite | Development and build tooling |
| React Router DOM | Routing, nested layout routes, RBAC-aware guards |
| Zustand | Auth session and UI state |
| Lucide React | Icons |
| Custom design system | Reusable UI primitives (Button, Modal, Table, Card, Badge, Dropdown...) |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── dashboard/     → stats, revenue chart, recent orders, top products
│   ├── analytics/      → category chart, order-status chart, low-stock, top products
│   ├── product/        → filters, table, create/edit modal
│   ├── order/           → filters, table, create/edit modal
│   ├── customer/         → filters, table
│   ├── settings/          → team member form
│   ├── layout/             → DashboardLayout, Header, Sidebar, NotificationsPanel
│   └── ui/                  → design-system primitives
│
├── routes/
│   ├── paths.ts               → single source of truth for every dashboard path
│   ├── routes.tsx              → route tree
│   ├── RequireAuth.tsx          → must be logged in
│   └── RequireRole.tsx           → must be logged in AND have page access (per permissions.ts)
│
├── utils/permissions.ts       → RBAC single source of truth (roles, labels, page access, action guards)
├── store/                      → authStore (session), uiStore (UI state)
├── services/                    → api.ts, storage.ts — data access isolated from components
├── data/demoAccounts.ts          → seeded demo users, one per role
├── types/                         → shared TypeScript types (Product, Order, Customer, User...)
└── hooks/                          → useData, useEditModal, useMobileSidebar, useLogout, useDocumentTitle
```

### Why a dedicated `routes/paths.ts`?

Route strings used to be duplicated by hand between `routes.tsx` and the `PAGE_ACCESS` map in `permissions.ts`. If a route segment changed in one place (say `"team"` → `"staff"`), nothing would catch the mismatch at compile time — access control would silently stop protecting the route. Centralizing every path in one file means `routes.tsx`, `permissions.ts`, and `Sidebar.tsx` all read from the same constants, so a renamed route can't quietly desync from its access rule.

---

## ⚠️ Project Scope & Limitations

Shopino Admin is a portfolio project and intentionally uses a mock data layer instead of a production backend:

- No real backend — RBAC here is a **UI/UX layer only**, not a real security boundary. It hides and disables the right things in the interface, but a technical user opening devtools could bypass it client-side. In a real system, every one of these rules (`canAccessPath`, `canManageProducts`, etc.) must also be enforced server-side — this is called out directly in code comments in `permissions.ts`.
- Demo login accepts any non-empty password — the role is looked up by matching the email against a fixed `demoAccounts` list, since there's no real backend to authenticate against.
- Static/seeded product, order, and customer data.

These limitations are intentional: the goal is to demonstrate a realistic multi-role admin UI and permission architecture without introducing unnecessary backend complexity.

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/mina-gharzi/admin-dashboard.git

# Navigate to the project folder
cd admin-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

**Demo accounts** (any non-empty password works):

| Email | Role |
|---|---|
| `admin@shopino.ir` | system_admin |
| `ali.rezaei@shopino.ir` | admin |
| `negar.karimi@shopino.ir` | sales_manager |
| `reza.kazemi@shopino.ir` | salesperson |
| `sara.mohammadi@shopino.ir` | analyst |

---

## 📌 Future Improvements

- Real backend with server-enforced RBAC
- Real authentication (hashed passwords, sessions/tokens)
- Live data instead of seeded mock data
- Unit/E2E test coverage

---

## 👩‍💻 Author

**Mina Gharzi**
Frontend Developer focused on building modern, accessible, and scalable web applications with React and TypeScript.

---

## 📄 License

This is a personal portfolio project and is not licensed for commercial reuse.
