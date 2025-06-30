<h2 id="project-overview">📄 Project Overview</h2>


**MatchFlow – Zero Paperwork, 100% Confidence** 🔒

MatchFlow is a web-based invoice reconciliation platform built to eliminate the tedious, error-prone process of manual invoice checking. Born from the real-world frustrations of a busy café owner juggling dozens of ingredients and line items, MatchFlow empowers any business—whether a small restaurant or an enterprise finance team—to:

- 📥 **Upload** a vendor’s PDF invoice in seconds  
- 🤖 **Extract** structured data (invoice number, date, line items, totals) via Azure Form Recognizer  
- 🔗 **Compare** against pre-recorded Purchase Orders  
- ⚠️ **Flag** any discrepancies for rapid human review  

The entire end-to-end flow—PO entry through discrepancy resolution—takes just one click, turning hours of spreadsheet work into instant confidence that you’re only paying exactly what you ordered.

### 🧑‍🤝‍🧑 Who It’s For  
- 🏪 Small-to-medium businesses and enterprise procurement teams  
- ☕ Restaurant owners and café operators  
- 💼 Accounting and finance departments seeking to automate invoice matching  

### ❤️ Why You’ll Love It  
- ⏱️ **Save Time** — replace 1–2 hours of manual checks with a single click  
- 🛡️ **Reduce Risk** — catch pricing mistakes, duplicate invoices, or fraud before they post  
- 📜 **Full Audit Trail** — every upload, extraction, and approval is logged for compliance  
- 🌐 **Anywhere Access** — responsive web app works on desktop and mobile  

### 🚀 Tech Highlights  
- 📊 **OCR Accuracy:** Powered by Azure Form Recognizer to convert PDF invoices into queryable data  
- ⚙️ **Modern Stack:** React + Vite frontend, .NET 6 Web API backend, Azure Blob Storage, and SQL Server  
- 🔒 **Secure:** JWT-based authentication and role-based access controls  

MatchFlow delivers real, measurable value by automating repetitive finance tasks—so you can focus on your business, not on paperwork.


## 📑 Table of Contents 

