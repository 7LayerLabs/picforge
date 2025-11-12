'use client';

import { db } from '@/lib/instantdb';
import { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';

export default function AuthButton() {
  const { isLoading, user, error } = db.useAuth();
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [code, setCode] = useState('');
  const hasWelcomedUser = useRef(false);

  // Send welcome email for new users
  useEffect(() => {
    if (user && !hasWelcomedUser.current) {
      hasWelcomedUser.current = true;

      // Check if this is a new user (createdAt may not exist on InstantDB user type)
      const now = Date.now();
      const userCreatedAt = (user as any).createdAt || now;
      const isNewUser = now - userCreatedAt < 60000;

      if (isNewUser && user.email) {
        // Send welcome email
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user.email,
            type: 'welcome',
            data: {
              userName: user.email.split('@')[0],
              userEmail: user.email,
            },
          }),
        }).catch((error) => {
          logger.error('Failed to send welcome email:', error);
        });
      }
    }
  }, [user]);

  if (isLoading) {
    return (
      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-wait">
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <button
        onClick={() => db.auth.signOut()}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm whitespace-nowrap"
        title={`Signed in as ${user.email}`}
      >
        Sign Out
      </button>
    );
  }

  if (sentEmail) {
    return (
      <div className="bg-white dark:bg-gray-800 border-2 border-teal-500 rounded-lg p-4 shadow-lg max-w-md">
        <p className="text-gray-900 dark:text-white text-sm font-medium mb-3">
          Check your email! We sent a code to <strong className="text-teal-600">{sentEmail}</strong>
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!code) return;
            db.auth.signInWithMagicCode({ email: sentEmail, code }).catch((err) => {
              alert('Invalid code. Please try again.');
              logger.error(err);
            });
          }}
          className="flex flex-col gap-3"
        >
          <input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500 text-center text-lg tracking-wider font-mono"
            maxLength={6}
            autoFocus
            required
          />
          <button
            type="submit"
            disabled={code.length !== 6}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Code
          </button>
        </form>
        <button
          onClick={() => {
            setSentEmail('');
            setEmail('');
            setCode('');
          }}
          className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          Try a different email
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowLoginForm(!showLoginForm)}
        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors whitespace-nowrap"
      >
        Sign In
      </button>

      {showLoginForm && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 z-[200] min-w-[300px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;

              db.auth.sendMagicCode({ email }).catch((err) => {
                alert('Error sending magic code: ' + err.message);
              });
              setSentEmail(email);
            }}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-teal-500"
              required
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                Send Magic Link
              </button>
              <button
                type="button"
                onClick={() => setShowLoginForm(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
            {error && (
              <p className="text-red-400 text-sm">{error.message}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
}
