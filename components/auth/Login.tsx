/**
 * CSOAI Login Page
 * Clean, minimal, seamless OAuth authentication
 * 100% CSOAI branded - no Manus branding visible
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';

export default function Login() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const loginUrl = getLoginUrl();
    window.location.href = loginUrl;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const signupUrl = `${getLoginUrl()}&signup=true`;
    window.location.href = signupUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex flex-col">
      {/* Minimal Header */}
      <header className="border-b border-emerald-100 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-lg font-bold text-emerald-900">CSOAI</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Login Container */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl mb-4">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-900 mb-1">CSOAI</h1>
              <p className="text-sm text-gray-600">Council of AI Safety Analysts</p>
            </div>

            {/* Tagline */}
            <div className="bg-emerald-50 rounded-lg p-3 mb-8 text-center border border-emerald-200">
              <p className="text-xs font-medium text-emerald-900">
                Establishing Global Standards for AI Safety
              </p>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleLogin} className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">New to CSOAI?</span>
              </div>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSignup}>
              <Button
                type="submit"
                disabled={loading}
                variant="outline"
                className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 rounded-lg transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  'Create Free Account'
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <p className="text-xs text-center text-gray-500 mt-6 pt-6 border-t border-gray-200">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Terms
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 font-medium">
                Privacy
              </a>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-gray-600">
              🔒 Enterprise-grade security • 🌍 Global standards • ⚡ Instant access
            </p>
          </div>
        </div>
      </main>

      {/* Background Gradient Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
    </div>
  );
}
