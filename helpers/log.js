export function log(sender, direction, text) {
  const t = new Date().toLocaleTimeString();
  const arrow = direction === 'in' ? '←' : '→';
  console.log(`[${t}] ${arrow} ${sender}: ${text.slice(0, 80)}`);
}
