export function formatUKDateTime(dateTimeString) {
    if (!dateTimeString) return '';
  
    const date = new Date(dateTimeString);
    if (isNaN(date)) return dateTimeString; // fallback if invalid date
  
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  }
  