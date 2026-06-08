import React from 'react';
import { useMqtt } from '../mqtt/MqttProvider';
import { useTelemetryBuffer } from '../hooks/useTelemetryBuffer';
import { formatTimestamp } from '../utils/formatters';

const TelemetryFeed = () => {
  const { telemetryBuffer, lastMessage } = useMqtt();
  const { latestPoints } = useTelemetryBuffer(telemetryBuffer);

  return (
    <div className="premium-card feed-container feed-span" style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div className="card-title">Monitor de Datos Crudos</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.65rem', fontFamily: 'var(--font-mono)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--color-surface)', color: 'var(--color-text-muted)', zIndex: 10 }}>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>TIME</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>D (CM)</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>SP</th>
              <th style={{ textAlign: 'right', padding: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>PWM</th>
            </tr>
          </thead>
          <tbody>
            {latestPoints.map((p, i) => (
              <tr key={i} style={{
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                color: i === 0 ? 'var(--color-primary)' : 'var(--color-text-dim)',
                background: i === 0 ? 'rgba(245, 158, 11, 0.03)' : 'transparent'
              }}>
                <td style={{ padding: '0.5rem' }}>{formatTimestamp(p.receivedAt)}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem', fontWeight: i === 0 ? '800' : 'normal' }}>{p.d.toFixed(2)}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>{p.sp.toFixed(1)}</td>
                <td style={{ textAlign: 'right', padding: '0.5rem' }}>{p.pwm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '0.5rem', background: '#000', fontSize: '0.6rem' }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: '800' }}>RAW_JSON:</span>
        <div style={{ color: 'var(--color-text-muted)', wordBreak: 'break-all', marginTop: '0.2rem' }}>
          {lastMessage ? JSON.stringify(lastMessage) : 'WAITING...'}
        </div>
      </div>
    </div>
  );
};

export default TelemetryFeed;
