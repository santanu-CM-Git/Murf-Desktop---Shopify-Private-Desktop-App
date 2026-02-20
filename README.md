# Murf Desktop - Demo Version

## Overview

Murf Desktop is an Electron-based desktop application that integrates with Shopify stores to manage orders, employees, departments, account mappings, and export data to various formats including Excel and QuickBooks. This is a demo version showcasing the project structure and architecture.

**Note:** This is a demo version. The full implementation code has been removed for copy protection. Only code structure and documentation are provided.

## Project Architecture

### Technology Stack

- **Frontend**: React 19 with Redux Toolkit, React Router, TailwindCSS
- **Backend**: Django REST Framework with JWT Authentication
- **Desktop Framework**: Electron
- **Database**: SQLite (default Django database)
- **API Integration**: Shopify GraphQL/REST API

### Project Structure

```
murf-desktop/
├── main.js                 # Electron main process
├── preload.js              # Electron preload script
├── renderer.js             # Electron renderer process
├── package.json            # Root package.json
├── murf_panel/            # Django backend
│   ├── manage.py
│   ├── murf_panel/        # Django project settings
│   ├── shop_api/          # Main API application
│   │   ├── models/        # Database models
│   │   ├── serializers/   # DRF serializers
│   │   ├── views/         # API view classes
│   │   └── urls.py        # API URL routing
│   ├── frontend/          # Django frontend app (serves React)
│   └── requirements.txt   # Python dependencies
└── murf_panel/frontend/   # React frontend
    ├── src/
    │   ├── Pages/         # React page components
    │   ├── components/    # Reusable React components
    │   ├── services/      # API service layer
    │   └── app.js         # Main React router
    └── package.json       # Frontend dependencies
```

## Features

### 1. Order Management
- Fetch orders from Shopify stores
- Filter orders by date, status, and other criteria
- View current month sales analytics
- Export orders to Excel format
- Export orders to QuickBooks format
- Sales analytics by city and product

### 2. Employee Management
- Create, read, update, and delete employees
- Assign employees to departments
- Employee listing with pagination

### 3. Department Management
- Create, read, update, and delete departments
- Hierarchical department structure

### 4. Account Mapping
- Map Shopify accounts to accounting systems
- Hierarchical account structure with parent-child relationships
- Support for payment methods and tags

### 5. Source Name Mapping
- Map source names for order tracking
- Custom key-value mappings

### 6. Shopify Store Integration
- Connect multiple Shopify stores
- Set primary store for operations
- Store authentication management

### 7. Data Export
- Export orders to Excel with custom formatting
- Export orders to QuickBooks format
- Custom formatting options

### 8. Analytics & Charts
- Monthly sales charts
- Product sales pie charts
- Sales by city bar charts
- Dashboard with key metrics

## API Routes

### Base URL
All API routes are prefixed with `/api/`

### Authentication Endpoints

#### POST `/api/token`
Obtain JWT access and refresh tokens
- **Request Body**: `{ "username": "string", "password": "string" }`
- **Response**: `{ "status": "success", "data": { "access_token": "...", "refresh_token": "..." } }`

#### POST `/api/token/refresh`
Refresh access token using refresh token
- **Request Body**: `{ "refresh": "refresh_token_string" }`
- **Response**: `{ "status": "success", "data": { "access_token": "...", "refresh_token": "..." } }`

#### GET `/api/profile`
Get authenticated user profile data
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: `{ "status": "success", "data": { "username": "...", "email": "...", ... } }`

#### POST `/api/change-password`
Change user password
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: `{ "currentPassword": "...", "newPassword": "..." }`

### Order Endpoints

#### GET `/api/orders`
Fetch orders from Shopify
- **Query Parameters**:
  - `limit`: Number of orders to fetch (default: 50)
  - `page_info`: Pagination cursor
  - `filter`: JSON string with filter criteria
- **Response**: List of orders with pagination info

#### GET `/api/orders/total`
Get total order count
- **Response**: `{ "total": number }`

#### GET `/api/orders/current-month-sale`
Get current month sales analytics
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**: `filterBy` (monthly_sales, sales_by_city, product_sales)
- **Response**: Sales data based on filter type

#### POST `/api/orders/export-orders-excel`
Export orders to Excel format
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: Order filter criteria
- **Response**: Excel file download

#### POST `/api/orders/export-orders-qb`
Export orders to QuickBooks format
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: Order filter criteria
- **Response**: QuickBooks file download

### Department Endpoints

#### GET `/api/departments`
List all departments
- **Response**: `{ "status": "success", "data": [...] }`

