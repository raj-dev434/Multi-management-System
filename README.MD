# Multi-Management System

## Overview
This project is a multi-module Spring Boot application designed to handle efficient management of various domains including **Mechanical Stock**, **Badminton Club Operations**, and **Employee Costs**. It features a centralized authentication system and reporting capabilities.

## 🏗 Project Structure

The project follows a localized package structure where each module handles its own Entity, Repository, Service, and Controller layers.

```
com.company.dashboard
├── DashboardApplication.java
│
├── auth                          # Authentication & Security
│   ├── entity
│   │   └── Admin.java
│   ├── repository
│   │   └── AdminRepository.java
│   ├── controller
│   │   └── AuthController.java
│   ├── security
│   │   ├── JwtUtil.java
│   │   ├── JwtFilter.java
│   │   └── SecurityConfig.java
│   └── service
│       └── AuthService.java
│
├── stock                         # Mechanical Stock Module
│   ├── entity
│   │   ├── Item.java
│   │   ├── StorageLocation.java
│   │   ├── StorageStock.java
│   │   ├── Party.java
│   │   └── StockMovement.java
│   ├── repository
│   │   ├── ItemRepository.java
│   │   ├── StorageLocationRepository.java
│   │   ├── StorageStockRepository.java
│   │   ├── PartyRepository.java
│   │   └── StockMovementRepository.java
│   ├── service
│   │   └── StockService.java
│   └── controller
│       └── StockController.java
│
├── badminton                     # Badminton Module
│   ├── entity
│   │   ├── BadmintonStock.java
│   │   └── PlayerFee.java
│   ├── repository
│   │   ├── BadmintonStockRepository.java
│   │   └── PlayerFeeRepository.java
│   ├── service
│   │   └── PlayerFeeService.java
│   └── controller
│       └── PlayerController.java
│
├
│
├── report                        # Reporting APIs
│   ├── service
│   │   └── ReportService.java
│   └── controller
│       └── ReportController.java
│
└── common                        # Shared Utilities
    ├── dto
    │   ├── StockRequestDTO.java
    │   ├── StockResponseDTO.java
    │   └── ReportResponseDTO.java
    ├── exception
    │   ├── GlobalExceptionHandler.java
    │   └── ResourceNotFoundException.java
    └── utils
        └── DateUtil.java
```

##  Database Design

### 1. Mechanical Stock Module

## 🗄️ Database Setup

For running locally or on a new machine, you need a PostgreSQL instance.

1.  **Create Database**:
    Run the following SQL command or use the provided script at `database/setup.sql`:
    ```sql
    CREATE DATABASE "MultiManagement";
    ```
2.  **Credentials**:
    The application is configured to use the following default credentials (in `src/main/resources/application.properties`):
    *   **Username**: `postgres`
    *   **Password**: `postgres`
    *   **Port**: `5432`

3.  **Schema**:
    Spring Boot is configured with `spring.jpa.hibernate.ddl-auto=update`. It will automatically create the required tables when the application starts.

### 1. Mechanical Stock Module
Designed to track inventory across specific physical locations (e.g., Racks).

**Core Workflow:**
- **Items** are defined globally.
- Items are assigned to a **Storage Location** (creating a `StorageStock` record).
- **Stock Movements** (IN/OUT) update the `StorageStock`.
- **Parties** (Suppliers/Customers) are linked to movements.

#### Schema Definitions

**`storage_location`**
*Stores physical location details.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `location_type` | Enum | `RACK` or `GROUND` |
| `location_name` | String | Name of the location |
| `rack_number` | Integer | (Nullable) Specific rack number |

**`item`**
*Master definition of products/items.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `item_name` | String | Name of the item |
| `category` | String | Item category |
| `unit` | String | Unit of measurement |

**`storage_stock`**
*Junction table linking Items to Locations with current inventory counts.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `storage_location_id` | FK | Link to Storage Location |
| `item_id` | FK | Link to Item |
| `current_quantity` | Double | Current stock level |

**`party`**
*External entities involved in transactions.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `name` | String | Party Name |
| `type` | Enum | `SUPPLIER` or `CUSTOMER` |
| `location` | String | City or Region |
| `email` | String | Contact Email |
| `address` | String | Full Address |

**`stock_movement`**
*Ledger for all inventory changes.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `storage_stock_id` | FK | Link to the specific stock entry being moved |
| `movement_type` | Enum | `IN` or `OUT` |
| `quantity` | Double | Amount moved |
| `movement_date` | Date | Date of transaction |
| `party_id` | FK | Related Supplier or Customer |
| `remarks` | String | Optional notes |
| `employee_name` | String | Staff handling the movement |

---

### 2. Badminton Module

**`badminton_stock`**
*Inventory for badminton equipment.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `item_name` | String | Name of the equipment |
| `quantity` | Integer | Available quantity |
| `details` | String | Additional details |

**`player_fee`**
*Tracking player payments and sessions.*
| Column | Type | Description |
|--------|------|-------------|
| `id` | PK | Unique Identifier |
| `player_name` | String | Name of the player |
| `amount` | Double | Fee paid |
| `payment_date` | Date | Date of payment |
| `month` | String | Month covered |
| `year` | Integer | Year covered |
| `status` | String | PAID / PENDING |
| `fee_type` | String | BATCH / GUEST / COACHING |
| `duration_hours` | Double | (Guest) Duration in hours |
| `court_number` | String | (Guest) Court assigned |

---

### 3. Employee Module

**`employee_cost`**
*Tracks employee-related expenses and future attendance costs.*

---

### 4. Authentication Module (Core)
* **Security**: Implements JWT (JSON Web Token) filters and Security Configuration.

---

##  Frontend Application

The frontend is a modern, responsive single-page application built to interact with the backend APIs.

### 🛠 Technology Stack
*   **Core**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: Vanilla CSS with Glassmorphism design system.
*   **Routing**: `react-router-dom`
*   **Icons**: `lucide-react`
*   **Charts**: `recharts`
*   **HTTP Client**: `axios`

###  Project Structure
```
frontend
├── src
│   ├── components      # Reusable UI components (Navbar, etc.)
│   ├── pages           # Main Views
│   │   ├── Login.jsx       # Authentication Page
│   │   ├── Dashboard.jsx   # Main Overview with Widgets
│   │   ├── Stocks.jsx      # Mechanical Stock Management
│   │   ├── Badminton.jsx   # Badminton Inventory & Fee Collection
│   │   └── Reports.jsx     # Data visualization & Reports
│   ├── App.jsx         # Routing Configuration
│   ├── api.js          # Axios Interceptor setup
│   └── index.css       # Global Styles & Glassmorphism Tokens
└── package.json
```

###  Key Features
1.  **Dashboard**:
    *   Visual summary of Low Stock items.
    *   Recent Activity feed.
    *   Quick navigation to modules.
2.  **Stock Management**:
    *   **Unified View**: Manage Items, Racks, Parties (Suppliers/Customers) in one place.
    *   **Batch Movements**: Add multiple items to a "Cart" and perform a bulk STOCK IN/OUT transaction.
    *   **Search History**: dedicated tab to search past movements.
3.  **Badminton Module**:
    *   **Inventory**: Track rackets, shuttles, etc.
    *   **Fee Collection**: Handle Monthly Fees, Guest Rentals (by hour/court), and Coaching fees.
    *   **Income Tracker**: Real-time total income display.
4.  **Reports**:
    *   Visual charts for Stock Trends and Fee Collection.

###  Setup & Running
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The app will maintain a proxy to the backend running at `http://localhost:8080`.

