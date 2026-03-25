import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from '@/components/Header/Header';

import { useAppStore } from '@/store/app';

import { APP_ROUTES } from '@/constants/constants';
import ScreenLoader from '@/components/Loaders/ScreenLoader/ScreenLoader';

// lazy load routes
const LoginScreen = lazy(() => import('@/screens/LoginScreen/LoginScreen'));
const DashboardScreen = lazy(() => import('@/screens/DashboardScreen/DashboardScreen'));

function App() {
  const setIsTabVisible = useAppStore(state => state.setIsTabVisible)

  // subscription to check whether the tab is in focus or not
  // to pause web socket updates
  useEffect(() => {
    const onVisibilityChangeHandler = () => {
      setIsTabVisible(!document.hidden)
    }

    document.addEventListener("visibilitychange", onVisibilityChangeHandler)

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChangeHandler)
    }
  }, [])

  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route path={APP_ROUTES.ROOT} element={<LoginScreen />} />
          <Route path={APP_ROUTES.DASHBOARD_SCREEN} element={<DashboardScreen />} />
          <Route path={APP_ROUTES.WILDCARD} element={<LoginScreen />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
