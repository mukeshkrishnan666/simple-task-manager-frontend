# Simple Task Manager - Frontend

A modern, production-grade single-page application (SPA) built with Angular and Angular Material, designed to interface seamlessly with a Spring Boot backend.

## Key Features

- Modern Angular Architecture: Built using Angular Standalone Components.
- Reactive Forms & Validation: Robust client-side validation with real-time feedback for task titles (required, max length 255) and descriptions.
- Angular Material Design: Clean, accessible SaaS dashboard styling featuring custom elevation, crisp typography, and an interactive data table.
- Asynchronous UX: Integrated loading overlays and progress indicators to handle network latency gracefully during API calls.
- Pagination & Backlog: Server-side pagination support with dynamic page sizing and responsive layout.
- Unified Build Pipeline: Integrated directly into the Spring Boot Gradle build for single-JAR production distribution.

---

## Tech Stack

- Framework: Angular (TypeScript)
- UI Library: Angular Material
- Styling: SCSS, Flexbox / CSS Grid
- HTTP Client: Angular HttpClient
- Build Tool: Angular CLI / Vite

---

## Project Structure

src/
├── app/
│   ├── components/
│   │   ├── task-form/       # Task creation reactive form component
│   │   └── task-list/       # Data table, pagination, and loading overlay
│   ├── models/
│   │   └── task.model.ts    # TypeScript interfaces (TaskRequest, TaskResponse, PagedResponse)
│   ├── services/
│   │   └── task.service.ts  # HTTP client service communicating with Spring Boot REST API
│   ├── app.config.ts        # Global application providers (Router, HttpClient, Animations)
│   ├── app.routes.ts        # Client-side route definitions
│   ├── app.ts               # Root component shell
│   └── app.html             # Main layout template (Toolbar & Content View)
├── main.ts                  # Application bootstrap entry point
└── styles.scss              # Global styles and Material overrides

---

## Getting Started & Local Development

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Execution

1. Clone the repository:
   git clone https://github.com/mukeshkrishnan666/simple-task-manager-frontend.git
   cd simple-task-manager-frontend

2. Install dependencies:
   npm install

3. Start the development server:
   ng serve

4. Access the application:
   Open your browser and navigate to http://localhost:4200 (Ensure your Spring Boot backend is running on port 8080 for API communication).

---

## Production Build

To compile the production-ready static assets manually:

npm run build

The optimized output will be generated under dist/simple-task-manager-frontend/browser/. 

(Note: In the full-stack repository setup, the backend's Gradle script automatically triggers this build and packages the assets directly into the Spring Boot executable JAR).

---

## License

This project is open-source and available under the MIT License.
