# TransitOps - Fleet Management ERP

![TransitOps](https://img.shields.io/badge/Odoo-Hackathon%202026-714B67?style=for-the-badge&logo=odoo) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

TransitOps is a modern, production-ready Fleet Management Enterprise Resource Planning (ERP) system designed and engineered for the **Odoo × Adamas University Hackathon 2026**. 

Built with an emphasis on **clean architecture, strict business logic, robust validation, and enterprise-grade UI**, TransitOps provides end-to-end management of vehicles, drivers, trips, maintenance, and financials with advanced Role-Based Access Control (RBAC).

---

## 🌟 Key Features

- **🛡️ Advanced RBAC**: Dynamic access control and customized settings for Admin, Fleet Manager, Dispatcher, Safety Officer, and Financial Analyst roles.
- **🚐 Fleet Registry & Dispatch**: Real-time vehicle availability, driver tracking, and trip dispatch workflows with stringent state validations.
- **🔧 Maintenance Operations**: Comprehensive service history, priority repairs, and technician assignments.
- **⛽ Fuel & Expense Tracking**: Deep financial telemetry, cost per kilometer tracking, and categorical budget analysis.
- **📊 Business Intelligence**: Interactive charts and analytics dashboards utilizing `Recharts` for actionable operational insights.
- **📄 Enterprise PDF Export**: Built-in reporting engine using `jspdf` for generating styled, multi-page, and role-specific reports directly from the frontend (no browser print dialogs).
- **🌗 Theming**: Seamless dark and light mode utilizing Tailwind CSS.
- **🔒 Security First**: JWT authentication, bcrypt password hashing, parameterized SQL queries, and robust API validation.

---

## 🏗️ Architecture

TransitOps enforces a strict separation of concerns following a precise clean architecture pattern on the backend and a feature-first approach on the frontend.

### Backend (Node.js / Express)
The backend routes requests through a strictly layered architecture to ensure maintainability and testability:
`Routes -> Controllers -> Services -> Repositories -> MySQL`
- **Controllers** handle HTTP requests and responses.
- **Services** encapsulate *all* business logic and transaction integrity.
- **Repositories** handle pure database interactions.

### Frontend (React / Vite)
A modular and highly reusable component architecture utilizing React 19, React Router, and Tailwind CSS. Forms are rigorously validated using `react-hook-form` and `Zod`.

---

## 💻 Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State & Data**: Context API, Axios
- **Forms & Validation**: React Hook Form, Zod
- **UI & Icons**: Lucide React, Recharts
- **PDF Generation**: jspdf, jspdf-autotable

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MySQL (using `mysql2`)
- **Security**: JWT, bcrypt, helmet, cors
- **File Uploads**: multer
- **Logging**: morgan

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server

### 1. Database Setup
Ensure your MySQL server is running. Create a new database for TransitOps (e.g., `transitops_db`). The application uses exactly 10 strictly relational tables.

### 2. Backend Setup
```bash
cd server
npm install
```
Configure your environment variables in `server/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=transitops_db
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Configure your environment variables in `client/.env` (if applicable) and start the Vite dev server:
```bash
npm run dev
```


---

## 📑 Business Modules

1. **Authentication**: Secure login and session management.
2. **Dashboard**: High-level KPI summaries and quick actions.
3. **Vehicles**: Asset tracking, registration, and capacity rules.
4. **Drivers**: Personnel management and license validations.
5. **Trips**: Dispatch logic, enforcing driver/vehicle availability.
6. **Maintenance**: Lifecycle management of vehicle servicing.
7. **Fuel**: Logging fuel consumption and mileage tracking.
8. **Expenses**: Categorized operational cost tracking.
9. **Analytics**: Data visualization for operational efficiency.
10. **Settings**: Role-aware configuration console.

---

## 🎨 UI/UX Design System
The frontend adheres to professional ERP design principles:
- **No Placeholder Text**: Context-aware guidance in empty states.
- **Consistent Typographical Hierarchy**: Clean, readable fonts with standardized sizing.
- **Reusable Components**: Buttons, Cards, Inputs, Modals, SearchBars, and DataTables are centralized in the `src/components` directory.
- **Strict Visual Alignment**: Flawless paddings, margins, and icon alignments.

---


Developed with precision for the **Odoo × Adamas University Hackathon 2026**.
