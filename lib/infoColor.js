export default function infoColor(value) {
  if (value >= 0 && value <= 35) return 'border-red-500 hover:border-red-600';
  if (value >= 36 && value <= 60) return 'border-yellow-500 hover:border-yellow-600';
  if (value >= 61 && value <= 100) return 'border-green-500 hover:border-green-600';
  return 'border-gray-500';
}
