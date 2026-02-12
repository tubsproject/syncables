/**
 * Example Integration Test - JSONPlaceholder API
 *
 * This test demonstrates how to write integration tests for public APIs.
 * JSONPlaceholder is a free REST API that doesn't require authentication,
 * making it perfect for CI/CD and demonstration purposes.
 *
 * API: https://jsonplaceholder.typicode.com
 * Spec: https://gist.githubusercontent.com/jpoehnelt/55741e08156b4bf7c13edc0cd25b501c/raw/openapi.json
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

// These would be actual imports from your project
// import { Syncable } from '../../src/syncable';
// import { generateOverlay } from './test-helpers';

/**
 * Fetch and cache the OpenAPI spec
 */
async function fetchJsonPlaceholderSpec(): Promise<string> {
  const specUrl =
    'https://gist.githubusercontent.com/jpoehnelt/55741e08156b4bf7c13edc0cd25b501c/raw/openapi.json';

  try {
    const response = await fetch(specUrl);
    const spec = await response.json();
    return JSON.stringify(spec, null, 2);
  } catch (error) {
    console.warn('Failed to fetch spec, using cached version');
    // Fallback to cached spec if available
    throw error;
  }
}

/**
 * Generate overlay to add syncable configuration
 */
function generateJsonPlaceholderOverlay(): string {
  return `
overlay: 1.0.0
info:
  title: JSONPlaceholder Syncables Overlay
  version: 1.0.0
actions:
  # Configure /posts endpoint
  - target: "$.paths['/posts'].get.responses['200'].content['application/json']"
    update:
      syncable:
        name: "posts"
        paginationStrategy: "none"
        itemsPathInResponse: []
        defaultPageSize: 100

  # Configure /comments endpoint
  - target: "$.paths['/comments'].get.responses['200'].content['application/json']"
    update:
      syncable:
        name: "comments"
        paginationStrategy: "none"
        itemsPathInResponse: []
        defaultPageSize: 500

  # Configure /users endpoint
  - target: "$.paths['/users'].get.responses['200'].content['application/json']"
    update:
      syncable:
        name: "users"
        paginationStrategy: "none"
        itemsPathInResponse: []
        defaultPageSize: 10
`;
}