#### POST `/api/departments`
Create a new department
- **Request Body**: `{ "name": "string" }`
- **Response**: `{ "status": "success", "data": {...} }`

#### GET `/api/departments/<id>`
Get department by ID
- **Response**: `{ "status": "success", "data": {...} }`

#### PUT `/api/departments/<id>`
Update department
- **Request Body**: `{ "name": "string" }`
- **Response**: `{ "status": "success", "data": {...} }`

#### DELETE `/api/departments/<id>`
Delete department
- **Response**: `{ "status": "success", "message": "..." }`

### Staff/Employee Endpoints

#### GET `/api/staff`
List all staff members
- **Response**: `{ "status": "success", "data": [...] }`

#### POST `/api/staff`
Create a new staff member
- **Request Body**: `{ "name": "string", "email": "string", "department": id }`
- **Response**: `{ "status": "success", "data": {...} }`

#### GET `/api/staff/<id>`
Get staff member by ID
- **Response**: `{ "status": "success", "data": {...} }`

#### PUT `/api/staff/<id>`
Update staff member
- **Request Body**: `{ "name": "string", "email": "string", "department": id }`
- **Response**: `{ "status": "success", "data": {...} }`

#### DELETE `/api/staff/<id>`
Delete staff member
- **Response**: `{ "status": "success", "message": "..." }`

### Account Mapping Endpoints

#### GET `/api/account-mappings`
List all account mappings
- **Response**: `{ "status": "success", "data": [...], "total": number }`

#### POST `/api/account-mappings`
Create account mapping
- **Request Body**: `{ "account": number, "payment_method": "string", "full_name": "string", "type": "string", "tags": [...], "parent": id }`
- **Response**: `{ "status": "success", "data": {...} }`

#### GET `/api/account-mappings/<id>`
Get account mapping by ID
- **Response**: `{ "status": "success", "data": {...} }`

#### PUT `/api/account-mappings/<id>`
Update account mapping
- **Request Body**: Account mapping fields
- **Response**: `{ "status": "success", "data": {...} }`

#### DELETE `/api/account-mappings/<id>`
Delete account mapping
- **Response**: `{ "status": "success", "message": "..." }`

### Shopify Store Endpoints

#### GET `/api/stores`
List all Shopify stores for authenticated user
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: List of stores

#### POST `/api/stores`
Add a new Shopify store
- **Headers**: `Authorization: Bearer <access_token>`
- **Request Body**: `{ "store_url": "string", "admin_api_key": "string" }`
- **Response**: Store object

#### PATCH `/api/stores/<id>/set_primary/`
Set a store as primary
- **Headers**: `Authorization: Bearer <access_token>`
- **Response**: Updated store object

### Source Name Mapping Endpoints

#### GET `/api/source-name-mappings`
List all source name mappings
- **Response**: `{ "status": "success", "data": [...] }`

#### POST `/api/source-name-mappings`
Create source name mapping
- **Request Body**: `{ "key": "string", "value": "string" }`
- **Response**: `{ "status": "success", "data": {...} }`

#### GET `/api/source-name-mappings/<id>`
Get source name mapping by ID
- **Response**: `{ "status": "success", "data": {...} }`

#### PUT `/api/source-name-mappings/<id>`
Update source name mapping
- **Request Body**: Mapping fields
- **Response**: `{ "status": "success", "data": {...} }`

#### PATCH `/api/source-name-mappings/<id>`
Partially update source name mapping
- **Request Body**: Partial mapping fields
- **Response**: `{ "status": "success", "data": {...} }`

#### DELETE `/api/source-name-mappings/<id>`
Delete source name mapping
- **Response**: 204 No Content

## Frontend Routes

### Public Routes
- `/login` - Login page

### Protected Routes (require authentication)
- `/` - Dashboard/Home page
- `/chart` - Charts and analytics page
- `/export` - Export orders page
- `/export/formatting-page` - Order formatting configuration
- `/employees` - Employee management page
- `/departments` - Department management page
- `/account-mapping` - Account mapping page
- `/source-mapping` - Source name mapping page
- `/settings` - Application settings page

### Error Routes
- `/403` - Forbidden error page
- `/404` - Not found error page
- `/500` - Server error page

## Major Functions & Components

### Backend Functions

#### Shopify Service (`shop_api/shopify_service.py`)
- `activate_shopify_session()` - Initialize Shopify API session
- `execute_graphql_query()` - Execute GraphQL queries on Shopify
- `get_orders()` - Fetch orders from Shopify with pagination
- `get_all_orders()` - Fetch all orders with filtering
- `get_monthly_sales()` - Calculate monthly sales data
- `get_sales_by_city()` - Calculate sales grouped by city
- `get_product_sales()` - Calculate product sales statistics
- `export_orders_to_excel()` - Export orders to Excel format
- `export_orders_to_qb()` - Export orders to QuickBooks format

