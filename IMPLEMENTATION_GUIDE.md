# Integration Test Suite for Syncables - Implementation Guide

## 📦 What I've Created

I've developed a comprehensive integration testing framework for your Syncables project that uses publicly available OpenAPI specs. Here's what you're getting:

### Files Created

1. **`api-test-config.ts`** - Configuration for 10+ public APIs
2. **`syncables-integration-tests.ts`** - Main test suite framework
3. **`jsonplaceholder.test.ts`** - Complete example test implementation
4. **`test-helpers.ts`** - Reusable utility functions
5. **`INTEGRATION_TESTS_README.md`** - Complete documentation
6. **This file** - Implementation guide

## 🎯 Key Features

### Public APIs Configured (No Auth Required)
- ✅ **JSONPlaceholder** - 100 posts, 500 comments, 10 users
- ✅ **Swagger PetStore** - Classic REST API example
- ✅ **REST Countries** - ~250 countries data
- ✅ **Random User** - Generate test user data

### APIs Requiring Keys (Free Tier Available)
- 🔑 **GitHub API** - Repos, issues, users
- 🔑 **Stripe API** - Customers, charges (test mode)
- 🔑 **Spotify API** - Music catalog
- 🔑 **TMDB** - Movie database
- 🔑 **NASA API** - Space data
- 🔑 **OpenWeatherMap** - Weather data

### Pagination Strategies Tested
1. **Page Number** (GitHub, TMDB, Random User)
2. **Offset** (Spotify)
3. **Cursor/Token** (Stripe)
4. **Date Range** (NASA APOD)
5. **No Pagination** (JSONPlaceholder, REST Countries)

## 🚀 Quick Start

### 1. Install in Your Project

```bash
# Copy files to your __tests__/integration directory
cp api-test-config.ts __tests__/integration/
cp syncables-integration-tests.ts __tests__/integration/
cp test-helpers.ts __tests__/integration/
cp jsonplaceholder.test.ts __tests__/integration/public-apis/

# Or create the directory structure first
mkdir -p __tests__/integration/public-apis
```

### 2. Run Tests Without Authentication

```bash
# Test against JSONPlaceholder (always works)
npm test -- jsonplaceholder.test.ts

# Or with Jest
jest __tests__/integration/public-apis/jsonplaceholder.test.ts
```

### 3. Set Up Authentication (Optional)

```bash
# Create .env.test file
cat > .env.test << EOF
# GitHub (create at https://github.com/settings/tokens)
GITHUB_TOKEN=ghp_xxxxxxxxxxxx

# Stripe (get from https://dashboard.stripe.com/test/apikeys)
STRIPE_API_KEY=sk_test_xxxxxxxxxxxx

# NASA (get from https://api.nasa.gov/)
NASA_API_KEY=DEMO_KEY

# TMDB (get from https://www.themoviedb.org/settings/api)
TMDB_API_KEY=xxxxxxxxxxxx

# Database
TEST_DB_CONN=postgresql://syncables:syncables@localhost:5432/db_integration_tests
EOF
```

## 📊 Test Coverage

### What Gets Tested

1. **Pagination Correctness**
   - All items fetched across multiple pages
   - Proper handling of page boundaries
   - Correct stopping conditions

2. **Data Validation**
   - Response structure matches schema
   - Required fields are present
   - Data types are correct
   - Unique IDs are maintained

3. **Error Handling**
   - 404 for non-existent resources
   - 429 rate limiting with retry
   - 5xx server errors
   - Malformed JSON responses

4. **Performance**
   - Large dataset handling (10,000+ items)
   - Concurrent request support
   - Response time monitoring

5. **Edge Cases**
   - Empty result sets
   - Single item responses
   - Nested pagination paths
   - Custom query parameters

## 🛠️ Adding a New API Test

### Example: Adding the CoinGecko Crypto API

```typescript
// 1. Add to api-test-config.ts
{
  name: 'CoinGecko',
  category: 'rest',
  specUrl: 'https://api.coingecko.com/api/v3/coins/list',
  specType: 'openapi',
  authentication: { type: 'none' },
  endpoints: [
    {
      path: '/coins/markets',
      syncableName: 'crypto-markets',
      paginationStrategy: 'pageNumber',
      itemsPathInResponse: [],
      expectedBehavior: {
        minItems: 100,
        supportsFiltering: true,
      },
      testScenarios: [
        {
          name: 'fetch top 100 coins',
          description: 'Get market data for top cryptocurrencies',
          queryParams: { 
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: '100',
            page: '1'
          },
        },
      ],
    },
  ],
}

// 2. Create coingecko.test.ts
describe('CoinGecko Integration Tests', () => {
  it('should fetch crypto market data', async () => {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10'
    );
    const coins = await response.json();
    
    expect(coins.length).toBe(10);
    expect(coins[0]).toHaveProperty('symbol');
    expect(coins[0]).toHaveProperty('current_price');
  });
});
```

