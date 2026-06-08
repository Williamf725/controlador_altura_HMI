import React from 'react';
import { useMqtt } from '../mqtt/MqttProvider';
import { Settings, Wifi, User, Activity } from 'lucide-react';
import clsx from 'clsx';

const TopNav = () => {
  const { isConnected, msgInterval } = useMqtt();

  return (
    <header className="premium-card" style={{
      borderRadius: '0',
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--color-primary)',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            color: '#000'
          }}>
            <Activity size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.03em', color: 'var(--color-text)' }}>
              Controlador de Altura <span style={{ color: 'var(--color-primary)' }}>Eje Vertical</span>
            </h1>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
              PROYECTO: WILLIAM PINILLA • CARLOS RODRIGUEZ • LUIS PINILLA
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Intervalo ms</div>
          <div style={{ fontSize: '0.9rem', fontWeight: '700', color: msgInterval > 500 ? 'var(--color-error)' : 'var(--color-secondary)' }}>
            {msgInterval}ms
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)',
          background: isConnected ? 'var(--color-secondary-muted)' : 'rgba(244, 63, 94, 0.1)',
          border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          color: isConnected ? 'var(--color-secondary)' : 'var(--color-error)',
          fontSize: '0.75rem', fontWeight: '800'
        }}>
          <Wifi size={14} />
          {isConnected ? 'SISTEMA ONLINE' : 'BROKER OFFLINE'}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
