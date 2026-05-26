import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/security/ProtectedRoute';
import { AdminRoutes } from '../admin/routes/AdminRoutes';
import ErrorBoundary from '../components/core/ErrorBoundary';
import PageLoader from '../components/ui/PageLoader';
import styles from './AppRoutes.module.css';

const Home = lazy(() => import('../pages/homepage/Home'));
const Catalog = lazy(() => import('../pages/catalogpage/Catalog'));
const VehicleDetails = lazy(() => import('../pages/VehicleDetails/VehicleDetails'));
const RegistroUsuarios = lazy(() => import('../components/RegistroDeUsuarios/RegistroUsuarios'));
const LoginVista = lazy(() => import('../components/login/LoginVista'));
const RedireccionContactos = lazy(
  () =>
    import('../components/Redirecciones/Redireccion Contactos/Redireccion Contactos/RedireccionContactos')
);
const RedireccionModeloAuto = lazy(
  () =>
    import('../components/Redirecciones/RedireccionModeloAuto/RedireccionModeloAuto/RedireccionModeloAuto')
);
const CreditSimulator = lazy(() => import('../components/CreditSimulator/CreditSimulator'));
const PerfilUsuarios = lazy(() => import('../components/PerfilDeUsuarios/PerfilUsuarios'));
const VenderAutoPage = lazy(() => import('../pages/VenderAuto/VenderAutoPage'));
const AgendarCita = lazy(() => import('../pages/AgendarCita/AgendarCita'));
const Reseñas = lazy(() => import('../components/TechnicalGlossary/ApartadoDeReseñas/Reseñas'));
const RecuperarPassword = lazy(() => import('../pages/RecuperarPassword/RecuperarPassword'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/inicio" element={<Navigate to="/" replace />} />

        <Route
          path="/"
          element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          }
        />
        <Route
          path="/inventory"
          element={
            <ErrorBoundary>
              <Catalog />
            </ErrorBoundary>
          }
        />
        <Route
          path="/details"
          element={
            <ErrorBoundary>
              <VehicleDetails />
            </ErrorBoundary>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ErrorBoundary>
              <VehicleDetails />
            </ErrorBoundary>
          }
        />
        <Route
          path="/register"
          element={
            <ErrorBoundary>
              <RegistroUsuarios />
            </ErrorBoundary>
          }
        />
        <Route
          path="/login"
          element={
            <ErrorBoundary>
              <LoginVista />
            </ErrorBoundary>
          }
        />
        <Route
          path="/contact"
          element={
            <ErrorBoundary>
              <RedireccionContactos />
            </ErrorBoundary>
          }
        />
        <Route
          path="/modelAuto"
          element={
            <ErrorBoundary>
              <RedireccionModeloAuto />
            </ErrorBoundary>
          }
        />
        <Route
          path="/simulate-credit"
          element={
            <ErrorBoundary>
              <CreditSimulator />
            </ErrorBoundary>
          }
        />
        <Route
          path="/reseñas"
          element={
            <ErrorBoundary>
              <Reseñas />
            </ErrorBoundary>
          }
        />
        <Route
          path="/recuperar"
          element={
            <ErrorBoundary>
              <RecuperarPassword />
            </ErrorBoundary>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'gerente']}>
              <ErrorBoundary>
                <PerfilUsuarios />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/vender-auto"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'gerente']}>
              <ErrorBoundary>
                <VenderAutoPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agendar-cita"
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin', 'gerente']}>
              <ErrorBoundary>
                <AgendarCita />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />

        {AdminRoutes()}

        <Route
          path="*"
          element={
            <div className={styles.notFoundContainer}>
              <h1 className={styles.notFoundTitle}>404</h1>
              <h2>Página no encontrada</h2>
              <p className={styles.notFoundDescription}>
                La ruta que intentas buscar no existe o ha sido movida.
              </p>
              <Navigate to="/" replace={false} />
            </div>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
