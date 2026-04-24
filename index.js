import dotenv from 'dotenv';
import { createClient } from './services/whatsappClient.js';
import { handleMessage } from './handler/handleMessage.js';
import { log } from './helpers/log.js';

dotenv.config();

const client = createClient();

client.on('message', async (msg) => {
  if (msg.fromMe) return;
  if (msg.type !== 'chat') return;

  log(msg.from, 'in', msg.body);

  try {
    await handleMessage(client, msg);
  } catch (err) {
    console.error('Handler error:', err.message);
  }
});

client.initialize();
