import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, Router } from '@tanstack/react-router'
import './assets/css/bootstrap.min.css';
import './assets/js/jquery-3.5.1.min.js';
import './assets/js/bootstrap.min.js';
import './index.css'

// Import generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = new Router({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}