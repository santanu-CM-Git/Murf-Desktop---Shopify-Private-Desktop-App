# Murf Electric Bikes (Desktop Application)

## About Project

- Murf Desktop is an Electron-based desktop application that integrates with Shopify stores to manage orders, employees, departments, account mappings, and export data to various formats including Excel and QuickBooks.

## Technology Stack

- **Frontend**: React 19 with Redux Toolkit, React Router, TailwindCSS
- **Backend**: Django REST Framework with JWT Authentication
- **Desktop Framework**: Electron
- **API Integration**: Shopify GraphQL/REST API


## The client

- An operations and finance group runs more than one Shopify store. They need a repeatable way to export orders and settlements-related data, analyze revenue and fees in Excel with pivot tables, and post summarized activity into QuickBooks as journal entries—without manual copy-paste for every store every month.

## The Solution

    1. Order Management
    - Fetch orders from Shopify stores
    - Filter orders by date, status, and other criteria
    - View current month sales analytics
    - Export orders to Excel format
    - Export orders to QuickBooks format
    - Sales analytics by city and product

    2. Employee Management
    - Assign employees to departments
    - Employee listing with pagination


    3. Shopify Store Integration
    - Connect multiple Shopify stores
    - Set primary store for operations
    - Store authentication management

    4. Data Export
    - Export orders to Excel with custom formatting
    - Export orders to QuickBooks format
    - Custom formatting options

    5. Analytics & Charts
    - Monthly sales charts
    - Product sales pie charts
    - Sales by city bar charts
    - Dashboard with key metrics


## The results
- Finance and operations could connect multiple Shopify stores in one place and get period-close exports on a fixed schedule, with clear file names and version history for easy tracking.
- Analysts used Microsoft Excel pivot tables on the exported data to view revenue by store, product, payment gateway, and location without checking Shopify again for every new question.
- Month-end journal entries in QuickBooks matched the Shopify orders and payouts after proper mapping and checking—saving time, reducing manual entries, and keeping a clear record from export to final entry.
