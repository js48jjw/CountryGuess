# Country Guess Game - Development Guide

## Build & Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linting
- `npx tsc --noEmit` - TypeScript type checking

## Code Style Guidelines

### Imports & Structure
- Use `@/` path aliases for src imports: `import { cn } from "@/lib/utils"`
- Import React as: `import React from "react"`
- Group imports: React, external libraries, internal components, types

### Components
- Use React.FC type annotation: `const Component: React.FC = () => {}`
- Export default components
- Use Tailwind CSS for styling with utility classes
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Naming Conventions
- PascalCase for components, types, interfaces
- camelCase for functions, variables, props
- TypeScript strict mode enabled - always type props and state

### Styling
- Tailwind CSS v4 with custom fonts: `font-blackhan`, `font-pretendard`
- Responsive design with mobile-first approach using `sm:`, etc.
- Dark mode support using `dark:` variants

### Error Handling
- Use try/catch for async operations
- Throw meaningful error messages in Korean when applicable
- Handle API errors gracefully with user feedback

### File Organization
- Components in `/src/components/`
- Types in `/src/types/`
- Utilities in `/src/lib/`
- App structure follows Next.js 15 app router