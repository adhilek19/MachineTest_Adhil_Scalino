# MORROW — Coffee & Kitchen

> A modern, editorial café website and comprehensive administrative management system built with **React 18**, **Vite**, **React Router v6**, **Axios**, and **Tailwind CSS**. Developed for the 3-day React Technical Assessment.

---

## ☕ Project Overview

**MORROW Coffee & Kitchen** is a full-featured web application and administrative portal backed by the Scalino Technologies Mock API (`https://mockapi.scalinotechnologies.com/api/v1`). 

The application is split into two experiences:
1. **Public Boutique Website**: An editorial guest experience showcasing coffee roasts, kitchen culinary creations, real-time table reservations, inquiry dispatching, team bios, customer testimonials, and operating hours.
2. **Admin Management Panel**: A secure operational dashboard for café staff to oversee menu categories, individual dishes/beverages, staff members, reviews, operating schedule, table bookings, and customer inquiries with complete CRUD operations.

---

## ✨ Features

### Public Website
- **Hero & Storytelling**: High-impact editorial imagery, brand story, and reservation call-to-actions.
- **Dynamic Menu Catalog**: Live category filter tabs driven by backend categories, price formatting, offer badges, and active item status.
- **Table Reservation System**: Form validation with date/time pickers and direct SQL-compliant payload delivery.
- **Contact & Inquiry Dispatch**: Real-time message dispatching with instant feedback.
- **Team Showcase**: Real-time staff profiles with photo fallbacks and role descriptions.
- **Guest Testimonials**: Customer ratings dynamically mapped into visual star ratings.
- **Schedule & Opening Hours**: Live operating hours with open/closed indicators.
- **Fully Responsive**: Crafted with mobile-first breakpoints (tested at 375px, 768px, 1024px, and 1440px).

### Admin Portal
- **Dashboard Overview**: Metric summary cards (Total Menu Items, Categories, Bookings, Messages) and quick data tables.
- **Menu Categories Management**: Create, edit, and delete categories with priority sorting and description fields.
- **Menu Items Catalog**: Add, modify, and delete food and beverage items with category mapping, pricing, tag badges, and availability toggles.
- **Team Members Management**: Create, edit, and delete staff profiles with local image base64 upload and server image resolution.
- **Testimonial Reviews**: Add, edit, and delete customer reviews with 1–10 rating scales and avatar uploads.
- **Opening Hours Management**: Add, modify, and delete operational day/time slots with closure flags.
- **Reservations Inbox**: View incoming table bookings, guest headcounts, requested time slots, and cancel bookings.
- **Contact Inquiries Inbox**: Read guest messages, view contact timestamps, and archive/delete inquiries.
- **Role-Based Login**: Instant one-click staff identity selection or administrator login with session persistence (`localStorage`).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18.3.1 |
| **Bundler / Tooling** | Vite 5.4.11 |
| **Routing** | React Router DOM v6.28 |
| **HTTP Client** | Axios 1.7.9 (custom interceptors for business codes) |
| **Styling** | Tailwind CSS 3.4.16 + PostCSS + Autoprefixer |
| **Icons** | Lucide React |
| **Typography** | Google Fonts (*DM Serif Display* & *DM Sans*) |
| **Forms** | React Controlled State & React Hook Form |

---

## 📁 Architecture

The project adheres to a clean, service-based separation of concerns:

```
src/
├── api/
│   ├── axiosClient.js          # Centralized Axios instance with 200-business-error interceptor
│   └── services/               # Modular API services per domain
│       ├── authService.js      # /auth/getNames, /auth/getUnits
│       ├── contactService.js   # /cafe/getContactUs*, insert, delete
│       ├── menuService.js      # /menu/getMenuCategories*, getMenus*, insert, update, delete
│       ├── openingHourService.js # /cafe/getOpeningHours*, insert, update, delete
│       ├── reservationService.js # /cafe/getReservation*, insert, delete
│       ├── teamService.js      # /cafe/getTeams*, insert, update, delete
│       ├── testimonialService.js # /cafe/getTestimonials*, insert, update, delete
│       └── index.js            # Barrel export
├── components/
│   ├── common/                 # Reusable UI primitives (Button, Input, Select, Modal, ConfirmDialog, Badge, etc.)
│   ├── website/                # Public website components (Navbar, Footer)
│   └── admin/                  # Admin layout components (AdminSidebar, AdminHeader)
├── context/
│   ├── AuthContext.jsx         # Authentication & staff session state
│   └── ToastContext.jsx        # Notification dispatch system
├── hooks/                      # Custom hooks (useAuth, useToast)
├── layouts/
│   ├── WebsiteLayout.jsx       # Public navigation & footer shell
│   └── AdminLayout.jsx         # Sidebar, header & main container shell
├── pages/
│   ├── website/                # Public pages (HomePage, MenuPage, AboutPage, ReservationPage, ContactPage)
│   ├── admin/                  # Admin modules (Dashboard, Categories, MenuItems, Reservations, Inquiries, Team, etc.)
│   └── NotFoundPage.jsx        # Catch-all 404 page
├── routes/
│   ├── AppRoutes.jsx           # Application routing definitions
│   └── ProtectedRoute.jsx      # Route guard redirecting unauthorized access to /admin/login
└── utils/
    ├── constants.js            # API URLs, routes, test data prefix
    ├── formatters.js           # Date, currency, and string formatters
    └── imageUtils.js           # Base64 image encoding and URL resolver
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd "cafe-management-app"
npm install
```

