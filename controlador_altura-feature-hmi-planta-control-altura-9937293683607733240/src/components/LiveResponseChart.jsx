import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { useMqtt } from '../mqtt/MqttProvider';
import { formatTimestamp } from '../utils/formatters';
import { Play, Pause, MoveHorizontal, MoveVertical } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const LiveResponseChart = () => {
  const { telemetryBuffer, isPaused, togglePause } = useMqtt();
  const [adjustmentMode, setAdjustmentMode] = useState('fine');

  const [t1Idx, setT1Idx] = useState(20);
  const [t2Idx, setT2Idx] = useState(80);
  const [a1, setA1] = useState(10);
  const [a2, setA2] = useState(50);

  const data = useMemo(() => ({
    labels: telemetryBuffer.map(d => formatTimestamp(d.receivedAt)),
    datasets: [
      {
        label: 'Distancia (cm)',
        data: telemetryBuffer.map(d => d.d),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true,
        tension: 0.2
      },
      {
        label: 'Setpoint',
        data: telemetryBuffer.map(d => d.sp),
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        tension: 0
      }
    ]
  }), [telemetryBuffer]);

  const getPointAt = (pct) => {
    if (telemetryBuffer.length === 0) return null;
    const idx = Math.max(0, Math.min(telemetryBuffer.length - 1, Math.floor((pct / 100) * (telemetryBuffer.length - 1))));
    return telemetryBuffer[idx];
  };

  const p1 = getPointAt(t1Idx);
  const p2 = getPointAt(t2Idx);
  const deltaTSeconds = p1 && p2 ? Math.abs(p2.receivedAt - p1.receivedAt) / 1000 : 0;
  const deltaA = Math.abs(a2 - a1);

  const annotations = {
    t1: {
      type: 'line',
      xMin: Math.floor((t1Idx / 100) * (telemetryBuffer.length - 1)),
      xMax: Math.floor((t1Idx / 100) * (telemetryBuffer.length - 1)),
      borderColor: '#38bdf8',
      borderWidth: 2,
      label: { display: true, content: 'T1', position: 'start', backgroundColor: '#38bdf8', color: '#000', font: { size: 10, weight: 'bold' } }
    },
    t2: {
      type: 'line',
      xMin: Math.floor((t2Idx / 100) * (telemetryBuffer.length - 1)),
      xMax: Math.floor((t2Idx / 100) * (telemetryBuffer.length - 1)),
      borderColor: '#38bdf8',
      borderWidth: 2,
      label: { display: true, content: 'T2', position: 'start', backgroundColor: '#38bdf8', color: '#000', font: { size: 10, weight: 'bold' } }
    },
    a1: {
      type: 'line',
      yMin: a1,
      yMax: a1,
      borderColor: '#a855f7',
      borderWidth: 2,
      label: { display: true, content: 'A1', position: 'end', backgroundColor: '#a855f7', color: '#fff', font: { size: 10, weight: 'bold' } }
    },
    a2: {
      type: 'line',
      yMin: a2,
      yMax: a2,
      borderColor: '#a855f7',
      borderWidth: 2,
      label: { display: true, content: 'A2', position: 'end', backgroundColor: '#a855f7', color: '#fff', font: { size: 10, weight: 'bold' } }
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      x: { display: true, grid: { color: 'rgba(255, 255, 255, 0.03)' }, ticks: { display: false } },
      y: { min: 0, max: 60, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
    },
    plugins: {
      legend: { display: false },
      annotation: { annotations }
    }
  };

  const timeStep = adjustmentMode === 'coarse' ? 5 : 1;
  const amplitudeStep = adjustmentMode === 'coarse' ? 2 : 0.1;

  return (
    <div className="premium-card chart-container chart-span">
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="card-title">Osciloscopio</div>
          <button onClick={togglePause} className="btn-primary" style={{ padding: '0.4rem 0.6rem' }}>
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.55rem', color: '#38bdf8', fontWeight: '800' }}>ΔT</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>{deltaTSeconds.toFixed(3)}s</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.55rem', color: '#a855f7', fontWeight: '800' }}>ΔA</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '900', color: '#fff' }}>{deltaA.toFixed(1)}cm</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: '250px', padding: '0 0.5rem' }}>
        <Line data={data} options={options} />
      </div>

      <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button onClick={() => setAdjustmentMode('coarse')} className="btn-primary" style={{ flex: 1, background: adjustmentMode === 'coarse' ? 'var(--color-primary)' : 'transparent', color: adjustmentMode === 'coarse' ? '#000' : '#fff', fontSize: '0.6rem' }}> GRUESO </button>
            <button onClick={() => setAdjustmentMode('fine')} className="btn-primary" style={{ flex: 1, background: adjustmentMode === 'fine' ? 'var(--color-primary)' : 'transparent', color: adjustmentMode === 'fine' ? '#000' : '#fff', fontSize: '0.6rem' }}> FINO </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#38bdf8', fontSize: '0.6rem', fontWeight: '800' }}>
              <MoveHorizontal size={12} /> TIEMPO
            </div>
            <input type="range" min="0" max="100" step={timeStep} value={t1Idx} onChange={(e) => setT1Idx(Number(e.target.value))} style={{ accentColor: '#38bdf8' }} />
            <input type="range" min="0" max="100" step={timeStep} value={t2Idx} onChange={(e) => setT2Idx(Number(e.target.value))} style={{ accentColor: '#38bdf8' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#a855f7', fontSize: '0.6rem', fontWeight: '800' }}>
              <MoveVertical size={12} /> AMPLITUD
            </div>
            <input type="range" min="0" max="60" step={amplitudeStep} value={a1} onChange={(e) => setA1(Number(e.target.value))} style={{ accentColor: '#a855f7' }} />
            <input type="range" min="0" max="60" step={amplitudeStep} value={a2} onChange={(e) => setA2(Number(e.target.value))} style={{ accentColor: '#a855f7' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResponseChart;
