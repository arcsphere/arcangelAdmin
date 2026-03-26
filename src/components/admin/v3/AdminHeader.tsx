'use client';

import React from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';

export const AdminHeader = () => {
  const { isSidebarCollapsed, toggleSidebar, auditLogs, searchQuery, setSearchQuery } = useAdminStore();
  const theme = getTheme('void');

  return (
    <header style={{
      height: '72px',
      background: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
    }}>

      {/* ── Left: Toggle + Search ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Sidebar toggle — keyboard key style */}
        <button
          onClick={toggleSidebar}
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px',
            padding: '8px 14px',
            color: theme.textMuted,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: theme.fontMono, fontSize: '13px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.3)',
            flexShrink: 0
          }}
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>

        {/* Search bar — pill shape */}
        <div
          className="arc-search-input"
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            background: 'rgba(24, 24, 27, 0.9)',
            padding: '9px 20px',
            borderRadius: '100px',
            minWidth: '400px',
            border: '1px solid rgba(255,255,255,0.08)',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
          }}
        >
          <span style={{ fontSize: '14px', color: theme.textMuted, fontFamily: theme.fontMono, flexShrink: 0 }}>⌕</span>
          <input
            type="text"
            placeholder="Search levels, users, or config IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '13px',
              width: '100%',
              fontFamily: theme.fontBody
            }}
          />
          <span style={{
            fontFamily: theme.fontMono, fontSize: '9px',
            color: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px', padding: '2px 6px',
            letterSpacing: '1px', flexShrink: 0
          }}>⌘K</span>
        </div>
      </div>

      {/* ── Right: System Status + Notif ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        {/* System Live badge */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(90deg, rgba(74,222,128,0.08) 0%, rgba(74,222,128,0.03) 100%)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '100px', padding: '5px 12px 5px 8px',
          }}>
            <div
              className="live-dot"
              style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: theme.success, color: theme.success,
                boxShadow: `0 0 6px ${theme.success}`,
                flexShrink: 0
              }}
            />
            <span style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
              fontFamily: theme.fontMono,
              background: `linear-gradient(90deg, #fff 0%, ${theme.success} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>SYSTEM LIVE</span>
          </div>
          <span style={{
            fontSize: '9px', color: theme.textMuted,
            fontFamily: theme.fontMono, letterSpacing: '1px'
          }}>V3.0 // AUTHORITY ACTIVE</span>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

        {/* Notification button */}
        <div style={{ position: 'relative' }}>
          <button style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '8px', cursor: 'pointer', padding: '6px 12px',
            fontSize: '10px', color: theme.textSecondary, fontWeight: 700,
            letterSpacing: '1px', fontFamily: theme.fontMono,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>NOTIF</button>
          {auditLogs.filter(l => l.action === 'publish').length > 0 && (
            <div style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '14px', height: '14px', background: theme.danger,
              borderRadius: '50%', border: '2px solid #050508',
              fontSize: '8px', color: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
            }}>
              {auditLogs.filter(l => l.action === 'publish').length}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
