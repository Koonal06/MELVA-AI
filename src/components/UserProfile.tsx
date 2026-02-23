import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  supabase,
  getUserSubscription,
  deleteCurrentUserAccount,
} from '../lib/supabase';
import {
  User,
  KeyRound,
  Calendar,
  CreditCard,
  LogOut,
  Trash2,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || '');

        const subscriptionData = await getUserSubscription();
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      setIsEditing(false);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
      setError(null);
      alert('Password reset link has been sent to your email');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await deleteCurrentUserAccount();
      navigate('/');
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">User Profile</h2>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <User className="w-4 h-4" />
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2"
                  />
                ) : (
                  <span className="flex-1">{email}</span>
                )}
                {isEditing ? (
                  <button
                    onClick={handleUpdateEmail}
                    className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <KeyRound className="w-4 h-4" />
                <span>Password</span>
              </div>
              <button
                onClick={handleUpdatePassword}
                className="text-blue-400 hover:text-blue-300"
              >
                Change Password
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <CreditCard className="w-4 h-4" />
                <span>Subscription</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">
                    {subscription?.plan || 'Free'} Plan
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    subscription?.status === 'active'
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {subscription?.status || 'inactive'}
                  </span>
                </div>
                {subscription?.current_period_end && (
                  <p className="text-sm text-gray-400">
                    Next billing date:{' '}
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Account Created</span>
              </div>
              <p>
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6 flex justify-between">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>

              <div>
                {showDeleteConfirm ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500">Are you sure?</span>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-3 py-1 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
