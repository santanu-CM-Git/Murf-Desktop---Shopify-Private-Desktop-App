# Case studies

---

## Case study: Delivering a native desktop shell around a local web application

**CASE STUDY**

### The client

A product team needed a **desktop application** that would give users a familiar installable experience while reusing an existing **web-based panel** and backend workflows. The goal was to ship **Murf Desktop** as a branded Windows (and distributable) app—not a browser tab—with reliable startup, logging, and updates.

### The challenges

The team had a working **Django-served UI** and frontend assets, but a desktop product introduces constraints a pure web deployment does not:

- **Electron** is not a drop-in host: the shell must orchestrate **process lifecycle**, **security-oriented web preferences** (for example context isolation and no direct Node in the renderer), and graceful failure when the embedded server does not come up.
- The application expected a **local application server** on a fixed port; the desktop shell had to **start that server**, wait until it responded, then **load the main URL**—any gap here surfaces as a blank window or confusing errors for end users.
- **Packaging and distribution** (installers, artifacts, publishing) had to be repeatable; **auto-update** expectations had to be balanced with tokens, channels, and release hygiene outside the case study document.
- **Platform expectations** (window sizing, menus, log access from the Help menu, notifications) needed to match what users expect from a desktop app, not a generic browser bookmark.

### Technology stack

Electron · Electron Forge · Django (local app server) · HTML / CSS / JavaScript (renderer and loading UI) · Node.js · electron-log · update-electron-app (where configured)

### Solutions we offered

We treated the Electron **main process** as the orchestration layer: create a **BrowserWindow** with safe defaults, show a **dedicated loading screen**, then run structured **setup checks** before attempting to start the embedded server.

A **project lead–style implementation plan** was reflected in the codebase path: document outcomes for startup failure modes, keep **logging** centralized, and only navigate to `http://127.0.0.1:8000` after the server was verified responsive—reducing “it works on my machine” surprises for packaged builds.

**Frontend and packaging** were aligned through the workspace layout (`murf_panel/frontend`) and Forge makers so **build**, **package**, and **make** flows stay consistent for the team shipping installers.

### The results

**First**  
Stakeholders could see a **clear startup narrative**: loading messages, explicit errors when the server or load step fails, and a path to **log files** from the application menu—so support and QA could reproduce issues without guessing.

**Second**  
The product ships as **Murf Desktop** with a **native window**, application menu, and **icon branding**, while still leveraging the existing **Django-backed** experience inside the window once the local server is ready.

**Third**  
The repository is structured for **continuous delivery habits**: versioned desktop releases, Forge-based artifacts, and room to tighten **auto-update** and signing practices as the program matures—without rewriting the entire stack.

---

## Case study: Multi-store Shopify orders, Excel pivot analysis, and QuickBooks journal entries

**CASE STUDY**

### The client

An **operations and finance** group runs **more than one Shopify store** (regions, brands, or channels). They need a repeatable way to **export orders and settlements-related data**, analyze revenue and fees in **Excel with pivot tables**, and post summarized activity into **QuickBooks as journal entries**—without manual copy-paste for every store every month.

### The challenges

- **Multiple Shopify connections**: each store has its own **Admin API credentials**, scopes, and rate limits; exports must be **scheduled or on-demand** per store without mixing stores in a way that breaks reconciliation.
- **Order export shape**: raw order JSON is not finance-ready; finance needs **consistent columns** (order date, store, channel, gross, discounts, tax lines, refunds, payment fees, payout timing) so rollups are trustworthy.
- **Excel pivot tables** need a **flat, tabular** dataset (one row per grain—often line-level or order-level with fee columns), correct **date typing**, and stable **dimensions** (SKU, product type, tax jurisdiction, payment gateway) so pivots refresh cleanly after each export.
- **QuickBooks journal entries** require **balanced debits and credits**, clear **memo and reference** fields, and a **mapping** from Shopify economic reality (sales, liabilities, processor fees, refunds) to the chart of accounts—often different per entity or store.

### Technology stack

Shopify Admin API · custom app or private app credentials per store · OAuth where applicable · CSV / XLSX generation · Microsoft Excel (pivot tables, Power Query optional) · QuickBooks Online **Journal Entry** API or **file import** (CSV/IIF) depending on edition and compliance rules

### Solutions we offered

- **Multi-store connector**: a single control plane that registers **N Shopify stores**, stores credentials securely, and runs exports **per store** with clear naming (`store_slug`, `export_period`) so files never overwrite each other.
- **Order export pipeline**: pull orders (and related refunds/transactions where needed), **normalize** to a finance-friendly schema, and emit **Excel-ready** workbooks or CSVs with documented column definitions for **pivot table** rows, columns, and values.
- **QuickBooks bridge**: define **account mapping rules** (sales income, shipping income, sales tax payable, discounts, merchant fees, clearing/cash) and generate **journal entry batches** per period—either via **approved import templates** or API—with **tie-out checks** so debits equal credits before posting.

### The results

**First**  
Finance and ops could **connect multiple Shopify stores** in one place and produce **period-close exports** on a predictable schedule, with audit-friendly file naming and version history.

**Second**  
Analysts used **Excel pivot tables** on the exported grids to slice revenue by store, product, gateway, and geography **without re-querying** Shopify for every ad-hoc question.

**Third**  
Month-end **journal entries in QuickBooks** matched the **Shopify order and payout story** after mapping and validation—reducing manual JE lines and reconciliation time while keeping a clear trail from source export to posted entry.

---

*This document follows a classic case-study layout (client → challenges → stack → approach → numbered outcomes) for portfolio and onboarding use. Names and third-party marketing from external sample PDFs are intentionally omitted.*
