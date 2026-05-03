import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import DashboardPage from './DashboardPage.tsx';
import './index.css';

const path = window.location.pathname.toLowerCase();
const isDashboardRoute = path === '/dashbaord' || path === '/dashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDashboardRoute ? <DashboardPage /> : <App />}
  </StrictMode>,
);
