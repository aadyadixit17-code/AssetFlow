AssetFlow 🏢📦
Enterprise Asset & Resource Management System

AssetFlow is a centralized Enterprise Resource Planning (ERP) platform designed to digitize and streamline how organizations track, allocate, and maintain their physical assets and shared resources. By removing manual spreadsheets and paper logs, it provides structured asset lifecycles, real-time tracking, time-slot resource bookings, and secure role-based workflows.

📸 Application Previews
<p align="center">
    <img src="path/to/login page.png" alt="Image Description" width="80%">
  </a>
</p>
<p align="center">
    <img src="path/to/Signup page.png" alt="Image Description" width="80%">
  </a>
</p>
📂 Project Structure
Plaintext
AssetFlow/
├── backend/
│   ├── config/              # Database and environment configurations
│   ├── controllers/         # Business logic for assets, auth, bookings, etc.
│   ├── middleware/          # Security and authentication middleware
│   ├── models/              # Database schemas (Asset, Booking, User, etc.)
│   └── routes/              # API routing endpoints
├── frontend/
│   ├── public/              # Static assets and icons
│   └── src/
│       ├── assets/          # Images and frontend media
│       ├── components/      # Reusable UI components (Sidebar, etc.)
│       ├── context/         # Application state management
│       └── pages/           # View screens (Dashboard, Registry, Setup, etc.)
└── package.json
🚀 Core Features
Secure Authentication: Role-secure backend with session validation and email/password login.

Centralized Dashboard: Real-time KPI summaries tracking available/allocated assets, maintenance requests, and active bookings.

Organization Master Setup: Manage departments, custom asset categories, and employee directories from a unified control center.

Asset Lifecycle Management: Track items through status changes like Available, Allocated, Reserved, Under Maintenance, Lost, Retired, and Disposed.

Conflict-Free Allocations: Prevent double-allocations with automated tracking and seamless transfer request workflows.

Time-Slot Resource Booking: Avoid schedule clashes for shared rooms or equipment with calendar overlap validation.

Maintenance Workflows: Multi-step repair management routing requests through approvals before updating asset statuses.

Periodic Audits: Assigned verification cycles that automatically compile discrepancy reports.

🛠️ Installation & Getting Started
1. Clone the Repository
Bash
git clone https://github.com/yourusername/AssetFlow.git
cd AssetFlow
2. Configure Environment Variables
Set up your backend environment file inside the backend/ directory with your database paths and API credentials.

3. Install & Run Dependencies
Backend Setup:

Bash
cd backend
npm install
npm start
Frontend Setup:

Bash
cd ../frontend
npm install
npm run dev
