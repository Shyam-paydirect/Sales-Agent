export function parseCRMLead(text) {
  if (!text.includes('full_name:')) return null;
  const fields = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([\w_]+):\s*(.+)$/);
    if (m) fields[m[1].trim()] = m[2].trim();
  }
  return fields.full_name ? fields : null;
}
