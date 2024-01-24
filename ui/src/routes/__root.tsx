import { QueryClient } from '@tanstack/react-query'
import { Outlet, rootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = rootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
})

function RootComponent() {
    return <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
}