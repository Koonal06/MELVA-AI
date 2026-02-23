import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import PricingPage from './components/PricingPage';
import Onboarding from './components/Onboarding';
import PrivateRoute from './components/PrivateRoute';
import Welcome from './components/Welcome';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/welcome" element={
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        } />
        <Route 
          path="/pricing" 
          element={
            <PrivateRoute>
              <PricingPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/onboarding" 
          element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;