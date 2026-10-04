import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const getRouter = (): ReturnType<
  typeof createRouter<typeof routeTree>
> => {
  const router = createRouter({
    routeTree,
    context: {},

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
