import { RootRoute, Outlet } from '@tanstack/react-router'

export const Route = new RootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
})
