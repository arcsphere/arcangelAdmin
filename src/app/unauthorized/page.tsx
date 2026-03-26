'use client';

import React from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050508',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Inter", sans-serif',
    }}>
      <div style={{
        background: '#0C0C0E',
        border: '1px solid rgba(248, 113, 113, 0.2)',
        borderRadius: '24px',
        padding: '56px 48px',
        width: '100%',
        maxWidth: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '40px' }}>🚫</div>
        <div>
          <h1 style={{
            fontSize: '20px', fontWeight: 700, color: '#F87171',
            fontFamily: '"Space Grotesk", sans-serif', marginBottom: '10px',
          }}>
            Access Denied
          </h1>
          <p style={{ fontSize: '14px', color: '#A1A1AA', lineHeight: '1.6' }}>
            Your account is not authorised to access the ARC 1 Admin Portal.
            <br /><br />
            If you believe this is an error, contact the system owner at{' '}
            <span style={{ color: '#818CF8' }}>hrishitababaria08@gmail.com</span>
          </p>
        </div>
        <button
          onClick={handleSignOut}
          style={{
            padding: '12px 24px',
            borderRadius: '10px',
            background: 'transparent',
            color: '#A1A1AA',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          Sign out and try a different account
        </button>
      </div>
    </div>
  );
}
