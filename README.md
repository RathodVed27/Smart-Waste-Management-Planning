# Smart Waste Management Planning

## Smart India Hackathon 2026

**Problem Statement ID:** 8-L  
**Problem Statement:** Smart Waste Management Planning  
**Theme:** Smart Cities / Sustainable Development  
**Category:** Software  
**Team Name:** QuantumX  
**Team ID:** 98_QuantumX  

---

## 📌 Project Objective

Smart Waste Management Planning is a role-based platform designed to make municipal waste collection more efficient, proactive, and transparent.

The system connects the complete workflow:

> **Citizen Report → Priority Assessment → Risk Prediction → Route Optimization → Driver Collection → Proof of Clearance → Administrative Monitoring**

The goal is to help municipalities prioritize urgent waste issues, optimize collection routes, monitor operations, and improve decision-making.

---

## ✨ Key Features

### 👤 Citizen
- Report waste issues with photo and location
- Select waste category
- Track report status
- View collection activity

### 🚛 Driver Worker
- View assigned collection route
- View pending and priority stops
- Complete collection stops
- Upload proof of clearance
- View route optimization details

### 🗺️ Ward Admin
- Monitor active waste issues and vehicles
- View live maps and route progress
- Manage smart priority queue
- View predictive waste-risk hotspots
- Monitor ward health

### 🏛️ Municipal Head
- View city-wide reports and analytics
- Compare ward health
- Monitor resolution performance
- View route optimization impact

### ⚡ Smart Features
- Priority-based waste management
- Distance-based route optimization
- Dynamic vehicle assignment
- Predictive hotspot visualization
- Simulated live vehicle tracking
- Proof of clearance workflow

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Maps:** Leaflet, React Leaflet
- **Charts:** Recharts
- **UI:** Lucide React, Framer Motion

---

## 📂 Project Structure

```text
src/
├── components/
├── data/
├── layouts/
├── pages/
│   ├── citizen/
│   ├── driver/
│   ├── admin/
│   └── superadmin/
├── App.tsx
└── main.tsx

## ⚙️ Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Hackathon-LDRP/smart-waste-management-planning.git
```

### 2. Open the Project Folder

```bash
cd smart-waste-management-planning
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Project

```bash
npm run dev
```

Open the URL shown by Vite in your browser.

### Build for Production

```bash
npm run build
```

---

## 🔐 Demo Credentials

| Role | Staff ID | Password |
|---|---|---|
| Driver Worker | `DRV-4321` | `demo123` |
| Ward Admin | `WARD-42` | `demo123` |
| Municipal Head | `MUNICIPAL-HQ` | `demo123` |

> The Citizen module can be accessed without login.

---

## 📊 Current Implementation Status

### Implemented

- Citizen waste reporting
- Photo upload and browser location support
- Report tracking
- Role-based dashboards
- Priority scoring and priority queue
- Dynamic vehicle assignment
- Route optimization and route updates
- Driver collection workflow
- Proof of clearance
- Interactive maps
- Predictive risk heatmap interface
- Simulated vehicle tracking
- Ward and municipal analytics
