import { parseCRMLead } from '../helpers/parseCRMLead.js';
import { classifyYesNo } from '../helpers/classifyYesNo.js';
import { log } from '../helpers/log.js';
import { SOLUTIONS_LIST, CALL_SLOT_MSG, NO_RESPONSE_TIMEOUT_MS } from '../constants/messages.js';

// state: 'ASKED_OVERSEAS' | 'SENT_SOLUTIONS' | 'DONE'
const conversations = new Map();

export async function handleMessage(client, msg) {
  const sender = msg.from;
  const text = msg.body.trim();
  const conv = conversations.get(sender);

  // ── Step 1: New CRM lead arrives ───────────────────────────────────────────
  const lead = parseCRMLead(text);
  if (lead) {
    if (conv?.timer) clearTimeout(conv.timer);

    const firstName = lead.full_name.split(' ')[0];

    const greeting =
      `Hi ${firstName}\n\n` +
      `You had shown interest in PayDirect for inward remittances.\n\n` +
      `We help businesses receive international payments by opening global accounts ` +
      `in UK, UAE, USA, Australia etc. at lower FX rates with transparent pricing and ` +
      `real-time rate locking.\n\n` +
      `Are you currently receiving payments from overseas clients?`;

    await msg.reply(greeting);
    log(sender, 'out', greeting);

    // 30-min no-response timeout → send solutions list
    const timer = setTimeout(async () => {
      const current = conversations.get(sender);
      if (current?.state !== 'ASKED_OVERSEAS') return;
      try {
        await client.sendMessage(sender, SOLUTIONS_LIST);
        log(sender, 'out', '[timeout] ' + SOLUTIONS_LIST);
        conversations.set(sender, { ...current, state: 'SENT_SOLUTIONS', timer: null });
      } catch (err) {
        console.error('Timeout send error:', err.message);
      }
    }, NO_RESPONSE_TIMEOUT_MS);

    conversations.set(sender, { state: 'ASKED_OVERSEAS', name: firstName, timer });
    return;
  }

  // ── Step 2: Waiting for yes/no on overseas payments ───────────────────────
  if (conv?.state === 'ASKED_OVERSEAS') {
    if (conv.timer) clearTimeout(conv.timer);

    const intent = await classifyYesNo(text);

    if (intent === 'yes') {
      await msg.reply(SOLUTIONS_LIST);
      log(sender, 'out', SOLUTIONS_LIST);
    } else {
      const noReply =
        `Thank you for the reach out, we would like to understand your requirement in ` +
        `detail. Please let us know how we can help you.\n\n${SOLUTIONS_LIST}`;
      await msg.reply(noReply);
      log(sender, 'out', noReply);
    }

    conversations.set(sender, { ...conv, state: 'SENT_SOLUTIONS', timer: null });
    return;
  }

  // ── Step 3: User replied to solutions list → book a call ──────────────────
  if (conv?.state === 'SENT_SOLUTIONS') {
    await msg.reply(CALL_SLOT_MSG);
    log(sender, 'out', CALL_SLOT_MSG);
    conversations.delete(sender);
    return;
  }

  console.log(`[skip] ${sender}: no active conversation and not a CRM lead (needs a "Full name:" line)`);
}
