import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onAuthSuccess?: () => void;
}

function Auth({ onAuthSuccess }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const validatePassword = (pass: string) => {
    if (mode === 'signup' && pass.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message === 'User already registered') {
            throw new Error('An account with this email already exists. Please sign in or use a different email address.');
          }
          throw error;
        }
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + '/auth/reset-password',
        });
        if (error) throw error;
        setResetSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === 'Invalid login credentials') {
            throw new Error('Incorrect email or password. Please try again or use the "Forgot your password?" option.');
          }
          throw error;
        }
      }

      if (mode !== 'reset') {
        onAuthSuccess?.();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
      // Clear password field on error for security
      if (mode === 'signin') {
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode);
    setError(null);
    setPassword('');
  };

  if (resetSent) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-300 mb-6">
            We've sent you a password reset link. Please check your email to continue.
          </p>
          <button
            onClick={() => {
              setMode('signin');
              setResetSent(false);
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Return to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
        </h2>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="your@email.com"
                required
              />
              <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-sm text-blue-400 hover:text-blue-300 mt-2 transition-colors"
                >
                  Forgot your password?
                </button>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Please wait...'
              : mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
              ? 'Sign Up'
              : 'Send Reset Instructions'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'reset' ? (
            <button
              onClick={() => switchMode('signin')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Back to Sign In
            </button>
          ) : (
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;