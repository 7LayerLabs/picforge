'use client';

import { db } from '@/lib/instantdb';
import { useState } from 'react';

export default function AuthButton() {
  const { isLoading, user, error } = db.useAuth();
  const [email, setEmail] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

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
      <div className="bg-green-900/50 border border-green-600 rounded-lg p-4 max-w-md">
        <p className="text-green-200 text-sm">
          Check your email! We sent a magic link to <strong>{sentEmail}</strong>
        </p>
        <button
          onClick={() => {
            setSentEmail('');
            setEmail('');
          }}
          className="mt-2 text-xs text-green-400 hover:text-green-300"
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
