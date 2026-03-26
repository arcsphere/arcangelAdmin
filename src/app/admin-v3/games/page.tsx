'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, StatusPill, CompactPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput, FormSelect } from '@/components/admin/v3/EditDrawer';
import { GameConfig } from '@/types/admin';

export default function GamesPage() {
  const { games, updateEntity, deleteEntity } = useAdminStore();
  const theme = getTheme('void');
  
  const [selected, setSelected] = useState<GameConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (item: GameConfig) => {
    setSelected({ ...item });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (selected) {
      updateEntity('game', selected.id, selected);
      setIsDrawerOpen(false);
    }
  };

  const columns: Column<GameConfig>[] = [
    { header: 'ID', accessor: 'id', width: '120px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Category', accessor: (g: GameConfig) => <CompactPill color={g.category === 'llm_engine' ? theme.accent : theme.textMuted}>{g.category.toUpperCase()}</CompactPill> },
    { header: 'Unlock Lvl', accessor: (g: GameConfig) => <span style={{ fontWeight: 700 }}>{g.unlock_level}</span>, width: '100px', align: 'center' as const },
    { header: 'App Type', accessor: 'app_type' },
    { header: 'Status', accessor: (g: GameConfig) => <StatusPill status={g.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="Focus Gym Configurations"
        description="Manage the 50+ training games, including LLM Engine specific cognitive frameworks."
        data={games}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Edit Game: ${selected.title}`}
          onSave={handleSave}
          onDelete={() => { deleteEntity('game', selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Identity & Categorization</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput 
                  value={selected.title} 
                  onChange={e => setSelected({ ...selected, title: e.target.value })}
                  placeholder="Title"
                />
                <FormSelect 
                  value={selected.category}
                  onChange={e => setSelected({ ...selected, category: e.target.value as any })}
                >
                  <option value="presence">Presence</option>
                  <option value="body">Body</option>
                  <option value="emotion">Emotion</option>
                  <option value="priority">Priority</option>
                  <option value="llm_engine">LLM Engine</option>
                </FormSelect>
              </div>
            </section>

            <section>
              <FormLabel>Unlock & Gating Logic</FormLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Unlock Level</span>
                  <FormInput 
                    type="number"
                    value={selected.unlock_level}
                    onChange={e => setSelected({ ...selected, unlock_level: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Unauthorized UI</span>
                  <FormSelect 
                    value={selected.unauthorized_behavior}
                    onChange={e => setSelected({ ...selected, unauthorized_behavior: e.target.value as any })}
                  >
                    <option value="show_lock">Show Lock Icon</option>
                    <option value="hidden">Vanish (Secret)</option>
                    <option value="redirect">Redirect to NOW</option>
                  </FormSelect>
                </div>
              </div>
            </section>

            <section>
              <FormLabel>Technical Props (JSON)</FormLabel>
              <textarea 
                value={JSON.stringify(selected.preload_metadata, null, 2)}
                onChange={e => {
                  try { setSelected({ ...selected, preload_metadata: JSON.parse(e.target.value) }); } catch(err) {}
                }}
                style={{
                  width: '100%', minHeight: '120px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
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
