import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from '@/components/Header/Header';
import LoginScreen from '@/screens/LoginScreen/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen/DashboardScreen';

import { useAppStore } from './store/app';

import { APP_ROUTES } from '@/constants/constants';

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
      <Routes>
        <Route path={APP_ROUTES.ROOT} element={<LoginScreen />} />
        <Route path={APP_ROUTES.DASHBOARD_SCREEN} element={<DashboardScreen />} />
        <Route path={APP_ROUTES.WILDCARD} element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
