# Sales Agent — WhatsApp Sales Bot

An automated WhatsApp sales agent for [PayDirect](https://paydirect.in) that handles inbound CRM leads, qualifies prospects, and books discovery calls — all over WhatsApp using `whatsapp-web.js` and Gemini AI for intent classification.

## How it works

The bot runs a simple 3-step conversation flow per lead:

1. **CRM lead arrives** — A structured message (containing `full_name:` and other fields) is sent to the WhatsApp number. The bot greets the prospect and asks if they currently receive overseas payments.
2. **Qualify intent** — The prospect's reply is classified as `yes` or `no` using Gemini 2.5 Flash. Either path sends the solutions list. If no reply arrives within 30 minutes, the solutions list is sent automatically.
3. **Book a call** — Once the prospect engages with the solutions list, the bot asks them to suggest a time slot for a demo call.

## Project structure

```
index.js                  # Entry point — sets up the WhatsApp client and message listener
handler/handleMessage.js  # Conversation state machine
helpers/
  classifyYesNo.js        # Gemini-powered yes/no intent classifier
  parseCRMLead.js         # Parses structured CRM lead messages
  log.js                  # Console logging helper
constants/messages.js     # All outbound message templates
services/whatsappClient.js # whatsapp-web.js client factory
```

## Setup

### Prerequisites

- Node.js 20+
- A Gemini API key

### Install

```bash
npm install
```

### Environment variables

Create a `.env` file:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Run

```bash
node index.js
```

On first run, a QR code will be printed in the terminal. Scan it with the WhatsApp account you want to use as the bot. The session is persisted in `.wwebjs_auth/` so subsequent runs won't require re-scanning.

## Docker

```bash
docker build -t sales-agent .
docker run --env-file .env -v $(pwd)/.wwebjs_auth:/app/.wwebjs_auth sales-agent
```

The Dockerfile uses `node:20-slim` with Chromium installed (required by `whatsapp-web.js`/Puppeteer).

## CRM lead format

Send a message to the bot's WhatsApp number in the following format to trigger a conversation:

```
full_name: Jane Smith
phone: +91XXXXXXXXXX
company: Acme Exports
```

Any message containing `full_name:` is treated as a new lead. Existing conversation state for that sender is reset.

## Dependencies

| Package | Purpose |
|---|---|
| `whatsapp-web.js` | WhatsApp Web automation |
| `@google/genai` | Gemini AI for yes/no classification |
| `dotenv` | Environment variable loading |
| `qrcode-terminal` | QR code display for WhatsApp auth |
