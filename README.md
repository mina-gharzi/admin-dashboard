# Shopino Admin — Store Management Dashboard

A full-featured e-commerce admin dashboard built with **React and TypeScript**, with full **RTL and Persian language support**. The dashboard includes order, product, customer, and team management, analytics and reporting, and a real **Role-Based Access Control (RBAC)** system with five different access levels.

> This project uses a **mock backend** with data persisted in `localStorage`. The architecture is designed so that replacing it with a real API only requires changes to the `services/api.ts` layer, without modifying the rest of the application.

---

## Features

- **Dashboard** — Overview of sales performance, recent orders, and order status distribution charts.

- **Order Management** — Filter by status and search, sorting, status updates, editing, deletion, and CSV export.

- **Product Management** — Categories, active/inactive status, low-stock alerts, and full CRUD operations.

- **Customer Management** — Customers are automatically derived from orders, with no manual "Add Customer" form — similar to how a real e-commerce system works.

- **Team Management** — Available only to the system administrator; supports adding, editing, and removing team members with different roles.

- **Analytics & Reports** — Product category charts, order status distribution, and top-selling products.

- **Global Search** — Search across customers, products, and orders from anywhere in the application, on both desktop and mobile.

- **Dark / Light Mode** and **Collapsible Sidebar** — Both preferences persist across page refreshes.

### Role-Based Access Control (RBAC)

| Role                            | Access                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| System Admin (`system_admin`)   | Full access, including team management and data reset/cleanup |
| Admin (`admin`)                 | Full access except team management                            |
| Sales Manager (`sales_manager`) | Orders, products, and analytics                               |
| Salesperson (`salesperson`)     | Orders and products, without analytics                        |
| Analyst (`analyst`)             | Read-only access — cannot edit orders or products             |

Access control is enforced at both the **UI level** (hiding unauthorized actions) and the **route level** through `RequireRole`, preventing unauthorized users from accessing restricted pages directly via URL.

---

## Tech Stack

- **React + TypeScript** — Strict TypeScript configuration with no `any`
- **Tailwind CSS v4** — CSS-first configuration without `tailwind.config.js`
- **React Router** — Nested routing with layout routes and role-based route guards using `createBrowserRouter`
- **Zustand** — Lightweight state management with `authStore` for sessions and `uiStore` for UI preferences with `persist`
- **TanStack Table v8** — Sortable and paginated data tables
- **Recharts** — Dashboard and analytics charts
- **React Toastify** — Success and error notifications
- **Lucide React** — Icon library
- **Estedad** — Persian typography

---

## Getting Started

> The following commands follow standard Vite conventions. If the project's `package.json` uses different scripts, use the corresponding scripts defined there.

```bash
npm install
npm run dev
```

Then open the URL provided by Vite. By default:

```text
http://localhost:5173
```

### Demo Login

The login page provides **five demo accounts**, one for each role. You can log in directly by selecting an account.

Since this project does not use a real backend, the actual password is not validated — it only needs to be non-empty.

| Role          | Email                       |
| ------------- | --------------------------- |
| System Admin  | `admin@shopino.ir`          |
| Admin         | `ali.rezaei@shopino.ir`     |
| Sales Manager | `negar.karimi@shopino.ir`   |
| Salesperson   | `reza.kazemi@shopino.ir`    |
| Analyst       | `sara.mohammadi@shopino.ir` |

---

## Project Structure

```text
src/
├── components/
│   ├── ui/             # Shared base components (Modal, Dropdown, Button, Input, ...)
│   ├── layout/         # Header, Sidebar, DashboardLayout, NotificationsPanel
│   ├── order/          # Order tables, filters, and forms
│   ├── product/        # Product tables, filters, and forms
│   ├── customer/       # Customer tables and filters
│   ├── dashboard/      # Dashboard widgets
│   ├── analytics/      # Analytics charts and lists
│   └── settings/       # Team member form
├── pages/              # One component per route
├── routes/             # Route definitions + RequireAuth/RequireRole + canonical paths
├── hooks/              # useData, useEditModal, useDocumentTitle, ...
├── services/           # api.ts layer (mock backend, ready for a real API)
├── store/              # authStore and uiStore (Zustand)
├── types/              # Entity definitions — single source of truth for data shapes
├── utils/              # Permissions, status metadata, formatting, validation, ...
└── data/               # Seed data and demo accounts
```

---

## Engineering Highlights

Beyond implementing the core features, the project has gone through several engineering and quality passes:

- **Zero `any`** — All types, including CRUD inputs/outputs, filters, and statuses, are derived from centralized sources such as `ORDER_STATUSES`, `PRODUCT_STATUSES`, and `ROLES`, preventing inconsistencies and type drift across the codebase.

- **Correct Dependency Direction** — The `types/` layer is independent of `services/`, not the other way around. Components consume types directly from `types/` instead of depending on the service layer for type definitions.

- **Accessibility (a11y)** — Includes focus trapping in modals, standard WAI-ARIA menu patterns, `scope="col"` for table headers, dynamic `document.title` updates for each page to communicate route changes to screen readers, and a skip link.

- **Responsive Design** — All list pages provide dedicated card-based mobile layouts rather than relying solely on horizontally scrollable tables. Global search is also fully accessible on mobile.

- **Error Handling** — Consistent toast + rethrow patterns for mutations, automatic retry behavior, and race-condition protection in the data-fetching layer.

- **Optimized Re-renders** — Zustand subscriptions use single-field selectors instead of subscribing to the entire store, especially in `DashboardLayout`, which wraps the application's page content.

---

## Known Limitations — Demo Version

- **No real backend** — Data is persisted in `localStorage` instead of a real database or API.
- **Password validation is not implemented** — Since authentication is mocked, the password only needs to be non-empty.
- **Mock data and authentication** — The project uses seeded demo data and local client-side persistence instead of a production backend.

### Testing

The project includes **Playwright end-to-end tests** covering the main application flows and role-based access behavior.

- **6 E2E tests**
- **6/6 passing**
- Covers core navigation, authentication, and protected application flows.

Unit and integration test coverage is not currently included.
