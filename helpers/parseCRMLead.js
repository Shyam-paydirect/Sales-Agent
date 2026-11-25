// Parses lead form messages like:
//   Full name: Sabri
//   Work email: mail@example.com
// Keys are normalized to snake_case ("Full name" -> "full_name").
export function parseCRMLead(text) {
  const fields = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*([^:]+?)\s*:\s*(.+)$/);
    if (!m) continue;
    const key = m[1].toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    if (key) fields[key] = m[2].trim();
  }
  return fields.full_name ? fields : null;
}
