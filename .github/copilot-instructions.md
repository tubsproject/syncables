# Syncables: AI Coding Agent Guide

## Project Overview
**Syncables** is a TypeScript-based sync engine that declaratively syncs paginated collections from APIs using extended OpenAPI specifications. It transforms OpenAPI specs into type-safe data synchronization code with database persistence.

**Core Flow:** OpenAPI spec + overlays → merged spec with `syncable` metadata → Syncer parses spec → fetches data with pagination → persists to database

## Architecture

### Major Components

1. **Syncer** (`src/syncer.ts`)
   - Main orchestrator class that extends `EventEmitter`
   - Parses OpenAPI specs to extract `syncable` objects from response schemas
   - Handles all pagination strategies and data fetching
   - Manages auth headers and provides `fullFetch()` method for complete data synchronization
   - Supports database persistence via PostgreSQL client

2. **Database Layer** (`src/db.ts`)
   - PostgreSQL client management via `pg` package
   - Schema generation from OpenAPI properties to SQL types (string → TEXT, number → INTEGER, boolean → BOOLEAN)
   - Table creation and data insertion logic
   - `getFields()` extracts schema properties, navigating `itemsPathInResponse` array

3. **OpenAPI Spec Processing**
   - Specs are YAML/JSON with `syncable` metadata in response content
   - Overlays (in `openapi/overlay/`) augment OAD files with syncable definitions
   - Generate merged spec using: `overlayjs --openapi ./oad/acube.yaml --overlay ./overlay/acube-overlay.yaml`

4. **Pagination Strategies** (defined in `SyncableSpec.paginationStrategy`)
   - `pageNumber`: uses `page` param (customizable via `pageNumberParamInQuery`)
   - `offset`: uses `offset` param
   - `pageToken`: uses `pageToken`/`nextPageToken` path
   - `dateRange`: time-based range queries
   - `rangeHeader`: HTTP Range headers
   - `confirmationBased`: requires explicit confirmation operations
   - `none`: single request only

## Key Patterns & Conventions

### Syncable Spec Structure
Every syncable collection requires:
```typescript
{
  type: 'collection' | 'item',
  name: string,                          // e.g., 'calendars'
  paginationStrategy: string,            // one of above strategies
  itemsPathInResponse?: string[],        // path to items array in response (e.g., ['results'])
  defaultPageSize?: number,
  forcePageSize?: number,                // override API's page size
  idField?: string,                      // unique identifier field (default: 'id')
  query?: Record<string, string>,        // additional query params to append
  params?: Record<string, string>,       // templated params from other syncables (careful: cartesian product)
}
```

### Type Generation
Generate types from merged specs:
```bash
npx openapi-typescript openapi/generated/acube.yaml -o src/types/acube.d.ts
```
Then use `components['schemas']['ResourceName']` for type safety in `src/*-example.ts` files.

### Testing Patterns
- **Unit tests** (`__tests__/unit/`): Use `createSpec()` and `createFetchMock()` helpers to mock Syncer behavior without network
- **Integration tests** (`__tests__/integration/all.test.ts`): Spin up mock HTTP servers per OAD, apply overlays, test full sync cycle
- Mock server generator (`__tests__/integration/mock-server/`) synthesizes realistic responses from OpenAPI schemas using `@faker-js/faker`

### Build & Development
- **TypeScript config:** `tsconfig.json` targets ES2022, module: 'node16', sourcemaps enabled
- **Development mode:** `npm run build:watch` for active development
- **Release mode:** `npm run build:release` uses `tsconfig.release.json`
- **Examples:** `dev-example.ts` and `minimal-example.ts` in `src/` show usage patterns
- **Node requirement:** v22.11+ (see `package.json` engines and `volta`)

### Linting & Formatting
- ESLint with TypeScript support; Prettier for formatting
- Run `npm run lint` before commits (it's in `prebuild` hook)
- Run `npm run prettier --write` to auto-format
- ESLint config enforces `@typescript-eslint/explicit-function-return-type` with warnings

## Common Dev Workflows

### Adding Support for New API
1. Add OpenAPI descriptor (YAML/JSON) to `openapi/oad/`
2. Create overlay in `openapi/overlay/{service}.yaml` defining syncables with pagination metadata
3. Merge: `overlayjs --openapi ./oad/{service}.yaml --overlay ./overlay/{service}-overlay.yaml > openapi/generated/{service}.yaml`
4. Generate types: `npx openapi-typescript openapi/generated/{service}.yaml -o src/types/{service}.d.ts`
5. Test with integration test: Add service name to allowed list in `all.test.ts`, ensure `mock-server/` has OAD and overlay copies

### Debugging Pagination Issues
- Syncer emits events—listen with `syncer.on()` for progress tracking
- Check `spec.ts` test helper; use same mocking pattern for unit tests
- Pagination loops until empty response or no `nextPageToken`
- If `itemsPathInResponse` is incorrect, `getObjectPath()` throws with full dot-notation path

### Modifying Sync Logic
- Core sync loops are in `syncer.ts` methods (e.g., pagination handling)
- Database operations use `Client` from `pg` directly
- Use `getObjectPath()` utility to safely traverse nested response objects
- Auth headers passed via `Syncer` constructor—OAuth logic in `src/oauth.ts` for reference

## Known Quirks
- `noImplicitAny: false` in tsconfig—allows implicit `any` for pragmatic typing
- `strictNullChecks: false`—be explicit about null handling
- Param templating (`params` field) creates cartesian product of all parameter combinations
- Database schema prefixes columns with `S` (e.g., `Sname`, `Sid`) to avoid SQL reserved word conflicts

## File Structure Quick Reference
- `src/syncer.ts`: Main class, spec parsing, fetch orchestration
- `src/db.ts`: PostgreSQL schema/insert logic
- `src/utils.ts`: Object path navigation helpers
- `src/caching-fetch.ts`: Disk-based fetch caching for development
- `src/oauth.ts`: OAuth2 flow examples (passport-based)
- `src/configs.ts`: Hardcoded specs for demo services
- `__tests__/helpers/`: Mock utilities (`createSpec`, `createFetchMock`)
- `openapi/oad/`: Original API Descriptors
- `openapi/generated/`: Merged specs with syncable annotations

## External Dependencies to Know
- `@readme/openapi-parser`: Dereferences OpenAPI $refs
- `yaml` / `@stoplight/yaml`: YAML parsing with pointer support
- `openapi-overlays-js`: Applies overlay patches to OpenAPI specs
- `pg`: PostgreSQL client
- `hono`: Lightweight HTTP framework (used in mock server)
- `vitest`: Test runner with built-in TypeScript support

