/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Convert path to route
 * Example: /posts/{id} -> /posts/:id
 */
export function honoRouteFromPath(path: string) {
  return path.replace(/{/g, ':').replace(/}/g, '')
}
