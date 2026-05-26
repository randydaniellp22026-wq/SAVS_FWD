import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import * as Sentry from '@sentry/react';

const SentryRoutes = Sentry.withSentryRouting(Routes);
import { CatalogSkeletonGrid } from '../components/ui/Skeleton';
import AppErrorBoundary from '../components/errors/AppErrorBoundary';

import Home from '../pages/homepage/Home';
import Catalog from '../pages/catalogpage/Catalog';
import VehicleDetails from '../pages/VehicleDetails/VehicleDetails';
import RegistroUsuarios from '../components/RegistroDeUsuarios/RegistroUsuarios';
import LoginVista from '../components/login/LoginVista';
import RedireccionContactos from '../components/Redirecciones/Redireccion Contactos/Redireccion Contactos/RedireccionContactos';
import RedireccionModeloAuto from '../components/Redirecciones/RedireccionModeloAuto/RedireccionModeloAuto/RedireccionModeloAuto';
import CreditSimulator from '../components/CreditSimulator/CreditSimulator';
import IntercambioDeAutos from '../components/IntercambioDeAutos/IntercambioDeAutos';
import Reseñas from '../components/TechnicalGlossary/ApartadoDeReseñas/Reseñas';
import RecuperarPassword from '../pages/RecuperarPassword/RecuperarPassword';
import ProtectedRoute from '../components/security/ProtectedRoute';
import AdminLayout from '../components/admin/AdminLayout';

const PerfilUsuarios = lazy(() => import('../components/PerfilDeUsuarios/PerfilUsuarios'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ReviewRequests = lazy(() => import('../pages/admin/ReviewRequests'));
const CreateVehicle = lazy(() => import('../pages/admin/CreateVehicle'));
const UserManagement = lazy(() => import('../pages/admin/UserManagement'));
const BranchManagement = lazy(() => import('../pages/admin/BranchManagement'));
const TrackingManagement = lazy(() => import('../pages/admin/TrackingManagement'));
const MarketingBroadcast = lazy(() => import('../pages/admin/MarketingBroadcast'));

const PageLoader = ({ label = 'Cargando...' }) => (
  <div role="status" aria-live="polite" className="page-loader">
    <CatalogSkeletonGrid count={3} />
    <span className="sr-only">{label}</span>
  </div>
);

const LazyAdmin = ({ children }) => (
  <AppErrorBoundary title="Error en el panel de administración">
    <Suspense fallback={<PageLoader label="Cargando panel admin" />}>{children}</Suspense>
  </AppErrorBoundary>
);

const LazyCatalog = ({ children }) => (
  <AppErrorBoundary title="Error en el catálogo">
    <Suspense fallback={<PageLoader label="Cargando sección" />}>{children}</Suspense>
  </AppErrorBoundary>
);

const AppRoutes = () => (
  <SentryRoutes>
    <Route path="/" element={<Home />} />
    <Route
      path="/inventory"
      element={
        <LazyCatalog>
          <Catalog />
        </LazyCatalog>
      }
    />
    <Route path="/details" element={<VehicleDetails />} />
    <Route path="/details/:id" element={<VehicleDetails />} />
    <Route path="/register" element={<RegistroUsuarios />} />
    <Route path="/login" element={<LoginVista />} />
    <Route path="/contact" element={<RedireccionContactos />} />
    <Route path="/modelAuto" element={<RedireccionModeloAuto />} />
    <Route path="/simulate-credit" element={<CreditSimulator />} />
    <Route
      path="/perfil"
      element={
        <ProtectedRoute allowedRoles={['cliente', 'admin', 'gerente']}>
          <LazyCatalog>
            <PerfilUsuarios />
          </LazyCatalog>
        </ProtectedRoute>
      }
    />
    <Route
      path="/vender-auto"
      element={
        <ProtectedRoute allowedRoles={['cliente', 'admin', 'gerente']}>
          <IntercambioDeAutos />
        </ProtectedRoute>
      }
    />
    <Route path="/reseñas" element={<Reseñas />} />
    <Route path="/recuperar" element={<RecuperarPassword />} />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/requests"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <ReviewRequests />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/branches"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <BranchManagement />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/create-vehicle"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <CreateVehicle />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/reviews"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <Reseñas />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/tracking"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <TrackingManagement />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/marketing"
      element={
        <ProtectedRoute>
          <LazyAdmin>
            <AdminLayout>
              <MarketingBroadcast />
            </AdminLayout>
          </LazyAdmin>
        </ProtectedRoute>
      }
    />
  </SentryRoutes>
);

export default AppRoutes;
