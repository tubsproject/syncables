/**
 * Public API Test Configuration
 * This file defines all publicly available APIs to test against
 */

export interface ApiTestConfig {
  name: string;
  category: 'rest' | 'graphql' | 'grpc';
  specUrl: string;
  specType: 'openapi' | 'swagger' | 'asyncapi';
  overlayPath?: string;
  endpoints: EndpointConfig[];
  authentication?: AuthConfig;
  rateLimit?: RateLimitConfig;
}

export interface EndpointConfig {
  path: string;
  syncableName: string;
  paginationStrategy: PaginationStrategy;
  itemsPathInResponse?: string[];
  expectedBehavior: {
    minItems?: number;
    maxItems?: number;
    supportsFiltering?: boolean;
    supportsSorting?: boolean;
  };
  testScenarios: TestScenario[];
}

export type PaginationStrategy =
  | 'pageNumber'
  | 'offset'
  | 'pageToken'
  | 'dateRange'
  | 'rangeHeader'
  | 'confirmationBased'
  | 'none';

export interface AuthConfig {
  type: 'bearer' | 'apiKey' | 'oauth2' | 'basic' | 'none';
  envVarName?: string;
  headerName?: string;
}

export interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerHour?: number;
}

export interface TestScenario {
  name: string;
  description: string;
  queryParams?: Record<string, string>;
  expectedResultCount?: number;
  shouldFail?: boolean;
}

/**
 * Publicly Available API Test Configurations
 */
