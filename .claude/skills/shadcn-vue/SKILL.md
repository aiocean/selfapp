---
name: shadcn-vue
description: shadcn-vue for Vue/Nuxt with Reka UI components and Tailwind. Use for accessible UI, Auto Form, data tables, charts, dark mode, MCP server setup, or encountering component imports, Reka UI errors.
---

# shadcn-vue

---

## Quick Start (3 Minutes)

### For Vue Projects (Vite)

#### 1. Initialize shadcn-vue

```bash
npx shadcn-vue@latest init
```

**During initialization**:

- Style: `New York` or `Default` (cannot change later!)
- Base color: `Slate` (recommended)
- CSS variables: `Yes` (required for dark mode)

#### 2. Configure TypeScript Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 3. Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite"; // Tailwind v4
import path from "path";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

#### 4. Add Your First Component

```bash
npx shadcn-vue@latest add button
```

---

## Quick Reference

| Need                    | Command or file                                    |
| ----------------------- | -------------------------------------------------- |
| Initialize project      | `npx shadcn-vue@latest init`                       |
| Add component           | `npx shadcn-vue@latest add button`                 |
| Add multiple components | `npx shadcn-vue@latest add button card dialog`     |
| Build registry JSON     | `npx shadcn-vue@latest build`                      |
| Enable CSS variables    | `components.json` → `tailwind.cssVariables: true`  |

---

## Critical Rules

### Always Do

- **Run `init` before adding components** — Creates required configuration and utilities
- **Use CSS variables for theming** (`cssVariables: true`) — Enables dark mode support
- **Configure TypeScript path aliases** — Required for component imports
- **Keep components.json in version control** — Team members need same configuration

### Never Do

- **Don't change `style` after initialization** — Requires complete reinstall
- **Don't mix Radix Vue and Reka UI v2** — Incompatible component APIs
- **Don't skip TypeScript configuration** — Component imports will fail
- **Don't use without Tailwind CSS** — Components are styled with Tailwind

---

## CLI Commands Reference

### init Command

```bash
# Initialize in current directory
npx shadcn-vue@latest init

# Initialize in specific directory (monorepo)
npx shadcn-vue@latest init -c ./apps/web
```

### add Command

```bash
# Add single component
npx shadcn-vue@latest add button

# Add multiple components
npx shadcn-vue@latest add button card dialog

# Add all components
npx shadcn-vue@latest add --all
```

### diff Command

```bash
# Check for component updates
npx shadcn-vue@latest diff button
```

---

## Configuration

shadcn-vue uses `components.json` to configure:

- Component paths (`@/components/ui`)
- Utils location (`@/lib/utils`)
- Tailwind config paths
- TypeScript paths

**Full example:** Generate via `npx shadcn-vue@latest init`

---

## Common Mistakes

- Running `add` before `init` and missing `components.json`
- Mis-typed registry namespaces (`@namespace/component`)
- Using CSS variable classes without `tailwind.cssVariables: true`
- Forgetting to enable the MCP server in the client UI/config

---

## Utils Library

The `@/lib/utils.ts` file provides the `cn()` helper for merging Tailwind classes:

- Combines multiple className strings
- Uses `clsx` + `tailwind-merge` for conflict resolution

**Auto-generated** by `shadcn-vue init` - no manual setup needed.

---

## Theming & Dark Mode

### Enable dark mode

Use `class` strategy with a composable to toggle `.dark` on `<html>`:

```typescript
// composables/useDarkMode.ts
import { ref, watchEffect } from 'vue'

const isDark = ref(false)

export function useDarkMode() {
  watchEffect(() => {
    document.documentElement.classList.toggle('dark', isDark.value)
  })
  return { isDark, toggle: () => (isDark.value = !isDark.value) }
}
```

### Customize theme

Override CSS variables in your global CSS:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --primary-foreground: 222.2 47.4% 11.2%;
  /* ... */
}
```

---

## Component Categories

- **Layout**: Accordion, Card, Collapsible, Resizable, Separator, Sheet, Sidebar
- **Forms**: Button, Checkbox, Form, Input, Label, Radio Group, Select, Slider, Switch, Textarea, Toggle
- **Data Display**: Avatar, Badge, Calendar, Chart, Data Table, Table
- **Feedback**: Alert, Alert Dialog, Dialog, Drawer, Popover, Sonner/Toast, Tooltip
- **Navigation**: Breadcrumb, Command, Context Menu, Dropdown Menu, Menubar, Navigation Menu, Pagination, Tabs