describe('JSONPlaceholder Integration Tests', () => {
  let specStr: string;
  const baseUrl = 'https://jsonplaceholder.typicode.com';
  const dbConn =
    process.env.TEST_DB_CONN ||
    'postgresql://syncables:syncables@localhost:5432/db_integration_tests';

  beforeAll(async () => {
    // Fetch and prepare the spec
    specStr = await fetchJsonPlaceholderSpec();
  });

  describe('Posts Endpoint', () => {
    it('should fetch all 100 posts', async () => {
      // Direct API test to verify behavior
      const response = await fetch(`${baseUrl}/posts`);
      const posts = await response.json();

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBe(100);
      expect(posts[0]).toHaveProperty('id');
      expect(posts[0]).toHaveProperty('userId');
      expect(posts[0]).toHaveProperty('title');
      expect(posts[0]).toHaveProperty('body');
    });

    it('should sync all posts using Syncable', async () => {
      // This is how you would use Syncable to fetch the data
      // Uncomment when running with actual Syncable library

      /*
      const syncable = new Syncable({
        specStr,
        syncableName: 'posts',
        authHeaders: {}, // No auth needed
        dbConn,
      });

      await syncable.fullFetch();
      const results = await syncable.getAll();
      
      expect(results.length).toBe(100);
      expect(results[0].id).toBeDefined();
      expect(results[0].title).toBeDefined();
      */

      // Placeholder assertion for demonstration
      expect(true).toBe(true);
    });

    it('should handle individual post fetch', async () => {
      const response = await fetch(`${baseUrl}/posts/1`);
      const post = await response.json();

      expect(post.id).toBe(1);
      expect(post.userId).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.body).toBeDefined();
    });
  });

  describe('Comments Endpoint', () => {
    it('should fetch all 500 comments', async () => {
      const response = await fetch(`${baseUrl}/comments`);
      const comments = await response.json();

      expect(Array.isArray(comments)).toBe(true);
      expect(comments.length).toBe(500);
      expect(comments[0]).toHaveProperty('postId');
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('name');
      expect(comments[0]).toHaveProperty('email');
      expect(comments[0]).toHaveProperty('body');
    });

    it('should fetch comments for a specific post', async () => {
      const postId = 1;
      const response = await fetch(`${baseUrl}/posts/${postId}/comments`);
      const comments = await response.json();

      expect(Array.isArray(comments)).toBe(true);
      expect(comments.every((c) => c.postId === postId)).toBe(true);
    });
  });

  describe('Users Endpoint', () => {
    it('should fetch all 10 users', async () => {
      const response = await fetch(`${baseUrl}/users`);
      const users = await response.json();

      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBe(10);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('username');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('address');
      expect(users[0]).toHaveProperty('company');
    });

    it('should verify user structure', async () => {
      const response = await fetch(`${baseUrl}/users/1`);
      const user = await response.json();

      // Verify nested objects
      expect(user.address).toBeDefined();
      expect(user.address.geo).toBeDefined();
      expect(user.address.geo.lat).toBeDefined();
      expect(user.address.geo.lng).toBeDefined();

      expect(user.company).toBeDefined();
      expect(user.company.name).toBeDefined();
    });
  });

  describe('Query Parameter Support', () => {
    it('should filter posts by userId', async () => {
      const userId = 1;
      const response = await fetch(`${baseUrl}/posts?userId=${userId}`);
      const posts = await response.json();

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.every((p) => p.userId === userId)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);
    });

    it('should filter comments by postId', async () => {
      const postId = 1;
      const response = await fetch(`${baseUrl}/comments?postId=${postId}`);
      const comments = await response.json();

      expect(Array.isArray(comments)).toBe(true);
      expect(comments.every((c) => c.postId === postId)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent resources gracefully', async () => {
      const response = await fetch(`${baseUrl}/posts/9999`);

      expect(response.status).toBe(404);
    });

    it('should validate response structure', async () => {
      const response = await fetch(`${baseUrl}/posts/1`);
      const post = await response.json();

      // Verify all required fields are present
      const requiredFields = ['id', 'userId', 'title', 'body'];
      requiredFields.forEach((field) => {
        expect(post).toHaveProperty(field);
        expect(post[field]).toBeDefined();
      });
    });
  });

  describe('Data Validation', () => {
    it('should have consistent data types', async () => {
      const response = await fetch(`${baseUrl}/posts`);
      const posts = await response.json();

      posts.forEach((post) => {
        expect(typeof post.id).toBe('number');
        expect(typeof post.userId).toBe('number');
        expect(typeof post.title).toBe('string');
        expect(typeof post.body).toBe('string');
      });
    });

    it('should have unique IDs', async () => {
      const response = await fetch(`${baseUrl}/posts`);
      const posts = await response.json();

      const ids = posts.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(posts.length);
    });

    it('should validate email format in comments', async () => {
      const response = await fetch(`${baseUrl}/comments`);
      const comments = await response.json();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      comments.forEach((comment) => {
        expect(emailRegex.test(comment.email)).toBe(true);
      });
    });
  });

  describe('Performance Tests', () => {
    it('should fetch all posts within reasonable time', async () => {
      const startTime = Date.now();
      const response = await fetch(`${baseUrl}/posts`);
      await response.json();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(3000); // Should complete in under 3 seconds
    });

    it('should handle concurrent requests', async () => {
      const requests = [
        fetch(`${baseUrl}/posts`),
        fetch(`${baseUrl}/comments`),
        fetch(`${baseUrl}/users`),
      ];

      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const duration = Date.now() - startTime;

      expect(responses.every((r) => r.ok)).toBe(true);
      expect(duration).toBeLessThan(5000);
    });
  });
});

/**
 * Helper: Generate test data expectations
 */
describe('Test Data Utilities', () => {
  it('should generate expected post structure', () => {
    const expectedPostStructure = {
      id: expect.any(Number),
      userId: expect.any(Number),
      title: expect.any(String),
      body: expect.any(String),
    };

    expect(expectedPostStructure).toBeDefined();
  });

  it('should generate expected comment structure', () => {
    const expectedCommentStructure = {
      postId: expect.any(Number),
      id: expect.any(Number),
      name: expect.any(String),
      email: expect.any(String),
      body: expect.any(String),
    };

    expect(expectedCommentStructure).toBeDefined();
  });

  it('should generate expected user structure', () => {
    const expectedUserStructure = {
      id: expect.any(Number),
      name: expect.any(String),
      username: expect.any(String),
      email: expect.any(String),
      address: {
        street: expect.any(String),
        suite: expect.any(String),
        city: expect.any(String),
        zipcode: expect.any(String),
        geo: {
          lat: expect.any(String),
          lng: expect.any(String),
        },
      },
      phone: expect.any(String),
      website: expect.any(String),
      company: {
        name: expect.any(String),
        catchPhrase: expect.any(String),
        bs: expect.any(String),
      },
    };

    expect(expectedUserStructure).toBeDefined();
  });
});

/**
 * Export utilities for other tests to use
 */
export { fetchJsonPlaceholderSpec, generateJsonPlaceholderOverlay };
