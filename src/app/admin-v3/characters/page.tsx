'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, StatusPill, Column } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput } from '@/components/admin/v3/EditDrawer';
import { CharacterConfig } from '@/types/admin';

export default function CharactersPage() {
  const { characters, addEntity, updateEntity, deleteEntity } = useAdminStore();
  const theme = getTheme('void');

  const [selected, setSelected] = useState<CharacterConfig | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const handleRowClick = (item: CharacterConfig) => {
    setSelected({ ...item });
    setIsNew(false);
    setIsDrawerOpen(true);
  };

  const handleCreateNew = () => {
    setSelected({
      id: `char_${Date.now()}`,
      title: '',
      description: '',
      body_config: {},
      mind_config: { logic_type: 'state_machine', behavior_trees: '', emotional_palettes: [] },
      emotion_palette: [],
      discovery_palette: [],
      activities_palette: [],
      skills_palette: [],
      wisdom_palette: [],
      is_active: true,
      status: 'draft',
      updated_at: new Date().toISOString(),
    });
    setIsNew(true);
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (!selected) return;
    if (isNew) {
      addEntity('character', selected);
    } else {
      updateEntity('character', selected.id, selected);
    }
    setIsDrawerOpen(false);
    setIsNew(false);
  };

  const columns: Column<CharacterConfig>[] = [
    { header: 'ID', accessor: 'id', width: '120px' },
    { header: 'Title', accessor: 'title', width: '200px' },
    { header: 'Description', accessor: 'description' },
    { header: 'Status', accessor: (c: CharacterConfig) => <StatusPill status={c.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable
        title="Character Configurations"
        description="Manage ArcAngelOne's physical body, behavioral logic, and emotional palettes."
        data={characters}
        columns={columns}
        onRowClick={handleRowClick}
        onCreateNew={handleCreateNew}
      />

      {selected && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={isNew ? 'New Character Config' : `Edit: ${selected.title}`}
          onSave={handleSave}
          onDelete={isNew ? undefined : () => { deleteEntity('character', selected.id); setIsDrawerOpen(false); }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Identity</FormLabel>
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
              <FormLabel>System JSON (Body & Mind)</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Body Config (Godot)</span>
                  <textarea 
                    value={JSON.stringify(selected.body_config, null, 2)}
                    onChange={e => {
                      try { setSelected({ ...selected, body_config: JSON.parse(e.target.value) }); } catch(err) {}
                    }}
                    style={{
                      width: '100%', minHeight: '120px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
                      borderRadius: '10px', padding: '12px 16px', color: theme.success, fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                    }}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Mind Config (Logic)</span>
                  <textarea 
                    value={JSON.stringify(selected.mind_config, null, 2)}
                    onChange={e => {
                      try { setSelected({ ...selected, mind_config: JSON.parse(e.target.value) }); } catch(err) {}
                    }}
                    style={{
                      width: '100%', minHeight: '120px', background: '#050508', border: `1px solid ${theme.borderDefault}`,
                      borderRadius: '10px', padding: '12px 16px', color: theme.warning, fontSize: '12px', outline: 'none', fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