### 3. Environment Configuration
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Ensure `.env` contains:
```env
VITE_API_BASE_URL=https://mockapi.scalinotechnologies.com/api/v1
VITE_MEDIA_BASE_URL=https://mockapi.scalinotechnologies.com
VITE_APP_NAME="MORROW"
VITE_CANDIDATE_NAME="Adhil EK"
```

### 4. Running the Development Server
```bash
npm run dev
```
The website will be available at `http://localhost:5173`.

### 5. Production Build & Preview
To create an optimized production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🔐 Admin Portal Access

- **Login URL**: `http://localhost:5173/admin/login`
- **Default Credentials**:
  - **Username**: `admin`
  - **Password**: Any password (e.g. `admin123`)
- **Staff Profiles**:
  - The login interface queries `/api/v1/auth/getNames` and provides one-click selector pills for staff roles (*Manager, Barista, Chef, Cashier*).

> **Important Note on Authentication & Security Architecture**:  
> The backend Swagger specification defines **no authentication or authorization endpoints** (such as `/auth/login`, `/auth/token`, or JWT generators). Furthermore, all backend API endpoints remain directly accessible and unauthenticated at the network layer.  
> 
> In strict accordance with the assessment instructions to **never invent fake backend authentication or mock JWTs**, the `/admin/login` interface provides a **client-side demonstration session only**. It loads valid staff names dynamically from `GET /api/v1/auth/getNames` and enforces route-level protection (`ProtectedRoute.jsx`) with persistent local state (`localStorage`) so evaluators can inspect and test the admin dashboard features. No fake backend tokens or credential checks are fabricated.

---

## 🧪 API Verification & Testing Report

Every Swagger endpoint was audited and tested directly against the live backend server using the assessment test prefix `Adhil EK Test`. All test records created during verification were cleanly removed after testing.