1. [📄 Project Overview](#project-overview)  
2. [✨ Key Features](#key-features)  
3. [🛠️ Tech Stack](#tech-stack)  
4. [🏛️ Architecture](#architecture)  
5. [📸 Screenshots / Demo](#screenshots--demo)  
6. [🚀 Getting Started](#getting-started)  
   - [🔧 Prerequisites](#prerequisites)  
   - [⚙️ Installation](#installation)  
   - [🔑 Configuration](#configuration)  
   - [▶️ Running the App](#running-the-app)  
7. [📚 API Reference](#api-reference)  
8. [💡 Usage Examples](#usage-examples)  
9. [🧪 Testing](#testing)  
10. [📦 Deployment](#deployment)  
11. [🛣️ Roadmap](#roadmap)  
12. [🤝 Contributing](#contributing)  
13. [📄 License](#license)  
14. [☎️ Contact / Support](#contact--support)  


<a id="key-features"></a>
## ✨ Key Features

- 📥 **One-Click Invoice Upload**  
  Drag-and-drop or browse your PDFs in seconds—no fiddly forms required.  
  **Why It Matters:** Cuts upload time by up to 95%.

- 🤖 **AI-Powered OCR Extraction**  
  Instantly pulls out invoice number, date, line items and totals via Azure Form Recognizer.  
  **Why It Matters:** Eliminates manual data-entry errors—>99% field accuracy in our tests.

- 🔗 **Automated PO Matching**  
  Cross-checks extracted invoice data against your stored Purchase Orders.  
  **Why It Matters:** Flags mismatches (vendor, amount, quantities) before they hit your ledger—reduces payment errors by 90%.

- 🚨 **Real-Time Discrepancy Alerts**  
  Any mismatch is pushed into an internal review queue and notifies your finance team instantly.  
  **Why It Matters:** Ensures exceptions are caught and resolved in minutes, not days.

- 🔒 **Secure Cloud Storage**  
  All invoices live safely in Azure Blob Storage with role-based access controls.  
  **Why It Matters:** Keeps sensitive financial documents locked down and audit-ready.

- 📊 **Interactive Dashboard & Reporting**  
  Search, filter and export full audit logs, match-rate charts and spend summaries.  
  **Why It Matters:** Provides complete visibility into your payables pipeline—perfect for month-end close.


<a id="tech-stack"></a>
## 🛠️ Tech Stack

<details>
  <summary>🖥️ Backend</summary>
  <ul>
    <li><a href="https://dotnet.microsoft.com/en-us/download/dotnet/6.0">ASP NET Core 6.0 (C# 10)</a></li>
    <li><a href="https://docs.microsoft.com/en-us/ef/core/">Entity Framework Core 6</a></li>
  </ul>
</details>

<details>
  <summary>🗄️ Database</summary>
  <ul>
    <li><a href="https://www.microsoft.com/en-us/sql-server">SQL Server (Azure SQL)</a></li>
  </ul>
</details>

<details>
  <summary>⚛️ Frontend</summary>
  <ul>
    <li><a href="https://reactjs.org/">React 19.1.0</a></li>
    <li><a href="https://vitejs.dev/">Vite</a> (<code>@vitejs/plugin-react 4.4.1</code>)</li>
  </ul>
</details>

<details>
  <summary>🖌️ UI / Styling</summary>
  <ul>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a></li>
    <li><a href="https://lucide.dev/">Lucide React icons</a></li>
  </ul>
</details>

<details>
  <summary>☁️ Cloud Services</summary>
  <ul>
    <li><a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob Storage</a></li>
    <li><a href="https://azure.microsoft.com/en-us/services/cognitive-services/form-recognizer/">Azure Form Recognizer</a></li>
    <li><a href="https://azure.microsoft.com/en-us/services/service-bus/">Azure Service Bus</a></li>
  </ul>
</details>

<details>
  <summary>🐳 Containerization & Hosting</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://fly.io/">Fly.io</a></li>
  </ul>
</details>

<details>
  <summary>📡 Web Server / Proxy</summary>
  <ul>
    <li><a href="https://nginx.org/">Nginx</a></li>
  </ul>
</details>

<details>
  <summary>🔒 Authentication</summary>
  <ul>
    <li>JWT Bearer tokens</li>
  </ul>
</details>

<details>
  <summary>📦 Package Management</summary>
  <ul>
    <li><a href="https://www.npmjs.com/">npm</a> (frontend)</li>
    <li><a href="https://www.nuget.org/">NuGet</a> (backend)</li>
  </ul>
</details>

<details>
  <summary>📑 API Documentation</summary>
  <ul>
    <li><a href="https://swagger.io/specification/">Swagger / OpenAPI</a></li>
    <li><a href="https://www.postman.com/">Postman Collection</a></li>
  </ul>
</details>

<details>
  <summary>🛠️ Local Dev & Scripts</summary>
  <ul>
    <li>Docker Compose for local end-to-end testing</li>
  </ul>
</details>

<details>
  <summary>🧪 Testing</summary>
  <ul>
    <li><a href="https://xunit.net/">xUnit</a> (backend)</li>
  </ul>
</details>

<details>
  <summary>🔄 CI/CD</summary>
  <ul>
    <li><a href="https://github.com/features/actions">GitHub Actions</a></li>
    <li>Fly.io automatic deploy</li>
  </ul>
</details>

<details>
  <summary>📈 Monitoring</summary>
  <ul>
    <li><a href="https://azure.microsoft.com/en-us/services/monitor/">Azure Application Insights</a></li>
  </ul>
</details>

<br />

<table>
  <tr>
      <a href="https://dotnet.microsoft.com/">
        <img src="https://img.shields.io/badge/.NET-6.0-512BD4?style=flat&logo=.net&logoColor=white" alt=".NET" />
      </a>
      <a href="https://reactjs.org/">
        <img src="https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=black" alt="React" />
      </a>
      <a href="https://vitejs.dev/">
        <img src="https://img.shields.io/badge/Vite-4.4.1-646CFF?style=flat&logo=vite&logoColor=white" alt="Vite" />
      </a>
      <a href="https://tailwindcss.com/">
        <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
      </a>
      <a href="https://azure.microsoft.com/">
        <img src="https://img.shields.io/badge/Azure-0089D6?style=flat&logo=microsoft-azure&logoColor=white" alt="Azure" />
      </a>
      <a href="https://www.docker.com/">
        <img src="https://img.shields.io/badge/Docker-20.10.0-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
      </a>
      <a href="https://fly.io/">
        <img src="https://img.shields.io/badge/Fly.io-222222?style=flat&logo=fly-io&logoColor=white" alt="Fly.io" />
      </a>
      <a href="https://nginx.org/">
        <img src="https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white" alt="Nginx" />
      </a>
      <a href="https://www.microsoft.com/en-us/sql-server">
        <img src="https://img.shields.io/badge/SQL_Server-CC2927?style=flat&logo=microsoft-sql-server&logoColor=white" alt="SQL Server" />
      </a>
      <a href="https://www.npmjs.com/">
        <img src="https://img.shields.io/badge/npm-latest-CB3837?style=flat&logo=npm&logoColor=white" alt="npm" />
      </a>
      <a href="https://github.com/features/actions">
        <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white" alt="GitHub Actions" />
      </a>
      <a href="https://swagger.io/">
        <img src="https://img.shields.io/badge/Swagger-OpenAPI-85EA2D?style=flat&logo=swagger&logoColor=white" alt="Swagger" />
      </a>
  </tr>
</table>




<a id="architecture"></a>
## 🏛️ Architecture

[![Architecture Diagram](/frontend/public/architecture.svg)](/frontend/public/architecture.svg)

[View on Eraser![](https://app.eraser.io/workspace/1wX2yEL4ckFloMZ5chjD/preview?elements=22osCHEEW3uJF1qCVzKzKQ&type=embed)](https://app.eraser.io/workspace/1wX2yEL4ckFloMZ5chjD?elements=22osCHEEW3uJF1qCVzKzKQ) 

MatchFlow is built on Clean Architecture principles, with clear separation of concerns across six horizontal layers. Requests flow from left to right (and back), while dependencies always point inward toward the core Domain layer. Below is a breakdown of each layer, the major components within it, and the primary data flows.

### 🖥️ 1. Client Layer  
- **Browser (React SPA)**  
  - Contains ten page components:  
    AuthPage, LandingPage, CreatePOPage, PurchaseOrdersPage, PurchaseOrderDetailsPage, DashboardPage, InvoicePage, AutoMatchPage, UploadInvoicePage, and UploadResultPage.  
  - Sends and receives JWT-protected HTTPS calls to the Nginx proxy.

### 🌐 2. Presentation Layer  
- **Nginx Reverse Proxy** (Fly.io container “React+Nginx”)  
  - Terminates TLS, serves the React bundle, and forwards API requests.  
- **API Gateway** (.NET 6 Web API, Fly.io container “Backend”)  
  - Hosts all controllers and orchestrates application logic.  
- **Redirector** (Fly.io container)  
  - Routes requests from `matchflow.app` → `www.matchflow.app`.

### 🛡️ 3. Controller Layer  
_All running inside the API Gateway container:_  
- **AuthController** (handles login, JWT issuance & validation)  
- **PurchaseOrderListController**  
- **InvoiceListController**  
- **InvoiceMatchController**  
- **InvoiceUploadController**

### 🧩 4. Application Layer  
- **Services** (use-case implementations):  
  - `CreatePurchaseOrderService`  
  - `MatchingService`  
  - `UploadInvoiceService`  
  - `JWT Issuance & Validation` (via UserService)  
- **Ports / Interfaces** (abstractions for infrastructure):  
  - `IInvoiceRepository`, `IPurchaseOrderRepository`  
  - `IFormRecognizer`, `IBlobStorage`  
  - `IExceptionRecordRepository`, `IServiceBusClient`, `IUserService`  
  - Dependencies are injected here, following the Dependency Inversion Principle.

### 🛠️ 5. Infrastructure Layer  
_Concrete implementations of all ports:_  
- **EF Core Repositories**: `InvoiceRepository`, `PurchaseOrderRepository`, `ExceptionRecordRepository`, backed by `AppDbContext`  
- **Azure Clients**: `BlobStorageService`, `FormRecognizerClient`, `ServiceBusClient`  
- **UserService** (JWT key management & refresh logic)

### 📦 6. Domain Layer  
_Pure business entities with no external dependencies:_  
- `Invoice`, `PurchaseOrder`, `InvoiceLineItem`, `PurchaseOrderLineItem`, `ExceptionRecord`, `User`  

### ☁️ Cloud Services  
- **Azure Blob Storage** (PDF persistence)  
- **Azure Form Recognizer** (OCR)  
- **Azure SQL Database** (POs, invoices, audit logs)  
- **Azure Service Bus** (discrepancy messaging)  
- **Application Insights** (telemetry & logging)

### 🐳 Local Development  
- **Docker Compose** spins up all containers (React+Nginx, API, SQL emulator, Blob emulator, etc.) for end-to-end testing without Azure.

---

### 🔄 Primary Data Flows

1. **User Upload**  
   Browser → Nginx (HTTPS + JWT) → API Gateway  
2. **Invoice Processing**  
   `UploadInvoiceController` → UploadInvoiceService  
   → BlobStorageService → Azure Blob (POST PDF)  
   → FormRecognizerClient → Azure Form Recognizer (extract JSON)  
3. **Matching Logic**  
   `UploadInvoiceService` → MatchingService → EF Repositories → Azure SQL  
4. **Discrepancy Handling**  
   On mismatch, UploadInvoiceService → ServiceBusClient → Azure Service Bus  
   Front-end polls/subscribes for results  
5. **Telemetry**  
   All API calls and repository operations log to Application Insights  

---

By following Clean Architecture, MatchFlow achieves high testability, clear module boundaries, and the ability to swap out or mock any external dependency (databases, cloud services, UI) without impacting the business core.

## 📸 Screenshots
### 🔒 Authentication

![Authentication Flow](/frontend/public/authentication.gif)  
*Figure 1: User logs in by entering username & password, then is taken to the main dashboard.*

A simple, secure login step that grants access to the rest of the MatchFlow app.


### 📊 Dashboard Overview

![Dashboard](/frontend/public/dashboard.png)  
*Figure 2: Central dashboard where you can:*
1. Create a new Purchase Order  
2. Upload invoices  
3. Run Auto-Match and see results  
4. Quickly view all invoices and POs in one place

A single screen to kick off every step of your MatchFlow workflow.  

### 🛒 Create & View Purchase Order

![Create Purchase Order Flow](/frontend/public/purchase_order.gif)  
*Figure 3: Fill out the PO form, submit it, and immediately land on the detailed Purchase Order page.*  

A quick, end-to-end demo of creating a PO and reviewing its details in one seamless flow.  

### 🧾 Sample Invoice

![Sample Invoice](/frontend/public/sample_invoice.png)  
*Figure 4: Cropped PDF showing invoice number, date, line items and totals used in our demo (all data is fictitious).*

### 📥 Upload Invoice & Ready to Match

![Upload Invoice Flow](/frontend/public/upload_invoice.gif)  
*Figure 5: Upload your invoice PDF and instantly see its extracted details labeled “Ready to Match.”*

Now you’re all set to run the auto-match and reconcile against your purchase orders.  

### ✅ Auto-Match Results

![Auto-Match Flow](/frontend/public/invoice_matching.gif)  
*Figure 6: The Auto-Match engine processes your invoice and then confirms a 100% match—every line item and the total perfectly aligned with your Purchase Order.*  

Instant peace of mind knowing your invoice is exactly what you ordered.
