'use client';

import React from 'react';
import { getTheme } from '@/themes';

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  onDelete?: () => void;
}

export const EditDrawer = ({ 
  isOpen, onClose, title, description, children, onSave, onDelete 
}: EditDrawerProps) => {
  const theme = getTheme('void');

  return (
    <>
      {/* Overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 1000
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '500px',
        maxWidth: '100%',
        background: '#0C0C0E',
        borderLeft: `1px solid ${theme.borderDefault}`,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1001,
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '32px',
          borderBottom: `1px solid ${theme.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ 
              fontSize: '20px', fontWeight: 700, color: '#fff', 
              marginBottom: '4px', fontFamily: theme.fontDisplay 
            }}>
              {title}
            </h3>
            {description && (
              <p style={{ fontSize: '13px', color: theme.textSecondary }}>{description}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              color: theme.textMuted,
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {children}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px 32px',
          borderTop: `1px solid ${theme.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          gap: '16px',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {onDelete && (
              <button 
                onClick={onDelete}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: theme.danger,
                  border: `1px solid ${theme.danger}44`,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={onClose}
              style={{
                padding: '12px 24px',
                borderRadius: '10px',
                background: theme.bgTertiary,
                color: theme.textSecondary,
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            {onSave && (
              <button 
                onClick={onSave}
                style={{
                  padding: '12px 32px',
                  borderRadius: '10px',
                  background: theme.accent,
                  color: theme.textOnAccent,
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: `0 0 20px ${theme.accent}44`
                }}
              >
                Save Draft
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const FormLabel = ({ children }: { children: React.ReactNode }) => {
  const theme = getTheme('void');
  return (
    <label style={{
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      color: theme.textMuted,
      fontWeight: 700,
      marginBottom: '8px',
      display: 'block'
    }}>
      {children}
    </label>
  );
};

export const FormInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  const theme = getTheme('void');
  return (
    <input 
      {...props}
      style={{
        width: '100%',
        background: '#141416',
        border: `1px solid ${theme.borderDefault}`,
        borderRadius: '10px',
        padding: '12px 16px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s ease',
        ...props.style
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = theme.accent)}
      onBlur={(e) => (e.currentTarget.style.borderColor = theme.borderDefault)}
    />
  );
};

export const FormSelect = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => {
  const theme = getTheme('void');
  return (
    <select 
      {...props}
      style={{
        width: '100%',
        background: '#141416',
        border: `1px solid ${theme.borderDefault}`,
        borderRadius: '10px',
        padding: '12px 16px',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
        appearance: 'none',
        ...props.style
      }}
    >
      {props.children}
    </select>
  );
};

export interface MultiSelectOption {
  value: string;
  label: string;
}

export const FormMultiSelect = ({ 
  options, selectedValues, onChange 
}: { 
  options: MultiSelectOption[], 
  selectedValues: string[], 
  onChange: (values: string[]) => void 
}) => {
  const theme = getTheme('void');

  const toggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter(v => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '12px',
      background: '#141416',
      border: `1px solid ${theme.borderDefault}`,
      borderRadius: '10px',
      minHeight: '48px'
    }}>
      {options.map(opt => {
        const isSelected = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => toggleOption(opt.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: isSelected ? `${theme.accent}33` : 'transparent',
              color: isSelected ? theme.accent : theme.textSecondary,
              border: `1px solid ${isSelected ? theme.accent : theme.borderDefault}`
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
