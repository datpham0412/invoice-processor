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

- 🖥️ **Backend:** ASP NET Core 6.0 (C# 10), Entity Framework Core 6  
- 🗄️ **Database:** SQL Server (Azure SQL)  
- ⚛️ **Frontend:** React 19.1.0 + Vite, @vitejs/plugin-react 4.4.1  
- 🖌️ **UI / Styling:** Tailwind CSS, shadcn/ui, Lucide React icons  
- ☁️ **Cloud Services:**  
  - Azure Blob Storage (invoice PDFs)  
  - Azure Cognitive Services (Form Recognizer)  
  - Azure Service Bus (exception queue)  
- 🐳 **Containerization:** Docker → Fly.io  
- 📡 **Web Server / Proxy:** Nginx  
- 🔒 **Authentication:** JWT Bearer tokens  
- 📦 **Package Management:** npm (frontend), NuGet (backend)  
- 📑 **API Documentation:** Swagger / OpenAPI spec, Postman Collection  
- 🛠️ **Local Dev & Scripts:** Docker Compose for local end-to-end  
- 🧪 **Testing:** xUnit (backend)
- 🔄 **CI/CD:** GitHub Actions → Fly.io  
- 📈 **Monitoring:** Azure Application Insights  

<a id="architecture"></a>
## 🏛️ Architecture

[![Architecture Diagram](/frontend/public/architecture.svg)](/frontend/public/architecture.svg)

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