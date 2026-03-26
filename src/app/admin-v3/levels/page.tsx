'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { AdminTable, CompactPill, StatusPill } from '@/components/admin/v3/AdminTable';
import { EditDrawer, FormLabel, FormInput, FormSelect, FormMultiSelect } from '@/components/admin/v3/EditDrawer';
import { LevelConfigV3 } from '@/types/admin';

export default function LevelMatrixPage() {
  const { levels, updateEntity, characters, nowConfigs, themes, games, features } = useAdminStore();
  const theme = getTheme('void');
  
  const [selectedLevel, setSelectedLevel] = useState<LevelConfigV3 | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleRowClick = (level: LevelConfigV3) => {
    setSelectedLevel({ ...level });
    setIsDrawerOpen(true);
  };

  const handleSave = () => {
    if (selectedLevel) {
      updateEntity('level', selectedLevel.level_number, selectedLevel);
      setIsDrawerOpen(false);
    }
  };

  const columns: any[] = [
    { header: 'Lvl', accessor: (l: LevelConfigV3) => <span style={{ fontWeight: 800, color: theme.accent }}>{l.level_number}</span>, width: '60px' },
    { header: 'Title', accessor: 'title', width: '150px' },
    { header: 'Character', accessor: (l: LevelConfigV3) => <CompactPill color="#818CF8">{l.character_config_id}</CompactPill> },
    { header: 'NOW Config', accessor: (l: LevelConfigV3) => <CompactPill color="#F472B6">{l.now_config_id}</CompactPill> },
    { header: 'Theme', accessor: (l: LevelConfigV3) => <CompactPill color="#6BCB77">{l.theme_config_id}</CompactPill> },
    { header: 'Activities', accessor: (l: LevelConfigV3) => <span style={{ fontSize: '11px', color: theme.textSecondary }}>{l.archangel_activities.join(', ')}</span> },
    { header: 'Intelligence', accessor: (l: LevelConfigV3) => <span style={{ fontSize: '11px', color: theme.textSecondary }}>{l.intelligence_features.join(', ')}</span> },
    { header: 'Games', accessor: (l: LevelConfigV3) => <span style={{ fontSize: '12px' }}>{l.enabled_game_ids.length} Active</span> },
    { header: 'Features', accessor: (l: LevelConfigV3) => <span style={{ fontSize: '12px' }}>{l.enabled_feature_ids.length} Active</span> },
    { header: 'Status', accessor: (l: LevelConfigV3) => <StatusPill status={l.status} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <AdminTable 
        title="Level Configuration Matrix"
        description="The Central Authority: Manage relational configurations for all 17 system levels."
        data={levels}
        columns={columns}
        onRowClick={handleRowClick}
      />

      {selectedLevel && (
        <EditDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={`Edit Level ${selectedLevel.level_number}: ${selectedLevel.title}`}
          description="Update linked configurations and system capabilities for this level."
          onSave={handleSave}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <section>
              <FormLabel>Basic Information</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormInput 
                  value={selectedLevel.title} 
                  onChange={e => setSelectedLevel({ ...selectedLevel, title: e.target.value })}
                  placeholder="Level Title"
                />
                <textarea 
                  value={selectedLevel.description}
                  onChange={e => setSelectedLevel({ ...selectedLevel, description: e.target.value })}
                  style={{
                    width: '100%', minHeight: '80px', background: '#141416', border: `1px solid ${theme.borderDefault}`,
                    borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none'
                  }}
                />
              </div>
            </section>

            <section>
              <FormLabel>Relational Configurations</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Character Config</span>
                  <FormSelect 
                    value={selectedLevel.character_config_id}
                    onChange={e => setSelectedLevel({ ...selectedLevel, character_config_id: e.target.value })}
                  >
                    {characters.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </FormSelect>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>NOW Window Config</span>
                  <FormSelect 
                    value={selectedLevel.now_config_id}
                    onChange={e => setSelectedLevel({ ...selectedLevel, now_config_id: e.target.value })}
                  >
                    {nowConfigs.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </FormSelect>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Theme Config</span>
                  <FormSelect 
                    value={selectedLevel.theme_config_id}
                    onChange={e => setSelectedLevel({ ...selectedLevel, theme_config_id: e.target.value })}
                  >
                    {themes.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </FormSelect>
                </div>
              </div>
            </section>

            <section>
              <FormLabel>Economy & Progression</FormLabel>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Streak Target</span>
                  <FormInput 
                    type="number"
                    value={selectedLevel.streak_target}
                    onChange={e => setSelectedLevel({ ...selectedLevel, streak_target: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Focus Units Req.</span>
                  <FormInput 
                    type="number"
                    value={selectedLevel.focus_units_required}
                    onChange={e => setSelectedLevel({ ...selectedLevel, focus_units_required: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </section>

            <section>
              <FormLabel>Enabled Games & Features</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Gymnasium Games</span>
                  <FormMultiSelect 
                    options={games.map(g => ({ value: g.id, label: g.title }))}
                    selectedValues={selectedLevel.enabled_game_ids}
                    onChange={vals => setSelectedLevel({ ...selectedLevel, enabled_game_ids: vals })}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>System Features</span>
                  <FormMultiSelect 
                    options={features.map(f => ({ value: f.id, label: f.title }))}
                    selectedValues={selectedLevel.enabled_feature_ids}
                    onChange={vals => setSelectedLevel({ ...selectedLevel, enabled_feature_ids: vals })}
                  />
                </div>
              </div>
            </section>

            <section>
              <FormLabel>System Capabilities</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>Character Capabilities</span>
                  <FormMultiSelect 
                    options={[
                      { value: 'voice', label: 'Voice' },
                      { value: 'eye_blink', label: 'Eye Blink' },
                      { value: 'morphing', label: 'Morphing' },
                      { value: 'pulsate', label: 'Pulsate' }
                    ]}
                    selectedValues={selectedLevel.character_capabilities}
                    onChange={vals => setSelectedLevel({ ...selectedLevel, character_capabilities: vals })}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: theme.textMuted, marginBottom: '4px', display: 'block' }}>NOW Capabilities</span>
                  <FormMultiSelect 
                    options={[
                      { value: 'timer_start', label: 'Timer Start' },
                      { value: 'timer_extend', label: 'Timer Extend' },
                      { value: 'chained_sessions', label: 'Chained Sessions' },
                      { value: 'task_prioritize', label: 'Task Prioritize' }
                    ]}
                    selectedValues={selectedLevel.now_capabilities}
                    onChange={vals => setSelectedLevel({ ...selectedLevel, now_capabilities: vals })}
                  />
                </div>
              </div>
            </section>

            <section>
              <FormLabel>Ceremony & Celebration</FormLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <FormSelect 
                  value={selectedLevel.ceremony_config?.unlock_animation || 'none'}
                  onChange={e => setSelectedLevel({ 
                    ...selectedLevel, 
                    ceremony_config: { ...(selectedLevel.ceremony_config || { soundscape_id: '', broadcast_message: '' }), unlock_animation: e.target.value } 
                  })}
                >
                  <option value="none">No Animation</option>
                  <option value="glow_wave">Glow Wave</option>
                  <option value="ascension_1">Ascension Alpha</option>
                  <option value="shatter_bloom">Shatter Bloom</option>
                </FormSelect>
                <FormInput 
                  value={selectedLevel.ceremony_config?.broadcast_message || ''}
                  onChange={e => setSelectedLevel({ 
                    ...selectedLevel, 
                    ceremony_config: { ...(selectedLevel.ceremony_config || { unlock_animation: '', soundscape_id: '' }), broadcast_message: e.target.value } 
                  })}
                  placeholder="Broadcast Message (e.g. 'An identity emerges.')"
                />
              </div>
            </section>
          </div>
        </EditDrawer>
      )}
    </div>
  );
}
