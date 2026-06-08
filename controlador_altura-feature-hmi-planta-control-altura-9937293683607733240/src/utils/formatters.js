export const formatValue = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return '--';
  return Number(val).toFixed(decimals);
};

export const formatPercent = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '--%';
  return `${Number(val).toFixed(1)}%`;
};

export const formatTimestamp = (ts) => {
  if (!ts) return '--:--:--';
  const date = new Date(ts);
  return date.toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};
