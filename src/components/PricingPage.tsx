import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Check } from 'lucide-react';

function PricingPage() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: string) => {
    // Here you would typically handle the subscription process
    // For now, we'll just redirect to the features
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300">
            Flexible pricing options to support your creative journey
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <p className="text-4xl font-bold mb-6">
              Rs 0<span className="text-lg text-gray-400">/mo</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Basic AI features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>5 AI generations per day</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Community access</span>
              </li>
            </ul>
            <button 
              onClick={() => handleSelectPlan('free')}
              className="w-full px-6 py-3 bg-gray-800 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-6">
              Rs 457<span className="text-lg text-gray-400">/mo</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Advanced AI tools</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Unlimited generations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Priority support</span>
              </li>
            </ul>
            <button 
              onClick={() => handleSelectPlan('pro')}
              className="w-full px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Pro Trial
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-8 border border-blue-400/30 transform hover:scale-105 transition-transform">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-bold">Premium</h3>
              <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-4xl font-bold mb-6">
              Rs 1400<span className="text-lg text-gray-200">/mo</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-white" />
                <span>Custom AI music recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-white" />
                <span>Unlimited beat generation & advanced features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-white" />
                <span>Full analysis with detailed feedback</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-white" />
                <span>50-Track Storage</span>
              </li>
            </ul>
            <button 
              onClick={() => handleSelectPlan('premium')}
              className="w-full px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;