/**
 * CSOAI Email Verification Page
 * Clean, minimal UI for email verification
 * 100% CSOAI branded
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle2, AlertCircle, Loader2, Mail } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');

  // Get token from URL
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  // Verify email mutation
  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus('success');
      setMessage('Your email has been verified successfully!');
      setTimeout(() => {
        setLocation('/dashboard');
      }, 3000);
    },
    onError: (error) => {
      if (error.message.includes('expired')) {
        setStatus('expired');
        setMessage('This verification link has expired. Please request a new one.');
      } else {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. Please try again.');
      }
    },
  });

  // Verify email on mount
  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    verifyMutation.mutate({ token });
  }, [token]);

  const handleResendVerification = async () => {
    // TODO: Implement resend verification email
    setMessage('Resend functionality coming soon.');
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
          {/* Verification Container */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
            {/* Loading State */}
            {status === 'loading' && (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4 animate-pulse">
                    <Mail className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-emerald-900 mb-2">Verifying Email</h1>
                  <p className="text-sm text-gray-600">Please wait while we verify your email address...</p>
                </div>

                <div className="flex justify-center mb-8">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                </div>

                <p className="text-center text-sm text-gray-500">
                  This may take a few seconds. Do not close this page.
                </p>
              </>
            )}

            {/* Success State */}
            {status === 'success' && (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-emerald-900 mb-2">Email Verified!</h1>
                  <p className="text-sm text-gray-600">Your email has been successfully verified.</p>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-8 text-center">
                  <p className="text-sm text-emerald-900 font-medium">
                    ✓ Your account is now fully activated
                  </p>
                </div>

                <p className="text-center text-sm text-gray-600 mb-6">
                  Redirecting you to your dashboard in a few seconds...
                </p>

                <Button
                  onClick={() => setLocation('/dashboard')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 rounded-lg transition"
                >
                  Go to Dashboard Now
                </Button>
              </>
            )}

            {/* Error State */}
            {status === 'error' && (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-xl mb-4">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                  <p className="text-sm text-gray-600">We couldn't verify your email address.</p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-red-700">{message}</p>
                </div>

                <Button
                  onClick={() => setLocation('/login')}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 rounded-lg transition mb-3"
                >
                  Back to Login
                </Button>

                <Button
                  onClick={handleResendVerification}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 rounded-lg transition"
                >
                  Resend Verification Email
                </Button>
              </>
            )}

            {/* Expired State */}
            {status === 'expired' && (
              <>
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-yellow-100 rounded-xl mb-4">
                    <AlertCircle className="w-7 h-7 text-yellow-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Expired</h1>
                  <p className="text-sm text-gray-600">Your verification link has expired.</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                  <p className="text-sm text-yellow-700">
                    Verification links expire after 24 hours for security. Please request a new one.
                  </p>
                </div>

                <Button
                  onClick={handleResendVerification}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-2.5 rounded-lg transition mb-3"
                >
                  Send New Verification Email
                </Button>

                <Button
                  onClick={() => setLocation('/login')}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-2.5 rounded-lg transition"
                >
                  Back to Login
                </Button>
              </>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Need help?{' '}
                <a href="/contact" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
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
