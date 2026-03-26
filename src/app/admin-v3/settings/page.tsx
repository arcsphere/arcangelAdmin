'use client';

import React from 'react';
import { useAdminStore } from '@/hooks/useAdminStore';
import { getTheme } from '@/themes';
import { FormLabel, FormInput, FormSelect } from '@/components/admin/v3/EditDrawer';

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [localSettings, setLocalSettings] = React.useState(settings);
  const theme = getTheme('void');

  const handleSave = () => {
    updateSettings(localSettings);
    alert('Settings saved successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', maxWidth: '800px' }}>
      <header>
        <h1 style={{ 
          fontSize: '32px', fontWeight: 800, marginBottom: '8px', 
          fontFamily: theme.fontDisplay, letterSpacing: '-0.5px' 
        }}>
          Admin Settings
        </h1>
        <p style={{ color: theme.textSecondary, fontSize: '15px' }}>
          Global system overrides, economy balancing, and maintenance controls.
        </p>
      </header>

      <section style={{
        background: theme.bgSecondary,
        border: `1px solid ${theme.borderDefault}`,
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: theme.accent }}>Economy & Balancing</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <FormLabel>Streak Freeze Cost (✨)</FormLabel>
              <FormInput 
                type="number" 
                value={localSettings.streak_freeze_cost} 
                onChange={(e) => setLocalSettings({ ...localSettings, streak_freeze_cost: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <FormLabel>Unit Multiplier (Difficulty)</FormLabel>
              <FormInput 
                type="number" 
                step="0.1" 
                value={localSettings.unit_multiplier} 
                onChange={(e) => setLocalSettings({ ...localSettings, unit_multiplier: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: theme.accent }}>System Messaging</h3>
          <div>
            <FormLabel>Global System Broadcast</FormLabel>
            <textarea 
              value={localSettings.system_broadcast || ''}
              onChange={(e) => setLocalSettings({ ...localSettings, system_broadcast: e.target.value })}
              placeholder="Enter message for all live users..."
              style={{
                width: '100%', minHeight: '100px', background: '#141416', border: `1px solid ${theme.borderDefault}`,
                borderRadius: '10px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none'
              }}
            />
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: theme.accent }}>Privacy & Anonymity</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <FormLabel>Animal Generation Mode</FormLabel>
              <FormSelect 
                value={localSettings.anonymous_name_generation_mode}
                onChange={(e) => setLocalSettings({ ...localSettings, anonymous_name_generation_mode: e.target.value as any })}
              >
                <option value="random">Pure Random (New per session)</option>
                <option value="sticky">Sticky (Saved per device)</option>
              </FormSelect>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: '24px', borderTop: `1px solid ${theme.borderDefault}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: theme.danger }}>Maintenance Mode</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>Disable all user-initiated sessions and gym access globally.</div>
            </div>
            <button 
              onClick={() => setLocalSettings({ ...localSettings, maintenance_mode: !localSettings.maintenance_mode })}
              style={{ 
                padding: '10px 24px', borderRadius: '10px', background: 'transparent', 
                color: theme.danger, border: `1px solid ${theme.danger}44`, fontWeight: 600, cursor: 'pointer' 
              }}
            >
              {localSettings.maintenance_mode ? 'DEACTIVATE' : 'ACTIVATE'}
            </button>
          </div>
        </div>
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <button 
          onClick={handleSave}
          style={{ 
            padding: '12px 32px', borderRadius: '10px', background: theme.accent, 
            color: theme.textOnAccent, border: 'none', fontWeight: 700, cursor: 'pointer',
            boxShadow: `0 0 20px ${theme.accent}44`
          }}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
