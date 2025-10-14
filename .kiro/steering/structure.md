# Project Structure

## Root Directory

```
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and steering
├── .vscode/                # VS Code settings
├── node_modules/           # Dependencies
└── dist/                   # Build output (generated)
```

## Source Directory (`src/`)

```
src/
├── App.vue                 # Main application component
├── main.ts                 # Application entry point
├── style.css               # Global styles (Tailwind imports)
├── vite-env.d.ts          # Vite type definitions
├── components/             # Reusable Vue components
│   └── HelloWorld.vue      # Example component
└── assets/                 # Static assets (images, etc.)
    └── vue.svg
```

## Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript project references
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.node.json` - Node.js TypeScript config
- `package.json` - Dependencies and scripts

## Component Organization

- **Single File Components (SFCs)** using `<script setup>` syntax
- **Composition API** for reactive state management
- **TypeScript** for type safety in all components
- **Tailwind classes** for styling within templates

## Data Structure

- Scripture data organized by categories (Old Testament, New Testament, Book of Mormon, Doctrine & Covenants)
- Each scripture contains `reference` and `text` properties
- Game state managed through reactive Vue refs and computed properties

## Naming Conventions

- **Files**: kebab-case for components (`HelloWorld.vue`)
- **Variables**: camelCase for JavaScript/TypeScript
- **CSS Classes**: Tailwind utility classes
- **Components**: PascalCase for Vue component names
