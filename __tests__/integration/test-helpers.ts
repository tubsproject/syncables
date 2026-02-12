/**
 * Test Helper Utilities
 * Common functions for setting up and running integration tests
 */

import fetch from 'node-fetch';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Fetch and cache OpenAPI spec
 */
export async function fetchAndCacheSpec(
  name: string,
  url: string,
  cacheDir: string = './test-cache/specs',
): Promise<string> {
  const cachePath = join(cacheDir, `${name}.json`);

  // Check cache first
  if (existsSync(cachePath)) {
    console.log(`Using cached spec for ${name}`);
    return readFileSync(cachePath, 'utf-8');
  }

  console.log(`Fetching spec for ${name} from ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const spec = await response.text();

    // Cache for future use
    writeFileSync(cachePath, spec, 'utf-8');

    return spec;
  } catch (error) {
    throw new Error(`Failed to fetch spec for ${name}: ${error.message}`);
  }
}

/**
 * Apply overlay to OpenAPI spec
 */
export async function applyOverlay(
  baseSpec: string,
  overlayPath: string,
): Promise<string> {
  // This would use the overlayjs library in a real implementation
  // For now, return the base spec
  // const { Overlay } = await import('@overlay-spec/overlay');
  // const overlay = new Overlay(baseSpec, overlayPath);
  // return overlay.apply();

  return baseSpec;
}

/**
 * Generate basic syncable overlay
 */
export function generateSyncableOverlay(config: {
  path: string;
  syncableName: string;
  paginationStrategy: string;
  itemsPath?: string[];
  pageSize?: number;
}): string {
  const {
    path,
    syncableName,
    paginationStrategy,
    itemsPath = [],
    pageSize = 20,
  } = config;

  return `
overlay: 1.0.0
info:
  title: ${syncableName} Syncables Overlay
  version: 1.0.0
actions:
  - target: "$.paths['${path}'].get.responses['200'].content['application/json']"
    update:
      syncable:
        name: "${syncableName}"
        paginationStrategy: "${paginationStrategy}"
        itemsPathInResponse: ${JSON.stringify(itemsPath)}
        defaultPageSize: ${pageSize}
        forcePageSize: true
`;
}

/**
 * Test helper to verify pagination works correctly
 */
export async function testPagination(
  baseUrl: string,
  path: string,
  strategy: 'pageNumber' | 'offset' | 'pageToken',
  options: {
    pageSize?: number;
    maxPages?: number;
  } = {},
): Promise<{
  totalItems: number;
  pagesVisited: number;
  strategy: string;
}> {
  const { pageSize = 20, maxPages = 10 } = options;
  const allItems: any[] = [];
  let pagesVisited = 0;
  let hasMore = true;

  // Strategy-specific parameters
  let page = 1;
  let offset = 0;
  let pageToken: string | undefined;

  while (hasMore && pagesVisited < maxPages) {
    let url = `${baseUrl}${path}?`;

    switch (strategy) {
      case 'pageNumber':
        url += `page=${page}&per_page=${pageSize}`;
        break;
      case 'offset':
        url += `offset=${offset}&limit=${pageSize}`;
        break;
      case 'pageToken':
        if (pageToken) {
          url += `pageToken=${pageToken}&limit=${pageSize}`;
        } else {
          url += `limit=${pageSize}`;
        }
        break;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Extract items based on common response patterns
    const items = data.data || data.items || data.results || data;

    if (!Array.isArray(items) || items.length === 0) {
      hasMore = false;
      break;
    }

    allItems.push(...items);
    pagesVisited++;

    // Update pagination parameters
    page++;
    offset += pageSize;
    pageToken = data.nextPageToken || data.next_page_token;

    // Check if there are more pages
    if (strategy === 'pageToken' && !pageToken) {
      hasMore = false;
    } else if (items.length < pageSize) {
      hasMore = false;
    }
  }

  return {
    totalItems: allItems.length,
    pagesVisited,
    strategy,
  };
}

/**
 * Validate API response structure
 */
export function validateResponseStructure(
  response: any,
  expectedFields: string[],
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  expectedFields.forEach((field) => {
    if (!response.hasOwnProperty(field)) {
      missing.push(field);
    }
  });

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Generate mock data for testing
 */
export function generateMockData(
  count: number,
  template: (index: number) => any,
): any[] {
  return Array.from({ length: count }, (_, i) => template(i));
}

/**
 * Common mock data templates
 */
export const mockTemplates = {
  user: (index: number) => ({
    id: index + 1,
    username: `user${index + 1}`,
    email: `user${index + 1}@example.com`,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }),

  post: (index: number) => ({
    id: index + 1,
    title: `Post ${index + 1}`,
    body: `This is the content of post ${index + 1}`,
    authorId: (index % 10) + 1,
    createdAt: new Date(Date.now() - index * 3600000).toISOString(),
  }),

  product: (index: number) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: (index + 1) * 10,
    category: ['electronics', 'clothing', 'food'][index % 3],
    inStock: index % 2 === 0,
  }),

  event: (index: number) => ({
    id: index + 1,
    name: `Event ${index + 1}`,
    date: new Date(Date.now() + index * 86400000).toISOString(),
    location: `Venue ${(index % 5) + 1}`,
    capacity: 100 + index * 10,
  }),
};

/**
 * Retry helper for flaky network requests
 */
export async function retryRequest<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoffMultiplier?: number;
  } = {},
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, backoffMultiplier = 2 } = options;

  let lastError: Error | undefined;
  let currentDelay = delayMs;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        console.log(
          `Attempt ${attempt + 1} failed, retrying in ${currentDelay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= backoffMultiplier;
      }
    }
  }

  throw new Error(
    `Request failed after ${maxRetries + 1} attempts: ${lastError?.message}`,
  );
}

