import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Auth from './Auth';
import { AudioWaveform as Waveform } from 'lucide-react';

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/welcome';

  const handleAuthSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <Waveform className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Welcome to MELVA</h1>
            <p className="text-xl text-gray-300">
              Sign in or create an account to start your musical journey
            </p>
          </div>
        </div>
        <Auth onAuthSuccess={handleAuthSuccess} />
      </div>
    </div>
  );
}

export default AuthPage;