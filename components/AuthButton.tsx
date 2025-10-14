'use client';

import { db } from '@/lib/instantdb';
import { useState } from 'react';

export default function AuthButton() {
  const { isLoading, user, error } = db.useAuth();
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [code, setCode] = useState('');

  if (isLoading) {
    return (
      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-wait">
        Loading...
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-300">
          {user.email}
        </span>
        <button
          onClick={() => db.auth.signOut()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
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
              console.error(err);
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

  if (!showLoginForm) {
    return (
      <button
        onClick={() => setShowLoginForm(true)}
        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors whitespace-nowrap"
      >
        Sign In
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;

        db.auth.sendMagicCode({ email }).catch((err) => {
          alert('Error sending magic code: ' + err.message);
        });
        setSentEmail(email);
      }}
      className="flex gap-2 items-center"
    >
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-teal-500"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors whitespace-nowrap"
      >
        Send Magic Link
      </button>
      <button
        type="button"
        onClick={() => setShowLoginForm(false)}
        className="px-3 py-2 text-gray-400 hover:text-white"
      >
        Cancel
      </button>
      {error && (
        <p className="text-red-400 text-sm">{error.message}</p>
      )}
    </form>
  );
}