/**
 * Rate limiter for API requests
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  constructor(requestsPerSecond: number) {
    this.maxTokens = requestsPerSecond;
    this.refillRate = requestsPerSecond;
    this.tokens = requestsPerSecond;
    this.lastRefill = Date.now();
  }

  async acquire(): Promise<void> {
    while (true) {
      const now = Date.now();
      const timePassed = (now - this.lastRefill) / 1000;
      this.tokens = Math.min(
        this.maxTokens,
        this.tokens + timePassed * this.refillRate,
      );
      this.lastRefill = now;

      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }

      const waitTime = ((1 - this.tokens) / this.refillRate) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

/**
 * Database helper for test setup/teardown
 */
export class TestDatabase {
  constructor(private connectionString: string) {}

  async setup(): Promise<void> {
    // Create test database tables if needed
    console.log('Setting up test database...');
    // Implementation would go here
  }

  async teardown(): Promise<void> {
    // Clean up test data
    console.log('Tearing down test database...');
    // Implementation would go here
  }

  async clear(): Promise<void> {
    // Clear all test data without dropping tables
    console.log('Clearing test database...');
    // Implementation would go here
  }
}

/**
 * Environment variable helper
 */
export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable ${name} is not set`);
  }
  return value;
}

export function getOptionalEnvVar(
  name: string,
  defaultValue: string = '',
): string {
  return process.env[name] || defaultValue;
}

/**
 * Test data assertions
 */
export const assertions = {
  isValidEmail: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  isValidISO8601: (date: string): boolean => {
    const d = new Date(date);
    return !isNaN(d.getTime()) && d.toISOString() === date;
  },

  isPositiveInteger: (n: any): boolean => {
    return Number.isInteger(n) && n > 0;
  },
};

/**
 * Performance measurement helper
 */
export class PerformanceMonitor {
  private measurements: Map<string, number[]> = new Map();

  start(label: string): () => void {
    const startTime = Date.now();

    return () => {
      const duration = Date.now() - startTime;

      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }

      this.measurements.get(label)!.push(duration);
    };
  }

  getStats(label: string): {
    count: number;
    min: number;
    max: number;
    avg: number;
    median: number;
  } | null {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);

    return {
      count: measurements.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      median: sorted[Math.floor(sorted.length / 2)],
    };
  }

  report(): void {
    console.log('\n=== Performance Report ===');

    for (const [label, _] of this.measurements) {
      const stats = this.getStats(label);
      if (stats) {
        console.log(`\n${label}:`);
        console.log(`  Count: ${stats.count}`);
        console.log(`  Min: ${stats.min}ms`);
        console.log(`  Max: ${stats.max}ms`);
        console.log(`  Avg: ${stats.avg.toFixed(2)}ms`);
        console.log(`  Median: ${stats.median}ms`);
      }
    }

    console.log('\n========================\n');
  }
}

/**
 * Export all utilities
 */
export default {
  fetchAndCacheSpec,
  applyOverlay,
  generateSyncableOverlay,
  testPagination,
  validateResponseStructure,
  generateMockData,
  mockTemplates,
  retryRequest,
  RateLimiter,
  TestDatabase,
  getRequiredEnvVar,
  getOptionalEnvVar,
  assertions,
  PerformanceMonitor,
};
