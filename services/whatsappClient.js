import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

export function createClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    authTimeoutMs: 120000,
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] },
  });

  client.on('qr', (qr) => {
    console.log('\nScan QR code (WhatsApp > Settings > Linked Devices > Link a Device):\n');
    qrcode.generate(qr, { small: true });
  });

  client.on('ready', () => {
    console.log('PayDirect Sales Agent is online!');
  });

  client.on('loading_screen', (percent, message) => console.log(`Loading WhatsApp: ${percent}% ${message || ''}`));
  client.on('authenticated', () => console.log('Authenticated, syncing chats...'));
  client.on('change_state', (state) => console.log('State:', state));
  client.on('auth_failure', (msg) => console.error('Auth failed:', msg));
  client.on('disconnected', (reason) => console.log('Disconnected:', reason));

  return client;
}
