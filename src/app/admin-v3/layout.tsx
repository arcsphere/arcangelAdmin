'use client';

import React, { useEffect } from 'react';
import { Sidebar } from '@/components/admin/v3/Sidebar';
import { AdminHeader } from '@/components/admin/v3/AdminHeader';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';

export default function AdminV3Layout({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, loadAll, isLoading, error } = useAdminStore();
  const theme = getTheme('void');

  useEffect(() => { loadAll(); }, []);

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#050508', 
      color: '#fff',
      fontFamily: theme.fontBody
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        marginLeft: isSidebarCollapsed ? '80px' : '280px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <AdminHeader />
        {error && (
          <div style={{
            background: 'rgba(240,107,138,0.08)', borderBottom: '1px solid rgba(240,107,138,0.25)',
            padding: '10px 32px', fontSize: '12px', color: '#f06b8a',
            fontFamily: theme.fontMono, letterSpacing: '0.3px'
          }}>
            ⚠ Supabase error: {error} — check your NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env.local
          </div>
        )}
        <main style={{
          padding: '48px',
          maxWidth: '1600px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
          position: 'relative'
        }}>
          {isLoading && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(5,6,10,0.7)', backdropFilter: 'blur(4px)',
              zIndex: 10, borderRadius: '8px'
            }}>
              <div style={{
                fontFamily: theme.fontMono, fontSize: '12px',
                color: theme.textMuted, letterSpacing: '2px'
              }}>
                LOADING...
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
