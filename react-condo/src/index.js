import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Account from './pages/Account';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/account/:account_address",
    element: <Account />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
