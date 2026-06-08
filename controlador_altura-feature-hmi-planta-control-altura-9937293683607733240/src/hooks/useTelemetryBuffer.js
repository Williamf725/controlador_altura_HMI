import { useMemo } from 'react';

export const useTelemetryBuffer = (buffer) => {
  // Solo nos interesan los puntos recientes para el feed de datos crudos
  const latestPoints = useMemo(() => {
    return buffer.slice(-20).reverse();
  }, [buffer]);

  return {
    latestPoints
  };
};
