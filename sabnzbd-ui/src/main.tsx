import React from 'react'
import ReactDOM from 'react-dom/client'
import Wizard from './routes/wizard/Wizard.tsx'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import './assets/css/bootstrap.min.css';
import './assets/js/jquery-3.5.1.min.js';
import './assets/js/bootstrap.min.js';
import './index.css'

const router = createBrowserRouter([
  {
    path: '/wizard/index',
    element: <Wizard />,
  }
]); 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
