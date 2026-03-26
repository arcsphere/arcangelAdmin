'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, CompactPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput } from '@/components/admin/v3/EditDrawer';
import { AdminUserView } from '@/types/admin';

export default function UsersPage() {
  const { users, forceUserLevel, deleteUser } = useAdminStore();
  const theme = getTheme('void');
  
  const [selected, setSelected] = useState<AdminUserView | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (u: AdminUserView) => {
    setSelected({ ...u });
    setIsDrawerOpen(true);
  };

  const columns: Column<AdminUserView>[] = [
    { header: 'ID', accessor: (u: AdminUserView) => <span style={{ fontSize: '11px', color: theme.textMuted, fontFamily: 'monospace' }}>{u.id.slice(0, 8)}…</span>, width: '100px' },
    {
      header: 'Name',
      accessor: (u: AdminUserView) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 600 }}>{u.display_name ?? u.anonymous_name ?? 'Unknown'}</span>
          {u.is_guest && <CompactPill color={theme.textMuted}>GUEST</CompactPill>}
        </div>
      ),
      width: '250px'
    },
    { header: 'Level', accessor: (u: AdminUserView) => <span style={{ fontWeight: 800, color: theme.accent }}>{u.level}</span>, align: 'center' as const, width: '80px' },
    { header: 'Streak', accessor: (u: AdminUserView) => u.current_streak, align: 'center' as const },
    { header: 'Focus Units', accessor: (u: AdminUserView) => u.focus_units, align: 'center' as const },
    { header: 'Last Active', accessor: (u: AdminUserView) => u.last_active_date ?? '—', width: '140px' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="Live User Hub"
        description="Monitor system activity and perform administrative overrides on live user states."
        data={users}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selected.display_name}
          description={`Monitoring user ID: ${selected.id}`}
          onDelete={() => { deleteUser(selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '20px', background: theme.bgPrimary, borderRadius: '16px', border: `1px solid ${theme.borderDefault}` }}>
                <div style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Current Streak</div>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>{selected.current_streak}d</div>
              </div>
              <div style={{ padding: '20px', background: theme.bgPrimary, borderRadius: '16px', border: `1px solid ${theme.borderDefault}` }}>
                <div style={{ fontSize: '10px', color: theme.textMuted, textTransform: 'uppercase', marginBottom: '8px' }}>Focus Units</div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: theme.accent }}>{selected.focus_units}</div>
              </div>
            </section>

            <section>
              <FormLabel>Force Level Override</FormLabel>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {[-3, -2, -1, 0, 1, 2, 3, 5, 8, 10, 13].map(lvl => (
                  <button 
                    key={lvl}
                    onClick={() => {
                      forceUserLevel(selected.id, lvl);
                      setSelected({ ...selected, level: lvl });
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: selected.level === lvl ? theme.accent : 'transparent',
                      color: selected.level === lvl ? '#fff' : theme.textSecondary,
                      border: `1px solid ${selected.level === lvl ? theme.accent : theme.borderDefault}`,
                      cursor: 'pointer'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '11px', color: theme.textMuted, marginTop: '12px' }}>Force-setting a level will trigger the appropriate ceremonies for the user on next sync.</p>
            </section>

            <section>
              <FormLabel>Activity Log</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '12px' }}>
                  <span style={{ color: theme.success }}>SUCCESS</span> • Session Completed • 25m Focus • Today 14:15
                </div>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '12px' }}>
                  <span style={{ color: theme.accent }}>ECONOMY</span> • Earned 50 ✨ Units • Today 14:15
                </div>
                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px', fontSize: '12px' }}>
                  <span style={{ color: theme.textMuted }}>SYSTEM</span> • App Opened • Today 12:02
                </div>
              </div>
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
