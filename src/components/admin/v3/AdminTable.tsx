'use client';

import React, { useMemo } from 'react';
import { getTheme } from '@/themes';
import { useAdminStore } from '@/hooks/useAdminStore';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface AdminTableProps<T> {
  title: string;
  description?: string;
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  onCreateNew?: () => void;
  actions?: (item: T) => React.ReactNode;
}

export const AdminTable = <T extends Record<string, any>>({
  title, description, data, columns, onRowClick, onCreateNew, actions
}: AdminTableProps<T>) => {
  const theme = getTheme('void');
  const { searchQuery } = useAdminStore();

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    
    return data.filter(item => {
      // Check all searchable string fields
      return Object.values(item).some(val => {
        if (typeof val === 'string') return val.toLowerCase().includes(query);
        if (typeof val === 'number') return val.toString().includes(query);
        return false;
      });
    });
  }, [data, searchQuery]);

  return (
    <div style={{
      background: theme.bgSecondary,
      borderRadius: '20px',
      border: `1px solid ${theme.borderDefault}`,
      padding: '32px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      width: '100%',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ 
            fontSize: '24px', fontWeight: 700, color: '#fff', 
            marginBottom: '8px', fontFamily: theme.fontDisplay 
          }}>
            {title}
          </h2>
          {description && (
            <p style={{ fontSize: '14px', color: theme.textSecondary }}>{description}</p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{ 
            padding: '10px 20px', borderRadius: '10px', background: theme.bgTertiary, 
            color: '#fff', border: `1px solid ${theme.borderDefault}`, cursor: 'pointer', fontSize: '13px' 
          }}>Export CSV</button>
          <button
            onClick={onCreateNew}
            style={{
              padding: '10px 20px', borderRadius: '10px', background: theme.accent,
              color: theme.textOnAccent, border: 'none', cursor: onCreateNew ? 'pointer' : 'default',
              fontSize: '13px', fontWeight: 600, opacity: onCreateNew ? 1 : 0.4
            }}
          >+ Create New</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.borderDefault}` }}>
              {columns.map((col, idx) => (
                <th key={idx} style={{ 
                  padding: '16px', fontSize: '11px', textTransform: 'uppercase', 
                  letterSpacing: '1px', color: theme.textMuted, fontWeight: 700,
                  width: col.width, textAlign: col.align || 'left'
                }}>
                  {col.header}
                </th>
              ))}
              {actions && <th style={{ padding: '16px', fontSize: '11px', textTransform: 'uppercase', textAlign: 'right', color: theme.textMuted }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, rowIdx) => (
              <tr 
                key={item.id || item.level_number || rowIdx} 
                onClick={() => onRowClick?.(item)}
                style={{ 
                  borderBottom: `1px solid ${theme.borderDefault}`,
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ 
                    padding: '20px 16px', fontSize: '14px', 
                    color: theme.textSecondary, textAlign: col.align || 'left' 
                  }}>
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: '20px 16px', textAlign: 'right' }}>
                    {actions(item)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const CompactPill = ({ children, color = '#818CF8' }: { children: React.ReactNode, color?: string }) => (
  <span style={{
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 600,
    background: `${color}15`,
    color: color,
    border: `1px solid ${color}33`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'JetBrains Mono, monospace'
  }}>
    {children}
  </span>
);

export const StatusPill = ({ status }: { status: string }) => {
  const theme = getTheme('void');
  let color = theme.textMuted;
  if (status === 'published') color = theme.success;
  if (status === 'in_review') color = theme.warning;
  if (status === 'draft') color = theme.accent;

  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      background: `${color}15`,
      color: color,
      border: `1px solid ${color}33`,
      letterSpacing: '0.5px'
    }}>
      {status.replace('_', ' ')}
    </span>
  );
};
