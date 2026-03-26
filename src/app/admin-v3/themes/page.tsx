'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, StatusPill, CompactPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput } from '@/components/admin/v3/EditDrawer';
import { ThemeConfig } from '@/types/admin';

export default function ThemesPage() {
  const { themes, updateEntity, deleteEntity } = useAdminStore();
  const theme = getTheme('void');
  
  const [selected, setSelected] = useState<ThemeConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (item: ThemeConfig) => {
    setSelected({ ...item });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (selected) {
      updateEntity('theme', selected.id, selected);
      setIsDrawerOpen(false);
    }
  };

  const columns: Column<ThemeConfig>[] = [
    { header: 'ID', accessor: 'id', width: '150px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Shell', accessor: (t: ThemeConfig) => <CompactPill color={theme.accent}>{t.shell_theme}</CompactPill> },
    { header: 'Motion', accessor: 'motion_profile' },
    { header: 'Status', accessor: (t: ThemeConfig) => <StatusPill status={t.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="Theme Configurations"
        description="Manage visual tokens, seasonal palettes, and motion profiles across the ecosystem."
        data={themes}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Edit Theme: ${selected.title}`}
          onSave={handleSave}
          onDelete={() => { deleteEntity('theme', selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Visual Identity</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput 
                  value={selected.title} 
                  onChange={e => setSelected({ ...selected, title: e.target.value })}
                  placeholder="Title"
                />
                <textarea 
                  value={selected.description}
                  onChange={e => setSelected({ ...selected, description: e.target.value })}
                  style={{
                    width: '100%', minHeight: '60px', background: '#141416', border: `1px solid ${theme.borderDefault}`,
                    borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>
            </section>

            <section>
              <FormLabel>Palette Overrides (CSS Variables)</FormLabel>
              <textarea 
                value={JSON.stringify(selected.palette_values, null, 2)}
                onChange={e => {
                  try { setSelected({ ...selected, palette_values: JSON.parse(e.target.value) }); } catch(err) {}
                }}
                style={{
                  width: '100%', minHeight: '180px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
                  borderRadius: '10px', padding: '12px 16px', color: theme.textAccent, fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                }}
              />
              <p style={{ fontSize: '10px', color: theme.textMuted, marginTop: '8px' }}>Use standard CSS custom property keys (e.g. --bg-primary).</p>
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
