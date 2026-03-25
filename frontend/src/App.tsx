import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Header from '@/components/Header/Header';

import { useAppStore } from '@/store/app';

import { APP_ROUTES } from '@/constants/constants';
import ScreenLoader from '@/components/Loaders/ScreenLoader/ScreenLoader';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import PublicRoute from './components/PublicRoute/PublicRoute';

// lazy load routes
const LoginScreen = lazy(() => import('@/screens/LoginScreen/LoginScreen'));
const DashboardScreen = lazy(() => import('@/screens/DashboardScreen/DashboardScreen'));

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route
              path={APP_ROUTES.ROOT}
              element={<LoginScreen />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route
              path={APP_ROUTES.DASHBOARD_SCREEN}
              element={<DashboardScreen />}
            />
          </Route>
          <Route
            path={APP_ROUTES.WILDCARD}
            element={<Navigate to={APP_ROUTES.ROOT} replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
