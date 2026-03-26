'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, StatusPill, CompactPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput, FormSelect } from '@/components/admin/v3/EditDrawer';
import { NowConfig } from '@/types/admin';

export default function NowConfigsPage() {
  const { nowConfigs, updateEntity, deleteEntity } = useAdminStore();
  const theme = getTheme('void');
  
  const [selected, setSelected] = useState<NowConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (item: NowConfig) => {
    setSelected({ ...item });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (selected) {
      updateEntity('now_config', selected.id, selected);
      setIsDrawerOpen(false);
    }
  };

  const columns: Column<NowConfig>[] = [
    { header: 'ID', accessor: 'id', width: '150px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Mode', accessor: (c: NowConfig) => <CompactPill color={c.mode === 'flow' ? '#F472B6' : '#818CF8'}>{c.mode.toUpperCase()}</CompactPill> },
    { header: 'Presets', accessor: (c: NowConfig) => <span style={{ fontSize: '12px' }}>{c.timer_presets.join(', ')} mins</span> },
    { header: 'Status', accessor: (c: NowConfig) => <StatusPill status={c.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="NOW Window Configurations"
        description="Define session modes, timer presets, and feature availability for the core focus window."
        data={nowConfigs}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Edit Window: ${selected.title}`}
          onSave={handleSave}
          onDelete={() => { deleteEntity('now_config', selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Identity & Mode</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput 
                  value={selected.title} 
                  onChange={e => setSelected({ ...selected, title: e.target.value })}
                  placeholder="Title"
                />
                <FormSelect 
                  value={selected.mode}
                  onChange={e => setSelected({ ...selected, mode: e.target.value as any })}
                >
                  <option value="lite">Lite</option>
                  <option value="focus">Focus</option>
                  <option value="flow">Flow</option>
                </FormSelect>
              </div>
            </section>

            <section>
              <FormLabel>Feature Toggles</FormLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {Object.entries(selected.features).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input 
                      type="checkbox" 
                      checked={value}
                      onChange={e => setSelected({ ...selected, features: { ...selected.features, [key]: e.target.checked } })}
                    />
                    <span style={{ fontSize: '13px', color: theme.textSecondary }}>{key.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <FormLabel>Layout JSON</FormLabel>
              <textarea 
                value={JSON.stringify(selected.layout_config, null, 2)}
                onChange={e => {
                  try { setSelected({ ...selected, layout_config: JSON.parse(e.target.value) }); } catch(err) {}
                }}
                style={{
                  width: '100%', minHeight: '120px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
                  borderRadius: '10px', padding: '12px 16px', color: theme.success, fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                }}
              />
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
