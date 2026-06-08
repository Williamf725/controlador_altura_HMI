/**
 * Filtro de Mediana para eliminar picos de ruido aislados.
 */
export const medianFilter = (data, windowSize = 3) => {
  if (data.length < windowSize) return data[data.length - 1];
  const window = data.slice(-windowSize).sort((a, b) => a - b);
  return window[Math.floor(windowSize / 2)];
};

/**
 * Filtro EWMA (Exponential Weighted Moving Average)
 */
export const ewmaFilter = (current, previous, alpha = 0.4) => {
  if (previous === null || previous === undefined) return current;
  return alpha * current + (1 - alpha) * previous;
};

/**
 * Pipeline de filtrado combinado optimizado para velocidad y limpieza.
 */
export class SignalProcessor {
  constructor(alpha = 0.4, medianWindow = 3) {
    this.alpha = alpha;
    this.medianWindow = medianWindow;
    this.lastValue = null;
    this.buffer = [];
    this.MAX_HEIGHT = 60.0; // Límite físico ajustado a 60cm
  }

  process(value) {
    // FILTRO DE UMBRAL (Solicitado por el usuario)
    // Si el valor supera los 60cm, se descarta por ser ruido de sensor.
    if (value > this.MAX_HEIGHT) {
      return this.lastValue || 0;
    }

    // 1. Buffer para mediana
    this.buffer.push(value);
    if (this.buffer.length > this.medianWindow) {
      this.buffer.shift();
    }

    // 2. Filtro de mediana
    const medianed = medianFilter(this.buffer, this.medianWindow);

    // 3. Filtro EWMA
    const filtered = ewmaFilter(medianed, this.lastValue, this.alpha);
    this.lastValue = filtered;

    return filtered;
  }

  reset() {
    this.lastValue = null;
    this.buffer = [];
  }
}
