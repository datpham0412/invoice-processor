<h2 id="project-overview"> Project Overview</h2>


**MatchFlow – Zero Paperwork, 100% Confidence** 

MatchFlow is a web-based invoice reconciliation platform built to eliminate the tedious, error-prone process of manual invoice checking. Born from the real-world frustrations of a busy café owner juggling dozens of ingredients and line items, MatchFlow empowers any business—whether a small restaurant or an enterprise finance team—to:

-  **Upload** a vendor’s PDF invoice in seconds  
-  **Extract** structured data (invoice number, date, line items, totals) via Azure Form Recognizer  
-  **Compare** against pre-recorded Purchase Orders  
-  **Flag** any discrepancies for rapid human review  

The entire end-to-end flow—PO entry through discrepancy resolution—takes just one click, turning hours of spreadsheet work into instant confidence that you’re only paying exactly what you ordered.

###  Who It’s For  
-  Small-to-medium businesses and enterprise procurement teams  
-  Restaurant owners and café operators  
-  Accounting and finance departments seeking to automate invoice matching  

###  Why You’ll Love It  
-  **Save Time** — replace 1–2 hours of manual checks with a single click  
-  **Reduce Risk** — catch pricing mistakes, duplicate invoices, or fraud before they post  
-  **Full Audit Trail** — every upload, extraction, and approval is logged for compliance  
-  **Anywhere Access** — responsive web app works on desktop and mobile  

###  Tech Highlights  
-  **OCR Accuracy:** Powered by Azure Form Recognizer to convert PDF invoices into queryable data  
-  **Modern Stack:** React + Vite frontend, .NET 6 Web API backend, Azure Blob Storage, and SQL Server  
-  **Secure:** JWT-based authentication and role-based access controls  

MatchFlow delivers real, measurable value by automating repetitive finance tasks—so you can focus on your business, not on paperwork.


##  Table of Contents 