#### Order Views (`shop_api/views/orders.py`)
- `OrderListView` - List and filter orders
- `OrderCountView` - Get total order count
- `CurrentMonthSaleAPIView` - Get sales analytics
- `ExportOrdersView` - Export orders to Excel
- `QBExportOrdersView` - Export orders to QuickBooks

#### Authentication Views (`shop_api/views/users.py`)
- `CustomTokenObtainPairView` - Custom JWT token obtain view
- `CustomTokenRefreshView` - Custom JWT token refresh view
- `UserDataView` - Get authenticated user data
- `ChangePasswordView` - Change user password

### Frontend Components

#### Pages (`src/Pages/`)
- `HomePage` - Dashboard with sales charts and metrics
- `LoginPage` - User authentication page
- `ChartPage` - Advanced charts and analytics
- `ExportPage` - Order export interface
- `FormattingPage` - Order formatting configuration
- `EmployeePage` - Employee CRUD operations
- `DepartmentPage` - Department CRUD operations
- `AccountMappingPage` - Account mapping management
- `SourceMappingPage` - Source name mapping management
- `SettingsPage` - Application settings

#### Components (`src/components/`)
- `DefaultLayout` - Main layout wrapper with sidebar and header
- `Sidebar` - Navigation sidebar component
- `Header` - Top header bar with user menu
- `GlobalModal` - Reusable modal dialog component
- `LoadingComponent` - Loading spinner component
- `ErrorComponent` - Error display component
- `DateComponent` - Date picker component
- `DeleteModal` - Confirmation modal for deletions
- `AddAccountMappingModal` - Modal for adding account mappings
- `AddDepartmentModal` - Modal for adding departments
- `AddSourceMappingModal` - Modal for adding source mappings
- `AddEmployeesModal` - Modal for adding employees
- `LogoutModal` - Logout confirmation modal

#### Services (`src/services/`)
- `order.js` - Order API service with RTK Query
- `user.js` - User authentication service
- `staff.js` - Staff/employee API service
- `accountMapping.js` - Account mapping API service
- `authSlice.js` - Redux slice for authentication state
- `modalSlice.js` - Redux slice for modal state
- `redirectSlice.js` - Redux slice for redirect logic
- `apiConfigs.js` - API configuration
- `dbConfig.js` - Database configuration

## Database Models

### User Model
- Standard Django user model with username, email, password

### Department Model
- `id` - Primary key
- `name` - Department name (unique)

### Staff Member Model
- `id` - Primary key
- `name` - Staff member name
- `email` - Email address
- `department` - Foreign key to Department

### Account Mapping Model
- `id` - Primary key
- `account` - Account number (unique)
- `payment_method` - Payment method string
- `full_name` - Full account name
- `type` - Account type
- `tags` - JSON array of tags
- `parent` - Self-referential foreign key for hierarchy

### Shopify Store Model
- `id` - Primary key
- `user` - Foreign key to User
- `store_url` - Shopify store URL
- `admin_api_key` - Shopify admin API key
- `is_primary` - Boolean flag for primary store

### Source Name Mapping Model
- `id` - Primary key
- `key` - Source key (unique)
- `value` - Source value

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
1. Navigate to `murf_panel/` directory
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Create superuser: `python manage.py createsuperuser`

### Frontend Setup
1. Navigate to `murf_panel/frontend/` directory
2. Install dependencies: `npm install`
3. Build for production: `npm run build`
4. Development mode: `npm run dev`

### Electron Setup
1. Install root dependencies: `npm install`
2. Start Electron app: `npm start`
3. Package for distribution: `npm run package`

## Important Notes

### Demo Version Limitations
- This is a demo version with implementation code removed
- The project structure is visible but functionality is disabled
- Sensitive business logic and API integrations are not included
- Database models and API routes are documented but not fully implemented

### Security Considerations
- JWT tokens are used for authentication
- API keys and secrets should be stored in environment variables
- Shopify API keys are stored encrypted in the database
- CORS and CSRF protection are configured

### Development Notes
- The app uses Electron Forge for packaging
- Django serves the React frontend in production
- Webpack is used for frontend bundling
- Redux Toolkit with RTK Query for state management

## License

This is a demo version. Full source code is proprietary.

## Contact

For inquiries about the full version, please contact the development team.
