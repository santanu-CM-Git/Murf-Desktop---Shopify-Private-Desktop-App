# Murf Electric Bikes (Desktop Application) case study

## About project

Murf Desktop is an Electron-based desktop application that integrates with Shopify stores to manage orders, employees, departments, account mappings, and export data to Excel and QuickBooks.

## Problem

Operations and finance teams running multiple Shopify stores face repetitive manual work: pulling orders and settlement-related data store by store, rebuilding pivot analyses in Excel, and posting month-end journal entries into QuickBooks without a repeatable, auditable pipeline from Shopify to the general ledger.

## Technology stack

- **Frontend:** React 19 with Redux Toolkit, React Router, TailwindCSS
- **Backend:** Django REST Framework with JWT authentication
- **Desktop framework:** Electron
- **API integration:** Shopify GraphQL/REST API

## The client

An operations and finance group running more than one Shopify store. They need repeatable exports of orders and settlements-related data, Excel pivot analysis of revenue and fees, and summarized QuickBooks journal entries—without manual copy-paste for every store every month.

## The solution

1. **Order management** — Fetch and filter orders; view current-month sales analytics; export to Excel and QuickBooks; sales analytics by city and product.
2. **Employee management** — Assign employees to departments with paginated listings.
3. **Shopify store integration** — Connect multiple stores, set a primary store, manage authentication.
4. **Data export** — Excel and QuickBooks exports with custom formatting.
5. **Analytics & charts** — Monthly sales, product pie charts, sales by city, dashboard metrics.

## Result

- Finance and operations connect multiple Shopify stores in one place and run period-close exports on a fixed schedule with clear file names and version history.
- Analysts use Excel pivot tables on exported data for revenue by store, product, gateway, and location without re-querying Shopify for every question.
- Month-end QuickBooks journal entries align with Shopify orders and payouts after mapping and checks—less manual entry and a clear trail from export to posted entry.
