---
name: hono
description: Use when developing Hono routes, middleware, or API handlers. Supports documentation search, API reference lookup, request testing, and bundle optimization via Hono CLI. Also use when encountering Hono-specific errors (c.env, c.req, middleware chaining).
---

# Hono Skill

Develop Hono applications efficiently using Hono CLI (`@hono/cli`).

## Setup

You can use Hono CLI without global installation via npx:

```bash
npx @hono/cli <command>
```

Or install globally (optional):

```bash
npm install -g @hono/cli
```

## Commands for AI

### 1. Search Documentation

```bash
hono search "<query>" --pretty
```

Search for Hono APIs and features. Use `--pretty` for human-readable output.

### 2. View Documentation

```bash
hono docs [path]
```

Display detailed documentation for a specific path found in search results.

**Examples:**

```bash
hono docs /docs/api/context
hono docs /docs/api/hono
hono docs /docs/helpers/factory
```

### 3. Request Testing

```bash
# GET request
hono request [file] -P /path

# POST request
hono request [file] -X POST -P /api/users -d '{"name": "test"}'

# Request with headers
hono request [file] -H "Authorization: Bearer token" -P /api/protected
```

Uses `app.request()` internally, so no server startup required for testing.

### 4. Optimization & Bundling

```bash
# Bundle optimization
hono optimize [entry] -o dist/index.js

# With minification
hono optimize [entry] -o dist/index.js --minify

# Specify target (cloudflare-workers, deno, etc.)
hono optimize [entry] -t cloudflare-workers
```

## Development Workflow

1. **Research**: Use `hono search` → `hono docs` to investigate APIs and features
2. **Implement**: Write the code
3. **Test**: Use `hono request` to test endpoints
4. **Optimize**: Use `hono optimize` for production builds when needed

## Guidelines

- Always search with `hono search` before implementing unfamiliar APIs
- Use `--pretty` flag with `hono search` (default output is JSON)
- `hono request` works without starting an HTTP server
- Search for middleware usage with `hono search "middleware name"`

## Gotchas

- **`c.req.json()` consumes body once**: Calling `c.req.json()` twice throws. Store result in a variable: `const body = await c.req.json()`.
- **`c.env` not available in middleware created outside factory**: Use `createFactory()` from `hono/factory` to get typed `env` in middleware.
- **Route order matters**: Hono matches routes top-to-bottom. Put specific routes (`/api/notes/:id`) BEFORE catch-all routes (`/api/*`).
- **`c.json()` sets Content-Type automatically**: Don't manually set `Content-Type: application/json` when using `c.json()`.
- **Error responses need `c.json()` too**: Don't return `new Response('error')` — use `c.json({ error: 'message' }, 400)` for consistent API responses.
- **Cloudflare Workers context**: In this project, Hono runs on Cloudflare Workers. Access D1 via `c.env.DB`, not via import. Never use `process.env`.
