'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import PinInput from '../components/PinInput';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPinInput, setShowPinInput] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      const redirectTo = searchParams.get('from') || '/dashboard';
      router.push(redirectTo);
    }
  }, [user, router, searchParams]);

  const handleUserIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId.trim()) {
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length !== 4) return;

    setError('');
    setIsLoading(true);

    try {
      await login(userId, pin);
    } catch (err) {
      setError('Invalid user ID or PIN');
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl font-bold mb-6">Login</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {!showPinInput ? (
            <form onSubmit={handleUserIdSubmit} className="space-y-4">
              <div className="form-control">
                <label htmlFor="userId" className="label">
                  <span className="label-text">User ID</span>
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="input input-bordered text-center text-xl"
                  placeholder="Enter your user ID"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
              >
                Continue
              </button>
            </form>
          ) : (
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">{userId}</p>
                <button 
                  type="button" 
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    setShowPinInput(false);
                    setPin('');
                    setError('');
                  }}
                >
                  Change User ID
                </button>
              </div>

              <div className="form-control">
                <label className="label justify-center">
                  <span className="label-text">Enter PIN</span>
                </label>
                <PinInput onChange={setPin} />
              </div>

              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || pin.length !== 4}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          <div className="text-center mt-4">
            <Link href="/forgot-password" className="link link-hover text-sm">
              Forgot PIN?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 