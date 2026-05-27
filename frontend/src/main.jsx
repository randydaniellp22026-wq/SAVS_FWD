import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/core/ErrorBoundary.jsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient.js';

document.addEventListener('keydown', (e) => {
  const target = e.target;
  if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;

  const isPhone =
    target.type === 'tel' ||
    (target.name &&
      (target.name.toLowerCase().includes('telefono') ||
        target.name.toLowerCase().includes('phone'))) ||
    (target.id &&
      (target.id.toLowerCase().includes('telefono') ||
        target.id.toLowerCase().includes('phone'))) ||
    (target.placeholder && target.placeholder.toLowerCase().includes('teléfono'));

  if (e.key === '-' && !isPhone) e.preventDefault();

  if (target.type === 'number' && ['e', 'E', '+', '-'].includes(e.key)) {
    e.preventDefault();
  }
});

document.addEventListener('paste', (e) => {
  const target = e.target;
  if (!target || (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA')) return;

  const isPhone =
    target.type === 'tel' ||
    (target.name &&
      (target.name.toLowerCase().includes('telefono') ||
        target.name.toLowerCase().includes('phone'))) ||
    (target.id &&
      (target.id.toLowerCase().includes('telefono') ||
        target.id.toLowerCase().includes('phone'))) ||
    (target.placeholder && target.placeholder.toLowerCase().includes('teléfono'));

  const pastedData = (e.clipboardData || window.clipboardData).getData('text');
  if (!isPhone && pastedData.includes('-')) e.preventDefault();
  if (target.type === 'number' && ['e', 'E', '+', '-'].some((c) => pastedData.includes(c))) {
    e.preventDefault();
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
