import React, { useState, useEffect, useRef } from 'react';
import { useMqtt } from '../mqtt/MqttProvider';
import { Settings2, Send, Sliders } from 'lucide-react';

const ControlPanel = () => {
  const { sendCommand, lastMessage } = useMqtt();

  const [formData, setFormData] = useState({
    sp: '20.0',
    kp: '2.0',
    ki: '0.1',
    kd: '0.5',
    pwm_max: '200',
    mode: 'pid',
    sensor_offset: '0.2',
    sensor_scale: '1.0'
  });

  const editingFields = useRef(new Set());

  useEffect(() => {
    if (lastMessage) {
      setFormData(prev => {
        const next = { ...prev };
        if (!editingFields.current.has('sp')) next.sp = (lastMessage.sp ?? prev.sp).toString();
        if (!editingFields.current.has('kp')) next.kp = (lastMessage.kp ?? prev.kp).toString();
        if (!editingFields.current.has('ki')) next.ki = (lastMessage.ki ?? prev.ki).toString();
        if (!editingFields.current.has('kd')) next.kd = (lastMessage.kd ?? prev.kd).toString();
        if (!editingFields.current.has('mode')) next.mode = lastMessage.mode ?? prev.mode;
        if (!editingFields.current.has('sensor_offset')) next.sensor_offset = (lastMessage.sensor_offset ?? prev.sensor_offset).toString();
        if (!editingFields.current.has('sensor_scale')) next.sensor_scale = (lastMessage.sensor_scale ?? prev.sensor_scale).toString();
        return next;
      });
    }
  }, [lastMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFocus = (name) => editingFields.current.add(name);
  const handleBlur = (name) => editingFields.current.delete(name);

  const handleSubmit = (e) => {
    e.preventDefault();
    const command = {
      sp: parseFloat(formData.sp),
      kp: parseFloat(formData.kp),
      ki: parseFloat(formData.ki),
      kd: parseFloat(formData.kd),
      pwm_max: parseInt(formData.pwm_max) || 255,
      mode: formData.mode,
      sensor_offset: parseFloat(formData.sensor_offset),
      sensor_scale: parseFloat(formData.sensor_scale)
    };
    sendCommand(command);
  };

  const labelStyle = {
    fontSize: '0.6rem',
    color: 'var(--color-text-muted)',
    display: 'block',
    marginBottom: '0.3rem',
    fontWeight: '700'
  };

  return (
    <div className="premium-card control-panel-container control-span">
      <div className="card-header">
        <div className="card-title"><Settings2 size={14} /> Configuración</div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="input-group">
            <label style={labelStyle}>SETPOINT (CM)</label>
            <input
              type="text" name="sp" value={formData.sp} className="form-input"
              onChange={handleChange} onFocus={() => handleFocus('sp')} onBlur={() => handleBlur('sp')}
            />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="input-group">
                <label style={labelStyle}>KP</label>
                <input type="text" name="kp" value={formData.kp} className="form-input" onChange={handleChange} onFocus={() => handleFocus('kp')} onBlur={() => handleBlur('kp')} />
            </div>
            <div className="input-group">
                <label style={labelStyle}>KI</label>
                <input type="text" name="ki" value={formData.ki} className="form-input" onChange={handleChange} onFocus={() => handleFocus('ki')} onBlur={() => handleBlur('ki')} />
            </div>
            <div className="input-group">
                <label style={labelStyle}>KD</label>
                <input type="text" name="kd" value={formData.kd} className="form-input" onChange={handleChange} onFocus={() => handleFocus('kd')} onBlur={() => handleBlur('kd')} />
            </div>
            <div className="input-group">
                <label style={labelStyle}>PWM MAX</label>
                <input type="text" name="pwm_max" value={formData.pwm_max} className="form-input" onChange={handleChange} onFocus={() => handleFocus('pwm_max')} onBlur={() => handleBlur('pwm_max')} />
            </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                <Sliders size={12} color="var(--color-primary)" />
                <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>CALIBRACIÓN</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                    <label style={labelStyle}>OFFSET</label>
                    <input type="text" name="sensor_offset" value={formData.sensor_offset} className="form-input" onChange={handleChange} onFocus={() => handleFocus('sensor_offset')} onBlur={() => handleBlur('sensor_offset')} />
                </div>
                <div className="input-group">
                    <label style={labelStyle}>SCALE</label>
                    <input type="text" name="sensor_scale" value={formData.sensor_scale} className="form-input" onChange={handleChange} onFocus={() => handleFocus('sensor_scale')} onBlur={() => handleBlur('sensor_scale')} />
                </div>
            </div>
        </div>

        <div className="input-group">
            <label style={labelStyle}>MODO</label>
            <select name="mode" value={formData.mode} className="form-input" onChange={handleChange}>
              <option value="pid">PID AUTO</option>
              <option value="manual">MANUAL</option>
              <option value="off">OFF</option>
            </select>
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
            <Send size={14} /> SINCRONIZAR
        </button>
      </form>
    </div>
  );
};

export default ControlPanel;
