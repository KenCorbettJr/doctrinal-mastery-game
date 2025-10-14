# Technology Stack

## Core Technologies

- **Vue 3** - Frontend framework using Composition API with `<script setup>` syntax
- **TypeScript** - Type safety with strict mode enabled
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling

## Build System

- **Vite** for fast development and optimized production builds
- **vue-tsc** for TypeScript compilation and type checking
- **PostCSS** with Autoprefixer for CSS processing

## Development Dependencies

- `@vitejs/plugin-vue` - Vue 3 support for Vite
- `vue-tsc` - Vue TypeScript compiler
- `tailwindcss` with `autoprefixer` and `postcss`

## Common Commands

```bash
# Development server
npm run dev

# Production build (includes type checking)
npm run build

# Preview production build
npm run preview
```

## TypeScript Configuration

- Strict mode enabled with comprehensive linting rules
- ES2020 target with modern module resolution
- Bundler mode for optimal Vite integration
- Separate configs for app (`tsconfig.app.json`) and Node.js (`tsconfig.node.json`)

## Styling Approach

- Tailwind CSS for all styling
- Utility-first approach with responsive design
- Color-coded categories using Tailwind classes
- No custom CSS beyond Tailwind utilities
