import React, { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import mqtt from 'mqtt';
import { SignalProcessor } from '../utils/signalProcessing';

const MqttContext = createContext(null);

export const useMqtt = () => useContext(MqttContext);

const BUFFER_SIZE = 800;

// HARDCODED CONFIGURATION
const CONFIG = {
  WS_URL: 'wss://e9e2bf4261104465a6d6f6733c83e23a.s1.eu.hivemq.cloud:8884/mqtt',
  USER: 'hmi_user',
  PASS: 'Hmi@PID2026',
  TOPIC_BASE: 'pid/planta01'
};

export const MqttProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [telemetryBuffer, setTelemetryBuffer] = useState([]);
  const [msgInterval, setMsgInterval] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const processorRef = useRef(new SignalProcessor(0.4, 3));
  const bufferRef = useRef([]);
  const lastMessageTimeRef = useRef(Date.now());
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const topics = useMemo(() => ({
    data: `${CONFIG.TOPIC_BASE}/data`,
    status: `${CONFIG.TOPIC_BASE}/status`,
    cmd: `${CONFIG.TOPIC_BASE}/cmd`,
  }), []);

  useEffect(() => {
    let mqttClient = null;

    try {
      mqttClient = mqtt.connect(CONFIG.WS_URL, {
        username: CONFIG.USER,
        password: CONFIG.PASS,
        clientId: `hmi_oscillo_${Math.random().toString(16).slice(3)}`,
        reconnectPeriod: 2000,
        connectTimeout: 30 * 1000,
      });

      mqttClient.on('connect', () => {
        setIsConnected(true);
        mqttClient.subscribe([topics.data, topics.status]);
      });

      mqttClient.on('error', () => setIsConnected(false));
      mqttClient.on('offline', () => setIsConnected(false));

      mqttClient.on('message', (topic, message) => {
        if (isPausedRef.current) return;

        try {
          const now = Date.now();
          const payload = JSON.parse(message.toString());

          if (topic === topics.data) {
            setMsgInterval(now - lastMessageTimeRef.current);
            lastMessageTimeRef.current = now;
            setLastMessage(payload);

            const filteredD = processorRef.current.process(payload.d);

            const newDataPoint = {
                ...payload,
                d: filteredD,
                rawD: payload.d,
                receivedAt: now
            };

            bufferRef.current = [...bufferRef.current, newDataPoint].slice(-BUFFER_SIZE);
            setTelemetryBuffer([...bufferRef.current]);
          }
        } catch (e) {
          console.error('MQTT Parse Error:', e);
        }
      });

      setClient(mqttClient);
    } catch (err) {
      console.error('MQTT Connection Error:', err);
    }

    return () => mqttClient?.end();
  }, [topics]);

  const sendCommand = useCallback((cmd) => {
    if (client && isConnected) {
      client.publish(topics.cmd, JSON.stringify(cmd), { qos: 1 });
    }
  }, [client, isConnected, topics.cmd]);

  const togglePause = () => setIsPaused(prev => !prev);

  const value = {
    isConnected,
    lastMessage,
    telemetryBuffer,
    msgInterval,
    sendCommand,
    isPaused,
    togglePause,
    bufferSize: telemetryBuffer.length
  };

  return <MqttContext.Provider value={value}>{children}</MqttContext.Provider>;
};
