'use client';

import React from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';

export default function AdminDashboard() {
  const { characters, nowConfigs, games, themes, users, auditLogs } = useAdminStore();
  const theme = getTheme('void');

  const stats = [
    { label: 'Total Levels', value: 17, abbr: 'LV', color: theme.accent },
    { label: 'Active Games', value: games.length, abbr: 'FG', color: theme.success },
    { label: 'Active Themes', value: themes.length, abbr: 'TH', color: theme.warning },
    { label: 'Live Users', value: users.length, abbr: 'US', color: theme.info },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', position: 'relative' }}>

      {/* ── Ambient Glow Orbs ── */}
      <div style={{
        position: 'absolute', top: '-120px', left: '-80px',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(129,140,248,0.055) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '-200px', right: '-100px',
        width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', top: '38%', left: '42%',
        width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,191,36,0.025) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* ── Header ── */}
      <header style={{ position: 'relative', zIndex: 1 }}>
        {/* Section label row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '22px' }}>
          <span style={{
            fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 600,
            color: theme.accent, letterSpacing: '2px', textTransform: 'uppercase',
            background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.2)',
            padding: '4px 10px', borderRadius: '4px', whiteSpace: 'nowrap'
          }}>[ COMMAND CENTER ]</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{
            fontFamily: theme.fontMono, fontSize: '9px', color: theme.textMuted,
            letterSpacing: '1px', whiteSpace: 'nowrap'
          }}>ARC-V3 // DASHBOARD</span>
        </div>

        <h1 style={{
          fontSize: '40px', fontWeight: 800, marginBottom: '12px',
          fontFamily: theme.fontDisplay, letterSpacing: '-1px', lineHeight: 1,
          background: 'linear-gradient(135deg, #ffffff 55%, rgba(129,140,248,0.85) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          System Dashboard
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: '14px', fontFamily: theme.fontBody, letterSpacing: '0.2px' }}>
          Welcome back,{' '}
          <span style={{ color: theme.textPrimary, fontWeight: 600 }}>Hrishita</span>.
          {' '}Monitoring{' '}
          <span style={{ color: theme.accent, fontFamily: theme.fontMono }}>8</span>
          {' '}root entities and{' '}
          <span style={{ color: theme.accent, fontFamily: theme.fontMono }}>128</span>
          {' '}global focus signals.
        </p>
      </header>

      {/* ── Stat Cards ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', position: 'relative', zIndex: 1
      }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="stat-card-enter"
            style={{
              background: theme.bgSecondary,
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '28px 24px 24px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)`,
              animationDelay: `${i * 80}ms`
            }}
          >
            {/* Left color strip */}
            <div style={{
              position: 'absolute', left: 0, top: '18%', bottom: '18%',
              width: '3px', borderRadius: '0 3px 3px 0',
              background: stat.color,
              boxShadow: `0 0 12px ${stat.color}99`
            }} />

            {/* Radial color overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse at top left, ${stat.color}09 0%, transparent 65%)`,
              pointerEvents: 'none'
            }} />

            {/* Top row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '20px', position: 'relative'
            }}>
              <span style={{
                fontFamily: theme.fontMono, fontSize: '9px', fontWeight: 700,
                color: stat.color, letterSpacing: '1.5px',
                background: `${stat.color}14`, border: `1px solid ${stat.color}30`,
                padding: '3px 8px', borderRadius: '4px'
              }}>{stat.abbr}</span>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: stat.color, opacity: 0.55,
                boxShadow: `0 0 8px ${stat.color}`
              }} />
            </div>

            {/* Number */}
            <div style={{
              fontSize: '52px', fontWeight: 800, lineHeight: 1,
              color: '#fff', fontFamily: theme.fontDisplay,
              letterSpacing: '-2px', marginBottom: '12px', position: 'relative'
            }}>{stat.value}</div>

            {/* Label */}
            <div style={{
              fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 500,
              color: theme.textMuted, letterSpacing: '1.5px', textTransform: 'uppercase',
              position: 'relative'
            }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Section divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1, marginBottom: '-32px' }}>
        <div style={{ height: '1px', width: '32px', background: 'rgba(255,255,255,0.1)' }} />
        <span style={{
          fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 600,
          color: theme.textMuted, letterSpacing: '2px', textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>[ SYSTEM ACTIVITY ]</span>
        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* ── Bottom Grid ── */}
      <div style={{
        display: 'grid', gridTemplateColumns: '3fr 1.2fr',
        gap: '28px', position: 'relative', zIndex: 1
      }}>
        {/* Recent Audit Logs */}
        <section style={{
          background: theme.bgSecondary,
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '20px',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <span style={{
              fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 700,
              color: theme.textMuted, letterSpacing: '2px', textTransform: 'uppercase'
            }}>[ AUDIT LOG ]</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{
              fontFamily: theme.fontMono, fontSize: '9px',
              color: `${theme.success}99`, letterSpacing: '1px'
            }}>LIVE</span>
            <div
              className="live-dot"
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: theme.success, color: theme.success,
                boxShadow: `0 0 6px ${theme.success}`
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {auditLogs.length > 0 ? auditLogs.slice(0, 8).map(log => {
              const stripeColor =
                log.action === 'create'  ? theme.success :
                log.action === 'delete'  ? theme.danger  :
                log.action === 'publish' ? theme.accent  :
                                           theme.warning;
              return (
                <div key={log.id} style={{
                  display: 'flex', alignItems: 'stretch',
                  borderRadius: '10px', overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.015)'
                }}>
                  {/* Left stripe */}
                  <div style={{
                    width: '3px', flexShrink: 0,
                    background: stripeColor,
                    boxShadow: `0 0 8px ${stripeColor}55`
                  }} />
                  {/* Content */}
                  <div style={{
                    flex: 1, display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px'
                  }}>
                    <div>
                      <div style={{
                        fontSize: '13px', fontWeight: 600,
                        color: theme.textPrimary, marginBottom: '3px', lineHeight: 1.3
                      }}>{log.change_summary}</div>
                      <div style={{
                        fontSize: '11px', color: theme.textMuted,
                        fontFamily: theme.fontMono, letterSpacing: '0.3px'
                      }}>
                        {log.admin_name}
                        <span style={{ color: 'rgba(255,255,255,0.15)', margin: '0 6px' }}>•</span>
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                    <span style={{
                      fontFamily: theme.fontMono, fontSize: '9px', fontWeight: 700,
                      padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase',
                      letterSpacing: '1px', color: stripeColor,
                      background: `${stripeColor}14`, border: `1px solid ${stripeColor}30`,
                      flexShrink: 0, marginLeft: '12px'
                    }}>
                      {log.action}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <div style={{
                color: theme.textMuted, fontSize: '12px', textAlign: 'center',
                padding: '48px', fontFamily: theme.fontMono, letterSpacing: '1px'
              }}>
                // NO EVENTS LOGGED
              </div>
            )}
          </div>
        </section>

        {/* Right column */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Quick Actions */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(129,140,248,0.07) 0%, rgba(129,140,248,0.025) 100%)',
            border: '1px solid rgba(129,140,248,0.18)',
            borderRadius: '20px', padding: '28px',
            boxShadow: 'inset 0 1px 0 rgba(129,140,248,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '3px', height: '14px', background: theme.accent, borderRadius: '2px' }} />
              <span style={{
                fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 700,
                color: theme.accent, letterSpacing: '2px', textTransform: 'uppercase'
              }}>QUICK ACTIONS</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                background: theme.accent,
                boxShadow: `0 4px 16px ${theme.accent}44`,
                color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer',
                fontSize: '13px', fontFamily: theme.fontBody, textAlign: 'left',
                letterSpacing: '0.2px'
              }}>Create New Game</button>
              <button style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: theme.textSecondary, fontWeight: 600, cursor: 'pointer',
                fontSize: '13px', fontFamily: theme.fontBody, textAlign: 'left'
              }}>Push Global Sync</button>
              <button style={{
                width: '100%', padding: '13px 16px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                color: theme.textSecondary, fontWeight: 600, cursor: 'pointer',
                fontSize: '13px', fontFamily: theme.fontBody, textAlign: 'left'
              }}>System Broadcast</button>
            </div>
          </div>

          {/* Maintenance */}
          <div style={{
            background: theme.bgSecondary,
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '20px', padding: '24px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ width: '3px', height: '14px', background: theme.warning, borderRadius: '2px' }} />
              <span style={{
                fontFamily: theme.fontMono, fontSize: '10px', fontWeight: 700,
                color: theme.warning, letterSpacing: '2px', textTransform: 'uppercase'
              }}>MAINTENANCE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: theme.textSecondary, fontFamily: theme.fontBody }}>
                Maintenance Mode
              </span>
              <div style={{
                width: '44px', height: '24px', background: theme.bgTertiary,
                borderRadius: '24px', position: 'relative', cursor: 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.4)'
              }}>
                <div style={{
                  position: 'absolute', left: '3px', top: '3px',
                  width: '16px', height: '16px', background: theme.textMuted,
                  borderRadius: '50%', boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
