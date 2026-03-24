import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginScreen from '@/screens/LoginScreen/LoginScreen';
import DashboardScreen from '@/screens/DashboardScreen/DashboardScreen';

import { APP_ROUTES } from '@/constants/constants';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={APP_ROUTES.ROOT} element={<LoginScreen />} />
        <Route path={APP_ROUTES.DASHBOARD_SCREEN} element={<DashboardScreen />} />
        <Route path={APP_ROUTES.WILDCARD} element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