export const PUBLIC_API_CONFIGS: ApiTestConfig[] = [
  // GitHub API
  {
    name: 'GitHub REST API',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/github/rest-api-description/main/descriptions/api.github.com/api.github.com.json',
    specType: 'openapi',
    authentication: {
      type: 'bearer',
      envVarName: 'GITHUB_TOKEN',
    },
    rateLimit: {
      requestsPerMinute: 60,
      requestsPerHour: 5000,
    },
    endpoints: [
      {
        path: '/repos/{owner}/{repo}/issues',
        syncableName: 'issues',
        paginationStrategy: 'pageNumber',
        itemsPathInResponse: [],
        expectedBehavior: {
          minItems: 0,
          supportsFiltering: true,
          supportsSorting: true,
        },
        testScenarios: [
          {
            name: 'fetch open issues',
            description: 'Fetch all open issues for a repository',
            queryParams: { state: 'open' },
          },
          {
            name: 'fetch closed issues',
            description: 'Fetch all closed issues',
            queryParams: { state: 'closed' },
          },
        ],
      },
      {
        path: '/users/{username}/repos',
        syncableName: 'user-repos',
        paginationStrategy: 'pageNumber',
        expectedBehavior: {
          minItems: 0,
          supportsFiltering: true,
        },
        testScenarios: [
          {
            name: 'fetch user public repos',
            description: 'Fetch all public repositories for a user',
          },
        ],
      },
    ],
  },

  // Stripe API
  {
    name: 'Stripe API',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/stripe/openapi/master/openapi/spec3.json',
    specType: 'openapi',
    authentication: {
      type: 'bearer',
      envVarName: 'STRIPE_API_KEY',
    },
    endpoints: [
      {
        path: '/v1/customers',
        syncableName: 'customers',
        paginationStrategy: 'pageToken',
        itemsPathInResponse: ['data'],
        expectedBehavior: {
          minItems: 0,
          supportsFiltering: true,
        },
        testScenarios: [
          {
            name: 'fetch all customers',
            description: 'Fetch customer list using cursor pagination',
          },
          {
            name: 'fetch with limit',
            description: 'Test custom page size',
            queryParams: { limit: '50' },
          },
        ],
      },
      {
        path: '/v1/charges',
        syncableName: 'charges',
        paginationStrategy: 'pageToken',
        itemsPathInResponse: ['data'],
        expectedBehavior: {
          minItems: 0,
        },
        testScenarios: [
          {
            name: 'fetch charges',
            description: 'Fetch charge history',
          },
        ],
      },
    ],
  },

  // JSONPlaceholder (Free, no auth needed)
  {
    name: 'JSONPlaceholder',
    category: 'rest',
    specUrl:
      'https://gist.githubusercontent.com/jpoehnelt/55741e08156b4bf7c13edc0cd25b501c/raw/openapi.json',
    specType: 'openapi',
    authentication: { type: 'none' },
    endpoints: [
      {
        path: '/posts',
        syncableName: 'posts',
        paginationStrategy: 'none',
        expectedBehavior: {
          minItems: 100,
          maxItems: 100,
        },
        testScenarios: [
          {
            name: 'fetch all posts',
            description: 'Fetch complete list of posts',
            expectedResultCount: 100,
          },
        ],
      },
      {
        path: '/comments',
        syncableName: 'comments',
        paginationStrategy: 'none',
        expectedBehavior: {
          minItems: 500,
          maxItems: 500,
        },
        testScenarios: [
          {
            name: 'fetch all comments',
            description: 'Fetch complete list of comments',
            expectedResultCount: 500,
          },
        ],
      },
    ],
  },

  // Swagger PetStore (Classic example)
  {
    name: 'Swagger PetStore',
    category: 'rest',
    specUrl: 'https://petstore3.swagger.io/api/v3/openapi.json',
    specType: 'openapi',
    authentication: { type: 'none' },
    endpoints: [
      {
        path: '/pet/findByStatus',
        syncableName: 'pets-by-status',
        paginationStrategy: 'none',
        expectedBehavior: {
          minItems: 0,
          supportsFiltering: true,
        },
        testScenarios: [
          {
            name: 'find available pets',
            description: 'Find pets by available status',
            queryParams: { status: 'available' },
          },
          {
            name: 'find pending pets',
            description: 'Find pets by pending status',
            queryParams: { status: 'pending' },
          },
          {
            name: 'find sold pets',
            description: 'Find pets by sold status',
            queryParams: { status: 'sold' },
          },
        ],
      },
    ],
  },

  // OpenWeatherMap API
  {
    name: 'OpenWeatherMap',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/APIs-guru/openapi-directory/main/APIs/openweathermap.org/2.5/openapi.yaml',
    specType: 'openapi',
    authentication: {
      type: 'apiKey',
      envVarName: 'OPENWEATHER_API_KEY',
      headerName: 'appid',
    },
    endpoints: [
      {
        path: '/data/2.5/weather',
        syncableName: 'current-weather',
        paginationStrategy: 'none',
        expectedBehavior: {
          minItems: 1,
          maxItems: 1,
        },
        testScenarios: [
          {
            name: 'get weather by city',
            description: 'Get current weather for a city',
            queryParams: { q: 'London' },
            expectedResultCount: 1,
          },
        ],
      },
    ],
  },

  // NASA API
  {
    name: 'NASA API',
    category: 'rest',
    specUrl: 'https://api.nasa.gov/openapi.yaml',
    specType: 'openapi',
    authentication: {
      type: 'apiKey',
      envVarName: 'NASA_API_KEY',
    },
    endpoints: [
      {
        path: '/planetary/apod',
        syncableName: 'astronomy-picture',
        paginationStrategy: 'dateRange',
        expectedBehavior: {
          minItems: 1,
        },
        testScenarios: [
          {
            name: 'fetch daily picture',
            description: 'Fetch astronomy picture of the day',
          },
          {
            name: 'fetch date range',
            description: 'Fetch pictures for a date range',
            queryParams: {
              start_date: '2024-01-01',
              end_date: '2024-01-07',
            },
            expectedResultCount: 7,
          },
        ],
      },
    ],
  },

  // Spotify API
  {
    name: 'Spotify Web API',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/sonallux/spotify-web-api/main/fixed-spotify-open-api.yml',
    specType: 'openapi',
    authentication: {
      type: 'bearer',
      envVarName: 'SPOTIFY_ACCESS_TOKEN',
    },
    endpoints: [
      {
        path: '/v1/browse/new-releases',
        syncableName: 'new-releases',
        paginationStrategy: 'offset',
        itemsPathInResponse: ['albums', 'items'],
        expectedBehavior: {
          minItems: 0,
        },
        testScenarios: [
          {
            name: 'fetch new releases',
            description: 'Fetch new album releases',
          },
        ],
      },
    ],
  },

  // The Movie Database (TMDB)
  {
    name: 'The Movie Database',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/bvandercar-vt/tmdb-api-spec/master/openapi.json',
    specType: 'openapi',
    authentication: {
      type: 'apiKey',
      envVarName: 'TMDB_API_KEY',
    },
    endpoints: [
      {
        path: '/3/movie/popular',
        syncableName: 'popular-movies',
        paginationStrategy: 'pageNumber',
        itemsPathInResponse: ['results'],
        expectedBehavior: {
          minItems: 20,
          supportsFiltering: true,
        },
        testScenarios: [
          {
            name: 'fetch popular movies',
            description: 'Fetch list of popular movies',
          },
          {
            name: 'fetch page 2',
            description: 'Test page number pagination',
            queryParams: { page: '2' },
          },
        ],
      },
    ],
  },

  // Random User API
  {
    name: 'Random User Generator',
    category: 'rest',
    specUrl: 'https://randomuser.me/api/openapi.json',
    specType: 'openapi',
    authentication: { type: 'none' },
    endpoints: [
      {
        path: '/api',
        syncableName: 'random-users',
        paginationStrategy: 'pageNumber',
        itemsPathInResponse: ['results'],
        expectedBehavior: {
          minItems: 1,
        },
        testScenarios: [
          {
            name: 'generate random users',
            description: 'Generate a batch of random users',
            queryParams: { results: '50' },
            expectedResultCount: 50,
          },
        ],
      },
    ],
  },

  // REST Countries
  {
    name: 'REST Countries',
    category: 'rest',
    specUrl:
      'https://raw.githubusercontent.com/apilayer/restcountries/master/openapi.json',
    specType: 'openapi',
    authentication: { type: 'none' },
    endpoints: [
      {
        path: '/v3.1/all',
        syncableName: 'all-countries',
        paginationStrategy: 'none',
        expectedBehavior: {
          minItems: 200,
        },
        testScenarios: [
          {
            name: 'fetch all countries',
            description: 'Fetch complete list of countries',
          },
        ],
      },
    ],
  },
];

/**
 * Helper function to get API config by name
 */
export function getApiConfig(name: string): ApiTestConfig | undefined {
  return PUBLIC_API_CONFIGS.find((config) => config.name === name);
}

/**
 * Helper function to get all APIs that support a specific pagination strategy
 */
export function getApisByPaginationStrategy(
  strategy: PaginationStrategy,
): ApiTestConfig[] {
  return PUBLIC_API_CONFIGS.filter((config) =>
    config.endpoints.some(
      (endpoint) => endpoint.paginationStrategy === strategy,
    ),
  );
}

/**
 * Helper function to get all APIs that don't require authentication
 */
export function getPublicApis(): ApiTestConfig[] {
  return PUBLIC_API_CONFIGS.filter(
    (config) => !config.authentication || config.authentication.type === 'none',
  );
}

export default PUBLIC_API_CONFIGS;
