# Integration Testing with Public APIs

This directory contains integration tests for Syncables using publicly available OpenAPI specifications. These tests validate the library's ability to handle various pagination strategies and real-world API patterns.

## Quick Start

### Running All Tests
```bash
# Run all integration tests
pnpm test:integration

# Run tests for a specific pagination strategy
pnpm test:integration -- --grep "Page Number"

# Run tests for a specific API
pnpm test:integration -- --grep "GitHub"
```

### Running Tests Against Live APIs

Some tests can run against live public APIs (no authentication required):

```bash
# Test against JSONPlaceholder (always available)
pnpm test:integration:public

# Test with authentication (set environment variables first)
export GITHUB_TOKEN=your_token_here
export STRIPE_API_KEY=your_key_here
pnpm test:integration:live
```

## Available Public APIs

### No Authentication Required 🟢
- **JSONPlaceholder** - Simple REST API for testing (100 posts, 500 comments)
- **Swagger PetStore** - Classic REST API example
- **REST Countries** - Complete country information (~250 countries)
- **Random User** - Generate random user data

### Authentication Required 🔒
- **GitHub API** - Repository, issues, users (requires personal access token)
- **Stripe API** - Payments, customers (requires API key)
- **Spotify API** - Music catalog (requires OAuth token)
- **TMDB API** - Movie database (requires API key)
- **NASA API** - Space imagery and data (free API key)
- **OpenWeatherMap** - Weather data (free API key)

## Pagination Strategies Tested

### 1. Page Number Pagination
- **Example APIs**: GitHub, TMDB, Random User
- **Query Params**: `page`, `per_page`
- **Response Format**:
  ```json
  {
    "data": [...],
    "page": 1,
    "pageSize": 20,
    "totalPages": 10
  }
  ```

### 2. Offset Pagination
- **Example APIs**: Spotify
- **Query Params**: `offset`, `limit`
- **Response Format**:
  ```json
  {
    "items": [...],
    "offset": 0,
    "limit": 20,
    "total": 1000
  }
  ```

### 3. Cursor/Token Pagination
- **Example APIs**: Stripe
- **Query Params**: `starting_after`, `limit`
- **Response Format**:
  ```json
  {
    "data": [...],
    "has_more": true,
    "starting_after": "cus_xxx"
  }
  ```

### 4. Date Range Pagination
- **Example APIs**: NASA APOD
- **Query Params**: `start_date`, `end_date`
- **Use Case**: Time-series data

### 5. No Pagination
- **Example APIs**: JSONPlaceholder, REST Countries
- **Pattern**: Single response with all data

## Adding a New Test

### Step 1: Add API Configuration

Edit `api-test-config.ts`:

```typescript
{
  name: 'Your API Name',
  category: 'rest',
  specUrl: 'https://example.com/openapi.json',
  specType: 'openapi',
  authentication: {
    type: 'apiKey',
    envVarName: 'YOUR_API_KEY',
  },
  endpoints: [
    {
      path: '/your/endpoint',
      syncableName: 'your-resource',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: ['data', 'results'],
      expectedBehavior: {
        minItems: 10,
        supportsFiltering: true,
      },
      testScenarios: [
        {
          name: 'basic fetch',
          description: 'Fetch all items',
        },
      ],
    },
  ],
}
```

### Step 2: Create OpenAPI Overlay (if needed)

If the API doesn't define syncables, create an overlay:

```yaml
# overlay/your-api-overlay.yaml
overlay: 1.0.0
info:
  title: Your API Syncables Overlay
  version: 1.0.0
actions:
  - target: "$.paths['/your/endpoint'].get.responses['200'].content['application/json']"
    update:
      syncable:
        name: "your-resource"
        paginationStrategy: "pageNumber"
        itemsPathInResponse: ["data", "results"]
        defaultPageSize: 20
        forcePageSize: true
```

### Step 3: Write the Test

```typescript
describe('Your API Integration', () => {
  it('should sync your resource', async () => {
    const syncable = new Syncable({
      specStr: await fetchSpec('your-api'),
      syncableName: 'your-resource',
      authHeaders: {
        'X-API-Key': process.env.YOUR_API_KEY
      },
      dbConn: testDbConn,
    });

    await syncable.fullFetch();
    const results = await syncable.getAll();
    
    expect(results.length).toBeGreaterThan(0);
  });
});
```

## Test Structure

```
__tests__/
├── integration/
│   ├── public-apis/
│   │   ├── github.test.ts
│   │   ├── stripe.test.ts
│   │   ├── jsonplaceholder.test.ts
│   │   └── ...
│   ├── pagination-strategies/
│   │   ├── page-number.test.ts
│   │   ├── offset.test.ts
│   │   ├── page-token.test.ts
│   │   └── date-range.test.ts
│   ├── mock-server/
│   │   └── index.ts
│   ├── api-test-config.ts
│   └── test-helpers.ts
└── unit/
    └── ...
```

## Mock Server Setup

For APIs that require authentication or have rate limits, use the mock server:

```typescript
import { setupMockServer } from './mock-server';

describe('Stripe API (Mocked)', () => {
  let mockServer;

  beforeAll(async () => {
    mockServer = await setupMockServer({
      spec: stripeSpec,
      endpoints: {
        '/v1/customers': {
          paginationStrategy: 'pageToken',
          mockData: generateCustomers(100),
        },
      },
    });
  });

  afterAll(async () => {
    await mockServer.stop();
  });

  it('should sync customers', async () => {
    // Test implementation
  });
});
```

## Environment Variables

Create a `.env.test` file:

```bash
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Stripe
STRIPE_API_KEY=sk_test_xxxxxxxxxxxx

# Spotify (OAuth)
SPOTIFY_ACCESS_TOKEN=Bearer xxxxxxxxxxxx

# TMDB
TMDB_API_KEY=xxxxxxxxxxxx

# NASA
NASA_API_KEY=DEMO_KEY

# OpenWeatherMap
OPENWEATHER_API_KEY=xxxxxxxxxxxx

# Database
TEST_DB_CONN=postgresql://syncables:syncables@localhost:5432/db_integration_tests
```

## Best Practices

1. **Use Mock Data**: Prefer mocked responses for CI/CD to avoid rate limits
2. **Test Edge Cases**: Empty responses, large datasets, malformed data
3. **Validate Pagination**: Ensure all items are fetched across multiple pages
4. **Check Performance**: Monitor sync time for large datasets
5. **Handle Errors**: Test retry logic, rate limiting, and error responses
6. **Document Assumptions**: Note any API-specific behaviors or quirks

## Troubleshooting

### Rate Limiting Issues
```typescript
const syncable = new Syncable({
  // ... other config
  retryConfig: {
    maxRetries: 5,
    backoffMs: 1000,
    respectRateLimits: true,
  },
});
```

### Authentication Failures
```bash
# Verify your token is valid
curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user

# Check token scopes
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/users/octocat -I | grep X-OAuth-Scopes
```

### Database Connection Issues
```bash
# Ensure PostgreSQL is running
docker compose up -d

# Check connection
docker exec -it db psql postgresql://syncables:syncables@localhost:5432/db_integration_tests -c "\d+"
```

## Contributing

When adding new tests:
1. Ensure the API is publicly accessible
2. Document authentication requirements
3. Include test scenarios for edge cases
4. Add overlay files for syncable configuration
5. Update this README with the new API

## Resources

- [OpenAPI Directory](https://github.com/APIs-guru/openapi-directory) - Large collection of public API specs
- [Syncables Documentation](../README.md) - Main project documentation
- [Public APIs List](https://github.com/public-apis/public-apis) - Curated list of free APIs
