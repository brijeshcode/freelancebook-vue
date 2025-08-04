# FreelanceBook Vue

A modern, responsive frontend application for the FreelanceBook system built with Vue.js 3, TypeScript, and Tailwind CSS. This application provides an intuitive interface for freelancers to manage clients, projects, invoices, and payments.

## 🚀 Features

- **Modern UI/UX** - Clean, responsive design optimized for desktop and mobile
- **Real-time Dashboard** - Live updates on income, dues, and upcoming tasks
- **Client Management** - Easy-to-use interface for managing client relationships
- **Project Tracking** - Visual project management with progress indicators
- **Services Tracking** - Visual project services management with progress indicators
- **Invoice Generation** - Streamlined invoice creation with PDF export
- **Payment Tracking** - Comprehensive payment history and balance management
<!-- - **Recurring Services** - Automated billing for ongoing services -->
<!-- - **Notification Center** - In-app notifications for important updates -->

## 🛠️ Tech Stack

- **Framework:** Vue.js 3 with Composition API
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Router:** Vue Router 4
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Icons:** Lucide

## 📋 Prerequisites

- Node.js 18+
- npm or Yarn
- FreelanceBook API running locally or deployed

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/brijeshcode/freelancebook-vue.git
   cd freelancebook-vue
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure API endpoint**
   Update your `.env.local` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=FreelanceBook
   VITE_APP_VERSION=1.0.0
   ```

5. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

The build files will be generated in the `dist/` directory, which can be deployed to any static hosting service or copied to the Laravel API's `public/` folder for integrated deployment.

## 📁 Project Structure

```
src/
├── components/           # Reusable Vue components
│   ├── ui/              # Basic UI components (buttons, inputs, etc.) // planned
│   ├── forms/           # Form components // planned
│   └── layout/          # Layout components (header, sidebar, etc.) // planned
├── views/               # Page components
│   ├── auth/           # Authentication pages
│   ├── clients/        # Client management pages
│   ├── projects/       # Project management pages
│   ├── invoices/       # Invoice management pages
│   └── dashboard/      # Dashboard and reports
├── composables/         # Vue composables for shared logic
├── stores/             # Pinia stores for state management
├── services/           # API service functions
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── router/             # Vue Router configuration
└── assets/             # Static assets (images, styles)

public/
├── favicon.ico
└── index.html
```

## 🎨 Component Architecture

### Current Status
The application currently uses larger, monolithic components that handle multiple responsibilities. 

### Planned Refactoring
Future optimization will break down large components into smaller, reusable pieces:

```
components/
├── ui/
│   ├── Button.vue
│   ├── Input.vue
│   ├── Modal.vue
│   └── DataTable.vue
├── forms/
│   ├── ClientForm.vue
│   ├── ProjectForm.vue
│   └── InvoiceForm.vue
└── features/
    ├── ClientCard.vue
    ├── ProjectCard.vue
    └── InvoiceCard.vue
```

## 🔧 Configuration

### API Integration
The app communicates with the FreelanceBook API using Axios:

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})
```

### Authentication
Uses Laravel Sanctum tokens for authentication:

```typescript
// Token is stored in localStorage and attached to requests
api.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

## 🧪 Development

### Code Quality
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **TypeScript** - Type safety

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
```

## 🚀 Deployment

### Integrated Deployment (Recommended)
The production build is deployed within the Laravel API:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Copy dist files to Laravel public folder**
   ```bash
   cp -r dist/* ../freelancebook-api/public/
   ```

3. **Push to GitHub** - Automatic deployment via hosting integration

### Standalone Deployment
Alternatively, deploy to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## 🎯 Features in Development

- [ ] Component refactoring into smaller, reusable pieces
- [ ] Advanced data visualization charts
- [ ] Offline mode with service workers
- [ ] Real-time notifications via WebSockets
- [ ] Advanced filtering and search
- [ ] Export functionality for reports
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit changes: `git commit -am 'Add new feature'`
6. Push to branch: `git push origin feature/new-feature`
7. Submit a pull request

## 📞 Contact

- **LinkedIn:** [Brijesh.IT](https://www.linkedin.com/in/brijesh-it/)
- **GitHub Issues:** For bug reports and feature requests

---

**Built with ❤️ using Vue.js 3 and modern web technologies**