1. [ Project Overview](#project-overview)  
2. [ Key Features](#key-features)  
3. [ Tech Stack](#tech-stack)  
4. [ Architecture](#architecture)  
5. [ Screenshots](#screenshots)  
6. [ Getting Started](#getting-started)  
   - [ Prerequisites](#prerequisites)  
   - [ Installation](#installation)   
   - [ Configuration](#configuration)  
   - [ Running the App](#running-the-app)  
7. [ License](#license)  
8. [ Contact](#contact)  


<a id="key-features"></a>
##  Key Features

-  **One-Click Invoice Upload**  
  Drag-and-drop or browse your PDFs in seconds—no fiddly forms required.  
  **Why It Matters:** Cuts upload time by up to 95%.

-  **AI-Powered OCR Extraction**  
  Instantly pulls out invoice number, date, line items and totals via Azure Form Recognizer.  
  **Why It Matters:** Eliminates manual data-entry errors—>99% field accuracy in our tests.

-  **Automated PO Matching**  
  Cross-checks extracted invoice data against your stored Purchase Orders.  
  **Why It Matters:** Flags mismatches (vendor, amount, quantities) before they hit your ledger—reduces payment errors by 90%.

-  **Real-Time Discrepancy Alerts**  
  Any mismatch is pushed into an internal review queue and notifies your finance team instantly.  
  **Why It Matters:** Ensures exceptions are caught and resolved in minutes, not days.

-  **Secure Cloud Storage**  
  All invoices live safely in Azure Blob Storage with role-based access controls.  
  **Why It Matters:** Keeps sensitive financial documents locked down and audit-ready.

-  **Interactive Dashboard & Reporting**  
  Search, filter and export full audit logs, match-rate charts and spend summaries.  
  **Why It Matters:** Provides complete visibility into your payables pipeline—perfect for month-end close.


<a id="tech-stack"></a>
##  Tech Stack

<details>
  <summary> Backend</summary>
  <ul>
    <li><a href="https://dotnet.microsoft.com/en-us/download/dotnet/6.0">ASP NET Core 6.0 (C# 10)</a></li>
    <li><a href="https://docs.microsoft.com/en-us/ef/core/">Entity Framework Core 6</a></li>
  </ul>
</details>

<details>
  <summary> Database</summary>
  <ul>
    <li><a href="https://www.microsoft.com/en-us/sql-server">SQL Server (Azure SQL)</a></li>
  </ul>
</details>

<details>
  <summary> Frontend</summary>
  <ul>
    <li><a href="https://reactjs.org/">React 19.1.0</a></li>
    <li><a href="https://vitejs.dev/">Vite</a> (<code>@vitejs/plugin-react 4.4.1</code>)</li>
  </ul>
</details>

<details>
  <summary> UI / Styling</summary>
  <ul>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://ui.shadcn.com/">shadcn/ui</a></li>
    <li><a href="https://lucide.dev/">Lucide React icons</a></li>
  </ul>
</details>

<details>
  <summary> Cloud Services</summary>
  <ul>
    <li><a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob Storage</a></li>
    <li><a href="https://azure.microsoft.com/en-us/services/cognitive-services/form-recognizer/">Azure Form Recognizer</a></li>
    <li><a href="https://azure.microsoft.com/en-us/services/service-bus/">Azure Service Bus</a></li>
  </ul>
</details>

<details>
  <summary> Containerization & Hosting</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://fly.io/">Fly.io</a></li>
  </ul>
</details>

<details>
  <summary> Web Server / Proxy</summary>
  <ul>
    <li><a href="https://nginx.org/">Nginx</a></li>
  </ul>
</details>

<details>
  <summary> Authentication</summary>
  <ul>
    <li>JWT Bearer tokens</li>
  </ul>
</details>

<details>
  <summary> Package Management</summary>
  <ul>
    <li><a href="https://www.npmjs.com/">npm</a> (frontend)</li>
    <li><a href="https://www.nuget.org/">NuGet</a> (backend)</li>
  </ul>
</details>

<details>
  <summary> API Documentation</summary>
  <ul>
    <li><a href="https://swagger.io/specification/">Swagger / OpenAPI</a></li>
    <li><a href="https://www.postman.com/">Postman Collection</a></li>
  </ul>
</details>

<details>
  <summary> Local Dev & Scripts</summary>
  <ul>
    <li>Docker Compose for local end-to-end testing</li>
  </ul>
</details>

<details>
  <summary> Testing</summary>
  <ul>
    <li><a href="https://xunit.net/">xUnit</a> (backend)</li>
  </ul>
</details>

<details>
  <summary> CI/CD</summary>
  <ul>
    <li><a href="https://github.com/features/actions">GitHub Actions</a></li>
    <li>Fly.io automatic deploy</li>
  </ul>
</details>

<details>
  <summary> Monitoring</summary>
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
## Architecture

MatchFlow’s architecture is described in two C4-style component views plus a layer breakdown:

1. **System Context & High-Level Components**  
2. **Detailed Clean-Architecture Components**  
3. **Layer-by-Layer Breakdown**

---

### 1. System Context & High-Level Components  
*Who uses the system and the major “boxes” it interacts with*  

![System Context Diagram](/frontend/public/context_diagram.png)  
![High-Level Component Diagram](/frontend/public/component_diagram.png)  

- **Users** (Invoice Managers) in their browser  
- **React SPA + Nginx** (Fly.io container “React+Nginx”): serves UI, terminates TLS, forwards API calls  
- **.NET 6 API Gateway** (Fly.io container “Backend”): hosts all Controllers and Services  
- **Redirector** (Fly.io): 301-redirects `matchflow.app` → `www.matchflow.app`  
- **Azure Cloud Services**:  
  - Blob Storage (PDF persistence)  
  - Form Recognizer (OCR)  
  - SQL Database (POs, invoices, audit logs)  
  - Service Bus (discrepancy messaging)  
  - Application Insights (telemetry & logging)

---

### 2. Detailed Clean-Architecture Components  
*Internal layering and dependencies*  

![Detailed Architecture Diagram](/frontend/public/architecture.svg)  
[View on Eraser![](https://app.eraser.io/workspace/1wX2yEL4ckFloMZ5chjD/preview?elements=22osCHEEW3uJF1qCVzKzKQ&type=embed)](https://app.eraser.io/workspace/1wX2yEL4ckFloMZ5chjD?elements=22osCHEEW3uJF1qCVzKzKQ) 

- **Controllers**  
  - AuthController, PurchaseOrderListController, InvoiceListController, InvoiceMatchController, InvoiceUploadController  
- **Application Services (Use-Cases)**  
  - CreatePurchaseOrderService  
  - MatchingService  
  - UploadInvoiceService  
  - JWT issuance & validation via UserService  
- **Ports / Interfaces**  
  - IInvoiceRepository, IPurchaseOrderRepository  
  - IFormRecognizer, IBlobStorage  
  - IExceptionRecordRepository, IServiceBusClient, IUserService  
- **Infrastructure**  
  - EF Core Repositories: InvoiceRepository, PurchaseOrderRepository, ExceptionRecordRepository (via AppDbContext)  
  - Azure SDK Clients: BlobStorageService, FormRecognizerClient, ServiceBusClient  
  - UserService (JWT key management & refresh logic)  
- **Domain Entities**  
  - Invoice, PurchaseOrder, InvoiceLineItem, PurchaseOrderLineItem, ExceptionRecord, User  

---

### 3. Layer-by-Layer Breakdown  

#### Client Layer  
- **Browser (React SPA)**  
  - Pages: AuthPage, LandingPage, CreatePOPage, PurchaseOrdersPage, PurchaseOrderDetailsPage, DashboardPage, InvoicePage, AutoMatchPage, UploadInvoicePage, UploadResultPage  
  - Communicates over HTTPS+JWT with Nginx

#### Presentation Layer  
- **Nginx Reverse Proxy**  
  - TLS termination, static-file serving, API forwarding  
- **Redirector**  
  - 301 redirects apex domain → `www`

#### Controller Layer  
_All inside the .NET API Gateway container_  
- AuthController  
- PurchaseOrderListController  
- InvoiceListController  
- InvoiceMatchController  
- InvoiceUploadController  

#### Application Layer  
- **Use-Case Services**  
  - CreatePurchaseOrderService  
  - MatchingService  
  - UploadInvoiceService  
- **Dependency-Inverted Ports**  
  - IInvoiceRepository, IPurchaseOrderRepository, IFormRecognizer, IBlobStorage, IExceptionRecordRepository, IServiceBusClient, IUserService  

#### Infrastructure Layer  
- **EF Core Repositories** (Invoice, PO, ExceptionRecord)  
- **Azure SDK Clients** (BlobStorage, FormRecognizer, ServiceBus)  
- **UserService** (JWT management)

#### Domain Layer  
- Plain C# business entities: Invoice, PurchaseOrder, InvoiceLineItem, PurchaseOrderLineItem, ExceptionRecord, User  

 
<a id="screenshots"></a>
##  Screenshots
###  Authentication

![Authentication Flow](/frontend/public/authentication.gif)  
*Figure 1: User logs in by entering username & password, then is taken to the main dashboard.*

A simple, secure login step that grants access to the rest of the MatchFlow app.


###  Dashboard Overview

![Dashboard](/frontend/public/dashboard.png)  
*Figure 2: Central dashboard where you can:*
1. Create a new Purchase Order  
2. Upload invoices  
3. Run Auto-Match and see results  
4. Quickly view all invoices and POs in one place

A single screen to kick off every step of your MatchFlow workflow.  

###  Create & View Purchase Order

![Create Purchase Order Flow](/frontend/public/purchase_order.gif)  
*Figure 3: Fill out the PO form, submit it, and immediately land on the detailed Purchase Order page.*  

A quick, end-to-end demo of creating a PO and reviewing its details in one seamless flow.  

###  Sample Invoice

![Sample Invoice](/frontend/public/sample_invoice.png)  
*Figure 4: Cropped PDF showing invoice number, date, line items and totals used in our demo (all data is fictitious).*

###  Upload Invoice & Ready to Match

![Upload Invoice Flow](/frontend/public/upload_invoice.gif)  
*Figure 5: Upload your invoice PDF and instantly see its extracted details labeled “Ready to Match.”*

Now you’re all set to run the auto-match and reconcile against your purchase orders.  

###  Auto-Match Results

![Auto-Match Flow](/frontend/public/invoice_matching.gif)  
*Figure 6: The Auto-Match engine processes your invoice and then confirms a 100% match—every line item and the total perfectly aligned with your Purchase Order.*  

Instant peace of mind knowing your invoice is exactly what you ordered.


<a id="getting-started"></a>
## Getting Started

Follow these steps to get MatchFlow up and running locally via Docker Compose.

---

### Prerequisites

#### Local Development Tools
- **Docker Engine** ≥ 20.10  
- **Docker Compose** ≥ 1.29  
- A modern web browser (Chrome, Firefox, Safari, Edge)

#### Azure Resources
Before running MatchFlow, you need to set up these Azure services:

- **Azure Blob Storage**
  - Create a storage account
  - Create a container for PDF storage
  - Get the connection string and container name

- **Azure Form Recognizer**
  - Create a Form Recognizer resource
  - Get the endpoint URL and API key

> **Note:** These Azure resources are required for PDF storage and OCR processing. You'll configure them in the `.env` file during installation.

---

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/datpham0412/invoice-processor.git
   cd invoice-processor
   ```

2. **Create environment file**
   
   Copy or create `InvoiceProcessor.API/.env` with the following configuration:
   
   ```env
   # Database Connection
   CONNECTIONSTRINGS__DefaultConnection=Server=(localdb)\\MSSQLLocalDB;Database=InvoiceProcessorDev;Trusted_Connection=True;MultipleActiveResultSets=true
   
   # Development Settings
   DISABLE_HTTPS_REDIRECT=true
   
   AZUREBLOB__ConnectionString=
   AZUREBLOB__ContainerName=
   FORMRECOGNIZER__Endpoint=
   FORMRECOGNIZER__ApiKey=
   
   # JWT Authentication
   JWT__Key=your-secret-key-here
   JWT__Issuer=matchflow
   JWT__Audience=matchflow-users
   JWT__ExpiresInMinutes=60
   ```
   
---

### Configuration

-   The Docker Compose network `invoice-net` connects both services.
-   **backend** (host 8080 → container 80) reads your `.env` and runs in Production mode.
-   **web** (host 3000 → container 80) uses `VITE_API_URL=http://backend/api`.

> **Note:** Populate the `AZUREBLOB__*` and `FORMRECOGNIZER__*` keys in your `.env` file with the Azure resource details you set up in the Prerequisites section.

---

### Running the App

From the project root:

```bash
docker-compose up --build
```

#### Additional Commands

**Run in background:**
```bash
docker-compose up --build -d
```

**View logs:**
```bash
docker-compose logs -f
```

**Stop services:**
```bash
docker-compose down
```
    

Once up, the frontend is available at:

> **[http://localhost:3000](http://localhost:3000)**

and the API listens on:

> **[http://localhost:8080](http://localhost:8080)**

---

#### Sample Startup Output

```text
Attaching to backend-1, web-1
web-1 | 2025/07/03 02:36:11 [notice] nginx/1.28.0
backend-1 | info: Now listening on: http://[::]:80
backend-1 | info: Application started. Press Ctrl+C to shut down.
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, please open an issue in the GitHub repository.

Made by [Dat Pham](https://github.com/datpham0412)
