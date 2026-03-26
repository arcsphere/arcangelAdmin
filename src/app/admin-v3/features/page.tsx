'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, StatusPill, CompactPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput, FormSelect } from '@/components/admin/v3/EditDrawer';
import { FeatureConfig } from '@/types/admin';

export default function FeaturesPage() {
  const { features, updateEntity, deleteEntity } = useAdminStore();
  const theme = getTheme('void');
  
  const [selected, setSelected] = useState<FeatureConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (item: FeatureConfig) => {
    setSelected({ ...item });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (selected) {
      updateEntity('feature', selected.id, selected);
      setIsDrawerOpen(false);
    }
  };

  const columns: Column<FeatureConfig>[] = [
    { header: 'ID', accessor: 'id', width: '150px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Domain', accessor: (f: FeatureConfig) => <CompactPill color={theme.accent}>{f.domain.toUpperCase()}</CompactPill> },
    { header: 'Type', accessor: 'type' },
    { header: 'Status', accessor: (f: FeatureConfig) => <StatusPill status={f.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="Global Feature Configurations"
        description="Manage high-level feature flags, widget registry, and tool configurations."
        data={features}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Edit Feature: ${selected.title}`}
          onSave={handleSave}
          onDelete={() => { deleteEntity('feature', selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Identity & Domain</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput 
                  value={selected.title} 
                  onChange={e => setSelected({ ...selected, title: e.target.value })}
                  placeholder="Title"
                />
                <FormSelect 
                  value={selected.domain}
                  onChange={e => setSelected({ ...selected, domain: e.target.value as any })}
                >
                  <option value="now">Now Window</option>
                  <option value="character">Character</option>
                  <option value="game">Gymnasium</option>
                  <option value="shell">System Shell</option>
                </FormSelect>
              </div>
            </section>

            <section>
              <FormLabel>Configurable Props (JSON)</FormLabel>
              <textarea 
                value={JSON.stringify(selected.configurable_props, null, 2)}
                onChange={e => {
                  try { setSelected({ ...selected, configurable_props: JSON.parse(e.target.value) }); } catch(err) {}
                }}
                style={{
                  width: '100%', minHeight: '180px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
                  borderRadius: '10px', padding: '12px 16px', color: theme.accent, fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                }}
              />
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
