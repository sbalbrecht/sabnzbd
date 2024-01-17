import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/css/bootstrap.min.css';
import './assets/js/jquery-3.5.1.min.js';
import './assets/js/bootstrap.min.js';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
