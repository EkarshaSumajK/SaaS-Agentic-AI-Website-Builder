# ✨ Lumina AI - Agentic Website Builder
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/maxckes/SaaS-Agentic-AI-Website-Builder)

> Transform your ideas into production-ready Next.js applications with the power of AI. Simply describe what you want in natural language, and Lumina AI will build it for you—complete with beautiful UI, responsive design, and working features.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.10.1-2D3748)](https://www.prisma.io/)

## ✨ Features

### 🤖 AI-Powered Generation
- **Natural Language Input**: Describe your website in plain English—no coding required
- **Multi-Agent AI System**: Specialized agents for planning, coding, testing, and summarizing
- **Google Gemini 2.5 Flash**: Powered by state-of-the-art AI models
- **Intelligent Code Generation**: Creates production-ready Next.js applications with TypeScript
- **Real-time Progress Updates**: Track AI progress with structured status updates (analyzing, planning, creating, testing, complete)
- **Error Recovery**: Automatic error detection and fixing during build process

### 🎨 Modern Tech Stack
- **Next.js 15.3.4** with App Router, React 19, and TypeScript 5 (strict mode)
- **shadcn/ui** - 40+ pre-built accessible components (Radix UI primitives)
- **Tailwind CSS 4** with utility-first styling and custom animations
- **Prisma ORM 6.10.1** with PostgreSQL database and optimized indexes
- **tRPC 11.4.3** for end-to-end type-safe API routes
- **Clerk** for secure user authentication and session management
- **Lucide React** for beautiful, consistent icons
- **Three.js** for 3D graphics and shader backgrounds

### ⚡ Real-Time Development
- **Live Code Execution**: E2B sandboxes for secure, isolated code execution
- **Split View Interface**: Side-by-side chat, live preview, and source code explorer
- **Hot Reload**: Instant preview updates as AI generates and modifies code
- **Interactive Chat**: Natural language iteration—refine, add features, or fix issues conversationally
- **File Explorer**: Browse and view all generated files with syntax highlighting
- **Tabbed Views**: Switch between live preview and code view seamlessly

### 🔧 Developer Experience
- **Type Safety**: Full TypeScript support with strict mode enabled throughout
- **Component Library**: 40+ pre-built shadcn/ui components ready to use
- **Responsive Design**: Mobile-first approach by default in all generated applications
- **Modern Tooling**: ESLint, PostCSS, Turbopack for fast development
- **Security First**: Security headers, rate limiting, input validation, and error boundaries
- **Centralized Logging**: Structured logging for debugging and monitoring
- **Error Boundaries**: Graceful error handling with user-friendly fallbacks

## 🏗️ Architecture

### Multi-Agent AI System
The application uses **Inngest Agent Kit** to orchestrate multiple specialized AI agents working together:

- **Summary Agent**: The main development agent that analyzes requirements, writes code, installs packages, and manages project state
- **Response Agent**: Generates friendly, conversational explanations of what was built
- **Fragment Title Agent**: Creates concise, descriptive titles for code fragments (max 3 words)

Each agent has access to specialized tools:
- **Terminal**: Execute shell commands (npm install, file operations)
- **createOrUpdateFiles**: Create or modify files in the sandbox
- **readFiles**: Inspect existing code and components

### Technology Stack

```mermaid
graph TB
    User[User Browser] --> Frontend[Next.js 15.3.4 Frontend]
    Frontend --> Auth[Clerk Authentication]
    Frontend --> API[tRPC API Layer]
    API --> DB[(PostgreSQL via Prisma)]
    API --> Inngest[Inngest Event System]
    Inngest --> Agents[AI Agent Network]
    Agents --> Gemini[Google Gemini 2.5 Flash]
    Agents --> E2B[E2B Sandboxes]
    E2B --> Preview[Live Preview]
    Preview --> User
    Frontend --> UI[shadcn/ui + Tailwind CSS]
    Frontend --> ThreeJS[Three.js Shader Backgrounds]
```

### Database Schema

```prisma
model Project {
  id        String    @id @default(uuid())
  name      String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
  userId    String
}

model Message {
  id        String      @id @default(uuid())
  content   String
  role      MessageRole
  type      MessageType
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  fragments Fragment?
  projectId String
  project   Project     @relation(fields: [projectId], references: [id])
}

model Fragment {
  id         String   @id @default(uuid())
  messageId  String   @unique
  message    Message  @relation(fields: [messageId], references: [id], onDelete: Cascade)
  sandboxUrl String
  title      String
  files      Json
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn
- PostgreSQL database
- Clerk account for authentication
- E2B account for code sandboxes
- Google AI API key for Gemini

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/agentic_ai_db"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# Inngest
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# E2B Sandboxes
E2B_API_KEY="your-e2b-api-key"
SANDBOX_TIMEOUT="600000"

# Google AI
GOOGLE_AI_API_KEY="your-gemini-api-key"

# Profile
NEXT_PUBLIC_AVATAR_URL="https://github.com/yourusername.png"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

See [.env.example](.env.example) for a complete template.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agentic-ai-website-builder.git
   cd agentic-ai-website-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
agentic-ai-website-builder/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts               # Database seeding
│   └── migrations/           # Database migrations
├── sandbox-templates/
│   └── nextjs/
│       ├── e2b.Dockerfile    # E2B sandbox configuration
│       └── compile_page.sh   # Build script
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── (home)/          # Home page and auth
│   │   ├── projects/        # Project management
│   │   └── api/             # API routes
│   ├── components/          # Reusable UI components
│   │   └── ui/              # shadcn/ui components
│   ├── modules/             # Feature modules
│   │   ├── projects/        # Project management
│   │   └── messages/        # Chat functionality
│   ├── inngest/             # AI agent functions
│   ├── lib/                 # Utilities and config
│   │   ├── env.ts          # Environment validation
│   │   ├── logger.ts       # Centralized logging
│   │   ├── rate-limit.ts   # Rate limiting
│   │   └── db.ts           # Database client
│   ├── trpc/                # tRPC setup
│   ├── middleware.ts        # Authentication middleware
│   └── prompt.ts            # AI prompts
└── package.json
```

## 🔧 Key Components

### AI Agent System
Located in `src/inngest/functions.ts`, the multi-agent system includes:

- **Code Generation**: Creates Next.js applications with shadcn/ui
- **File Management**: Handles project files and structure  
- **Terminal Access**: Executes commands in sandboxed environment
- **Error Handling**: Manages build errors and debugging

### Project Interface
The main project view (`src/modules/projects/ui/views/project-views.tsx`) provides:

- **Split Layout**: Chat on left, preview/code on right
- **Live Preview**: Real-time website rendering
- **Code Explorer**: File tree and syntax highlighting
- **Interactive Chat**: Natural language project iteration

### Authentication
Powered by Clerk with middleware protection:

- **Public Routes**: Home, sign-in, sign-up, API
- **Protected Routes**: All project pages
- **User Context**: Available throughout the application

## 🎯 Usage

1. **Sign Up/Sign In**: Create an account using Clerk authentication

2. **Create a Project**: 
   ```
   Describe your website: "A task management app with user authentication, 
   dashboard, and team collaboration features"
   ```

3. **Watch AI Generate**: The system will:
   - Parse your requirements
   - Generate Next.js code with shadcn/ui components
   - Create a working application in E2B sandbox
   - Provide live preview and source code

4. **Iterate and Refine**: 
   - Chat with the AI to modify features
   - Request design changes
   - Add new functionality
   - Fix bugs and issues

## 🔮 AI Capabilities

Lumina AI can generate a wide range of modern web applications:

- **Full SaaS Applications**: Complete with authentication, dashboards, data tables, and CRUD operations
- **Landing Pages**: Marketing sites with hero sections, feature cards, testimonials, and CTAs
- **E-commerce Stores**: Product catalogs, shopping carts, checkout flows, and order management
- **Dashboards**: Analytics dashboards with charts (using Recharts), metrics, and data visualization
- **Interactive Widgets**: Forms with validation, calculators, search interfaces, and custom tools
- **Content Management**: Blogs, portfolios, documentation sites with rich content layouts
- **Admin Panels**: User management, content moderation, settings pages
- **Responsive Design**: All applications are mobile-first and fully responsive

**Technical Features**:
- TypeScript with full type safety
- shadcn/ui components for professional UI
- Tailwind CSS for custom styling
- React hooks for state management
- Production-ready code (no placeholders or TODOs)
- Accessibility (ARIA attributes, semantic HTML)
- Error boundaries and loading states
- Realistic mock data for demos

## 🚧 Development

### Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production  
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations

```bash
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed database
```

## 🎨 UI/UX Features

### Premium Design System
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Animated Components**: Smooth transitions and micro-interactions
- **Shader Backgrounds**: Three.js-powered animated shader backgrounds
- **Dark Mode Support**: Seamless theme switching with next-themes
- **Custom Color Palettes**: Carefully curated color schemes
- **Inter Font**: Modern typography with Google Fonts

### Interactive Elements
- **AI Input Hero**: Wave-animated hero section with chat input
- **Sidebar Navigation**: Collapsible sidebar with smooth animations
- **Resizable Panels**: Drag-to-resize split view interface
- **Code Highlighting**: PrismJS syntax highlighting for multiple languages
- **Toast Notifications**: Real-time feedback with Sonner
- **Loading States**: Skeleton loaders and progress indicators

## 🌐 Production Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Production Checklist

- ✅ Security headers configured (HSTS, CSP, X-Frame-Options)
- ✅ Rate limiting implemented (5 projects/hour)
- ✅ Environment validation with Zod
- ✅ Centralized logging system
- ✅ Error boundaries for React errors
- ✅ Database indexes for performance
- ✅ Type-safe APIs with tRPC
- ✅ Input validation throughout

## 🔒 Security

This application implements comprehensive security measures:

- **Authentication**: Clerk-based secure authentication
- **Rate Limiting**: Prevents abuse and spam
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection Protection**: Prisma ORM
- **XSS Protection**: React's built-in escaping
- **Sandboxed Execution**: E2B containers for code execution

For security policies and vulnerability reporting, see [SECURITY.md](SECURITY.md).

## 🛠️ Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check connection
npx prisma db pull
```

### Environment Variables

- Verify all required variables are set
- Check for typos
- Ensure API keys are valid
- Use `.env.local` for local development

See [DEPLOYMENT.md](DEPLOYMENT.md) for more troubleshooting tips.

## 🧪 Testing & Quality Assurance

### Built-in Quality Checks
- **TypeScript Strict Mode**: Type checking during builds (`ignoreBuildErrors: false`)
- **ESLint Integration**: Linting during builds (`ignoreDuringBuilds: false`)
- **Input Validation**: Zod schemas for all user inputs and environment variables
- **Error Boundaries**: React error boundaries for graceful error handling
- **Rate Limiting**: 5 projects per hour to prevent abuse

### Hydration Error Prevention
All generated applications include:
- `suppressHydrationWarning` on `<html>` and `<body>` tags
- Prevents hydration errors from browser extensions
- Ensures consistent server/client rendering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Standards
- Next.js 15.3.4 with App Router
- React 19.0.0 with modern hooks
- TypeScript 5 with strict mode enabled
- Tailwind CSS 4 with all plugins and custom animations
- Code formatting with Prettier
- Conventional commits recommended
- Component-driven architecture
- Comprehensive error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [E2B](https://e2b.dev/) for secure code execution sandboxes
- [Inngest](https://www.inngest.com/) for AI agent orchestration
- [Clerk](https://clerk.com/) for seamless authentication
- [Google AI](https://ai.google.dev/) for Gemini 2.5 Flash
- [Vercel](https://vercel.com/) for hosting and deployment
- [Prisma](https://www.prisma.io/) for type-safe database access
- [Three.js](https://threejs.org/) for 3D graphics and shaders

---

**Built with ❤️ by [KES](https://github.com/maxckes)**

**Lumina AI** - Transforming ideas into reality, one conversation at a time. ✨
