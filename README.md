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