## 📁 Recommended Project Structure

```
syncables/
├── __tests__/
│   ├── integration/
│   │   ├── public-apis/
│   │   │   ├── jsonplaceholder.test.ts
│   │   │   ├── github.test.ts
│   │   │   ├── stripe.test.ts
│   │   │   └── ...
│   │   ├── pagination-strategies/
│   │   │   ├── page-number.test.ts
│   │   │   ├── offset.test.ts
│   │   │   └── page-token.test.ts
│   │   ├── api-test-config.ts
│   │   ├── test-helpers.ts
│   │   └── README.md
│   └── unit/
│       └── ...
├── openapi/
│   ├── oad/
│   ├── overlay/
│   └── generated/
└── src/
    └── ...
```

## 🎓 Example Usage Patterns

### Pattern 1: Test Against Live API

```typescript
import { fetchAndCacheSpec, testPagination } from './test-helpers';

it('should paginate through GitHub repos', async () => {
  const result = await testPagination(
    'https://api.github.com',
    '/users/octocat/repos',
    'pageNumber',
    { pageSize: 30, maxPages: 5 }
  );
  
  expect(result.totalItems).toBeGreaterThan(0);
  expect(result.pagesVisited).toBeGreaterThan(0);
});
```

### Pattern 2: Use Mock Data

```typescript
import { generateMockData, mockTemplates } from './test-helpers';

it('should handle large datasets', async () => {
  const mockUsers = generateMockData(10000, mockTemplates.user);
  
  // Setup mock server with this data
  // Test syncable with mocked responses
  
  expect(mockUsers.length).toBe(10000);
});
```

### Pattern 3: Validate Response Structure

```typescript
import { validateResponseStructure } from './test-helpers';

it('should have valid post structure', async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const post = await response.json();
  
  const validation = validateResponseStructure(post, [
    'id', 'userId', 'title', 'body'
  ]);
  
  expect(validation.valid).toBe(true);
  expect(validation.missing).toEqual([]);
});
```

## 🔧 Configuration Options

### Customize Test Behavior

```typescript
// In your test file
const TEST_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  dbConn: process.env.TEST_DB_CONN,
  rateLimits: {
    github: 60, // requests per hour
    stripe: 100,
  },
  mockServerPort: 3001,
};
```

### Environment-Specific Settings

```typescript
// test-config.ts
export const config = {
  ci: {
    useMockData: true,
    skipLiveTests: true,
    timeout: 10000,
  },
  local: {
    useMockData: false,
    skipLiveTests: false,
    timeout: 30000,
  },
};

const env = process.env.CI ? 'ci' : 'local';
export default config[env];
```

## 📈 Performance Monitoring

```typescript
import { PerformanceMonitor } from './test-helpers';

describe('Performance Tests', () => {
  const monitor = new PerformanceMonitor();

  it('should track sync performance', async () => {
    const stop = monitor.start('fullFetch');
    
    // Run your sync operation
    await syncable.fullFetch();
    
    stop();
    
    const stats = monitor.getStats('fullFetch');
    expect(stats.avg).toBeLessThan(5000); // 5 seconds
  });

  afterAll(() => {
    monitor.report(); // Print performance report
  });
});
```

## 🐛 Debugging Tips

### 1. Enable Verbose Logging

```typescript
const syncable = new Syncable({
  // ... config
  debug: true,
  logLevel: 'verbose',
});
```

### 2. Inspect API Responses

```typescript
it('should debug API response', async () => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  
  console.log('Response:', JSON.stringify(data, null, 2));
  console.log('Headers:', response.headers);
  
  // Your assertions
});
```

### 3. Test Individual Pagination

```typescript
it('should test specific page', async () => {
  const response = await fetch(
    'https://api.github.com/repos/octocat/Hello-World/issues?page=2&per_page=10'
  );
  
  const issues = await response.json();
  console.log(`Page 2 has ${issues.length} items`);
});
```

## ✅ Next Steps

1. **Copy Files** - Move the generated files to your project
2. **Run Example Test** - Try the JSONPlaceholder test first
3. **Add Your APIs** - Configure APIs specific to your use case
4. **Set Up CI/CD** - Integrate tests into your pipeline
5. **Monitor Performance** - Track sync performance over time

## 📚 Additional Resources

- [Public APIs List](https://github.com/public-apis/public-apis) - 1000+ free APIs
- [OpenAPI Directory](https://github.com/APIs-guru/openapi-directory) - OpenAPI specs
- [Syncables Docs](../README.md) - Main project documentation

## 💡 Pro Tips

1. **Start Simple** - Begin with no-auth APIs like JSONPlaceholder
2. **Cache Specs** - Cache OpenAPI specs to speed up tests
3. **Use Mocks for CI** - Mock data prevents rate limit issues
4. **Test Edge Cases** - Empty results, errors, large datasets
5. **Monitor Performance** - Track sync times as your data grows

---

**Questions?** Check the main README or create an issue on GitHub!
