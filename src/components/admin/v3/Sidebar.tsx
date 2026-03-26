'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';

const NAV_GROUPS = [
  {
    title: 'Core Authority',
    items: [
      { id: 'dashboard', name: 'Dashboard', abbr: 'DA', path: '/admin-v3' },
      { id: 'levels', name: 'Level Matrix', abbr: 'LV', path: '/admin-v3/levels' }
    ]
  },
  {
    title: 'Entity Management',
    items: [
      { id: 'characters', name: 'Characters', abbr: 'CH', path: '/admin-v3/characters' },
      { id: 'now', name: 'NOW Windows', abbr: 'NW', path: '/admin-v3/now-configs' },
      { id: 'gym', name: 'Focus Gym', abbr: 'FG', path: '/admin-v3/games' },
      { id: 'themes', name: 'Themes', abbr: 'TH', path: '/admin-v3/themes' },
      { id: 'features', name: 'Global Features', abbr: 'GF', path: '/admin-v3/features' }
    ]
  },
  {
    title: 'Users & System',
    items: [
      { id: 'users', name: 'Live Users', abbr: 'US', path: '/admin-v3/users' },
      { id: 'settings', name: 'Admin Settings', abbr: 'AS', path: '/admin-v3/settings' }
    ]
  }
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed } = useAdminStore();
  const theme = getTheme('void');

  return (
    <aside style={{
      width: isSidebarCollapsed ? '80px' : '280px',
      background: '#050508',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      height: '100vh',
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100,
      overflowX: 'hidden'
    }}>

      {/* ── Brand ── */}
      <div style={{
        padding: '28px 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Monogram */}
          <div style={{
            width: '40px', height: '40px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(129,140,248,0.22) 0%, rgba(129,140,248,0.06) 100%)',
            border: '1px solid rgba(129,140,248,0.35)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 0 20px rgba(129,140,248,0.14), inset 0 1px 0 rgba(129,140,248,0.2)'
          }}>
            <span style={{
              fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: '22px',
              color: '#fff', letterSpacing: '-1px', lineHeight: 1
            }}>A</span>
            <span style={{
              position: 'absolute', top: '6px', right: '7px',
              fontFamily: theme.fontMono, fontSize: '8px', fontWeight: 700,
              color: theme.accent, lineHeight: 1
            }}>1</span>
          </div>

          {!isSidebarCollapsed && (
            <div>
              <div style={{
                fontFamily: theme.fontDisplay, fontWeight: 800, fontSize: '15px',
                letterSpacing: '1.5px', color: '#fff', lineHeight: 1, marginBottom: '4px'
              }}>ARC ONE</div>
              <div style={{
                fontFamily: theme.fontMono, fontSize: '9px', fontWeight: 600,
                letterSpacing: '2px', color: theme.accent, textTransform: 'uppercase'
              }}>ADMIN // V3</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Nav Groups ── */}
      <nav style={{ flex: 1, padding: '0 14px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.title}>
            {!isSidebarCollapsed && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '8px', paddingLeft: '4px'
              }}>
                <div style={{
                  width: '2px', height: '10px', borderRadius: '1px',
                  background: 'rgba(255,255,255,0.14)'
                }} />
                <h3 style={{
                  fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px',
                  color: theme.textMuted, margin: 0, fontFamily: theme.fontMono
                }}>
                  {group.title}
                </h3>
              </div>
            )}

            {/* Items container with vertical connector line */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '2px',
              position: 'relative',
              paddingLeft: isSidebarCollapsed ? '0' : '4px'
            }}>
              {!isSidebarCollapsed && (
                <div style={{
                  position: 'absolute', left: '19px', top: '10px', bottom: '10px',
                  width: '1px', background: 'rgba(255,255,255,0.055)',
                  borderRadius: '1px', pointerEvents: 'none'
                }} />
              )}

              {group.items.map(item => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: isActive ? '#fff' : theme.textSecondary,
                      background: isActive ? 'rgba(129,140,248,0.10)' : 'transparent',
                      border: isActive ? '1px solid rgba(129,140,248,0.16)' : '1px solid transparent',
                      transition: 'all 0.2s ease',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Left glow bar for active item */}
                    {isActive && (
                      <div style={{
                        position: 'absolute', left: 0, top: '18%', bottom: '18%',
                        width: '2px', borderRadius: '0 2px 2px 0',
                        background: theme.accent,
                        boxShadow: `0 0 8px ${theme.accent}, 0 0 16px ${theme.accent}66`
                      }} />
                    )}

                    <span style={{
                      fontFamily: theme.fontMono,
                      fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px',
                      color: isActive ? theme.accent : theme.textMuted,
                      minWidth: '24px', textAlign: 'center'
                    }}>
                      {item.abbr}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ letterSpacing: '0.2px' }}>{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(129,140,248,0.3), rgba(74,222,128,0.2))',
            border: `2px solid rgba(129,140,248,0.4)`,
            boxShadow: '0 0 10px rgba(129,140,248,0.25)'
          }} />
          {!isSidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Hrishita</span>
              <span style={{
                fontSize: '9px', color: theme.accent,
                fontFamily: theme.fontMono, letterSpacing: '1px', textTransform: 'uppercase'
              }}>Super Admin</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