| Domain | Endpoint | Method | Live Backend Status | Verified Operations |
|---|---|---|---|---|
| **Auth** | `/auth/getNames` | `GET` | ✅ 200 OK | Fetches registered staff member identities |
| **Auth** | `/auth/getUnits` | `GET` | ✅ 200 OK | Fetches unit definitions (Cup, Plate, etc.) |
| **Menu Categories** | `/menu/getMenuCategories` | `GET` | ✅ 200 OK | Fetches category list |
| **Menu Categories** | `/menu/getMenuCategoryById` | `GET` | ✅ 200 OK | Fetches specific category by ID |
| **Menu Categories** | `/menu/insertMenuCategory` | `POST` | ✅ 200 OK | Creates category (`Name`, `SubText`, `Priority`) |
| **Menu Categories** | `/menu/updateMenuCategory` | `PUT` | ✅ 200 OK | Updates category fields |
| **Menu Categories** | `/menu/deleteMenuCategory/{id}` | `DELETE` | ✅ 200 OK | Deletes category record |
| **Menu Items** | `/menu/getMenus` | `GET` | ✅ 200 OK | Fetches all menu catalog items |
| **Menu Items** | `/menu/getMenuById` | `GET` | ✅ 200 OK | Fetches specific menu item by ID |
| **Menu Items** | `/menu/insertMenu` | `POST` | ✅ 200 OK | Creates dish/drink item |
| **Menu Items** | `/menu/updateMenu` | `PUT` | ✅ 200 OK | Updates item pricing, availability & info |
| **Menu Items** | `/menu/deleteMenu/{id}` | `DELETE` | ✅ 200 OK | Deletes menu item record |
| **Team** | `/cafe/getTeams` | `GET` | ✅ 200 OK | Fetches team roster |
| **Team** | `/cafe/getTeamById` | `GET` | ✅ 200 OK | Fetches team member by ID |
| **Team** | `/cafe/insertTeam` | `POST` | ✅ 200 OK | Creates staff member with base64 image upload |
| **Team** | `/cafe/updateTeam` | `PUT` | ✅ 200 OK | Updates staff member record |
| **Team** | `/cafe/deleteTeam/{id}` | `DELETE` | ✅ 200 OK | Deletes staff member record |
| **Testimonials** | `/cafe/getTestimonials` | `GET` | ✅ 200 OK | Fetches reviews |
| **Testimonials** | `/cafe/getTestimonialById` | `GET` | ✅ 200 OK | Fetches review by ID |
| **Testimonials** | `/cafe/insertTestimonial` | `POST` | ✅ 200 OK | Creates review with rating & customer image |
| **Testimonials** | `/cafe/updateTestimonial` | `PUT` | ✅ 200 OK | Updates review record |
| **Testimonials** | `/cafe/deleteTestimonial/{id}` | `DELETE` | ✅ 200 OK | Deletes review record |
| **Opening Hours** | `/cafe/getOpeningHours` | `GET` | ✅ 200 OK | Fetches schedule slots |
| **Opening Hours** | `/cafe/getOpeningHourById` | `GET` | ✅ 200 OK | Fetches schedule slot by ID |
| **Opening Hours** | `/cafe/insertOpeningHour` | `POST` | ✅ 200 OK | Creates schedule entry (`DayRange`, `TimeRange`, `IsClosed`) |
| **Opening Hours** | `/cafe/updateOpeningHour` | `PUT` | ✅ 200 OK | Updates schedule entry |
| **Opening Hours** | `/cafe/deleteOpeningHour/{id}` | `DELETE` | ✅ 200 OK | Deletes schedule entry |
| **Reservations** | `/cafe/getReservation` | `GET` | ✅ 200 OK | Fetches table bookings list |
| **Reservations** | `/cafe/getReservationById` | `GET` | ✅ 200 OK | Fetches booking by ID |
| **Reservations** | `/cafe/insertReservation` | `POST` | ✅ 200 OK | Creates reservation with date/time formatting |
| **Reservations** | `/cafe/deleteReservation/{id}` | `DELETE` | ✅ 200 OK | Cancels/removes reservation |
| **Contact Inquiries**| `/cafe/getContactUs` | `GET` | ✅ 200 OK | Fetches contact messages |
| **Contact Inquiries**| `/cafe/getContactUsById` | `GET` | ✅ 200 OK | Fetches contact message by ID |
| **Contact Inquiries**| `/cafe/insertContactUs` | `POST` | ✅ 200 OK | Submits message with sanitized ISO date |
| **Contact Inquiries**| `/cafe/deleteContactUs/{id}` | `DELETE` | ✅ 200 OK | Deletes contact message |

---

## ⚠️ Backend Idiosyncrasies & Handled Edge Cases

During integration testing, several backend database constraints and quirks were discovered and engineered around:
1. **HTTP 200 False Successes**:
   The backend API often returns HTTP 200 status codes even when internal operations fail (e.g. `{ "ResponseCode": 500, "Message": "Failed" }` or SQL exceptions). The Axios interceptor in `src/api/axiosClient.js` inspects `ResponseCode` and `Message === 'Failed'` to reject these responses as business errors.
2. **Database NOT NULL Constraints**:
   - `Barista_MenuCategory` requires `SubText` not to be null.
   - `Barista_Menu` requires `Description` not to be null.
   - `Barista_Team` requires `ImagePath` not to be null (handled by providing a default base64 transparent canvas or file upload).
   - `Barista_Testimonials` requires `CustomerName` (not `Name`).
3. **Date/Time Formatting for SQL Server**:
   `insertReservation` and `insertContactUs` fail if ISO timestamps contain milliseconds (e.g. `.123Z`). Formatted to `YYYY-MM-DDTHH:mm:ss` before dispatching.
4. **Missing PUT Endpoints in Swagger**:
   The Swagger API does not provide update endpoints for Reservations or Contact Inquiries. Those modules feature complete list, view, and deletion workflows as supported by the backend.

---

## 📄 License & Assessment Information

- **Candidate**: Adhil EK
- **Framework**: React 18 SPA
- **Assessment Scope**: 3-Day Technical Machine Test
