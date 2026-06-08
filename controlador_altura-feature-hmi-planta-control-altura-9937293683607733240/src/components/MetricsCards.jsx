import React from 'react';
import { useMqtt } from '../mqtt/MqttProvider';
import { formatValue } from '../utils/formatters';
import { Ruler, Target, AlertCircle, Gauge, Signal, Layers } from 'lucide-react';

const MetricsCards = () => {
  const { lastMessage, bufferSize, isConnected } = useMqtt();

  const cards = [
    { label: 'Distancia Real', value: formatValue(lastMessage?.d), unit: 'cm', icon: <Ruler size={20} />, color: 'var(--color-primary)' },
    { label: 'Setpoint', value: formatValue(lastMessage?.sp), unit: 'cm', icon: <Target size={20} />, color: '#fff' },
    { label: 'Error (e)', value: formatValue(lastMessage?.e), unit: 'cm', icon: <AlertCircle size={20} />, color: 'var(--color-error)' },
    { label: 'Potencia (PWM)', value: lastMessage?.pwm ?? '--', unit: '/255', icon: <Gauge size={20} />, color: 'var(--color-info)' },
    { label: 'Buffer Size', value: bufferSize, unit: 'pts', icon: <Layers size={20} />, color: 'var(--color-text-muted)' },
    { label: 'Signal RSSI', value: lastMessage?.rssi ?? '--', unit: 'dBm', icon: <Signal size={20} />, color: 'var(--color-secondary)' },
  ];

  return (
    <div className="dashboard-grid metrics-container">
      {cards.map((card, i) => (
        <div key={i} className="premium-card metric-card-span">
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ color: card.color }}>{card.icon}</div>
                {i === 0 && (
                    <div style={{ fontSize: '0.6rem', color: isConnected ? 'var(--color-secondary)' : 'var(--color-error)', fontWeight: '800' }}>
                        {isConnected ? 'LIVE' : 'OFFLINE'}
                    </div>
                )}
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.2rem' }}>{card.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.04em' }}>{card.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>{card.unit}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsCards;
