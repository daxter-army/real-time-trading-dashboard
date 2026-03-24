import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LoginScreen from './screens/LoginScreen/LoginScreen';
import DashboardScreen from './screens/DashboardScreen/DashboardScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="*" element={<LoginScreen />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
