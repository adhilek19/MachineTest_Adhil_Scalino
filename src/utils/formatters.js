/**
 * Format ISO date string into readable format: "Nov 21, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format time string: "14:15:00" -> "02:15 PM"
 */
export function formatTime(timeString) {
  if (!timeString) return '—';
  try {
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      const formattedHours = hours < 10 ? `0${hours}` : hours;
      return `${formattedHours}:${minutes} ${ampm}`;
    }
    return timeString;
  } catch {
    return timeString;
  }
}

/**
 * Format currency amount: 12.5 -> "$12.50"
 */
export function formatPrice(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}
