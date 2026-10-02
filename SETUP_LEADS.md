# Lead delivery setup (Telegram + Google Sheet)

Every form submission on fitologist.me is sent to **two** places by the website's `/api/lead` function:

1. **Telegram**: an instant notification on your phone, with a tap-to-chat WhatsApp link.
2. **Google Sheet**: a permanent log, one row per lead.

The visitor is also taken to WhatsApp with their details ready. If neither Telegram nor the Sheet is configured, the form still opens WhatsApp but shows "Almost done" instead of "Request sent". The site never claims a request was received unless one delivery succeeded.

You need three values: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SHEETS_WEBHOOK_URL`. About 15 minutes.

---

## 1. Telegram bot → `TELEGRAM_BOT_TOKEN`

1. In Telegram, open **@BotFather** and send `/newbot`.
2. Choose a name (e.g. *FITologist Leads*) and a username ending in `bot` (e.g. `fitologist_leads_bot`).
3. BotFather replies with a **token** like `123456789:AA…`. That is `TELEGRAM_BOT_TOKEN`. Keep it private.

## 2. Your chat id → `TELEGRAM_CHAT_ID`

1. Open your new bot in Telegram and press **Start** (or send it any message, e.g. "hi").
2. In a browser, open (replace `<TOKEN>` with your token):
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
3. Find `"chat":{"id": 123456789, …}`. That number is `TELEGRAM_CHAT_ID`.
   (If the result is empty, send the bot another message and reload.)

## 3. Google Sheet → `SHEETS_WEBHOOK_URL`

1. Create a new Google Sheet (e.g. *FITologist Leads*).
2. **Extensions → Apps Script**. Delete the sample code.
3. Paste the contents of `website/scripts/sheets-webhook.gs` and press **Save**.
4. **Deploy → New deployment** → gear icon → **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Press **Deploy**, then **Authorize access** and allow it (Google may show "unverified app" → *Advanced* → *Go to …*; it's your own script).
5. Copy the **Web app URL** (ends with `/exec`). That is `SHEETS_WEBHOOK_URL`.

The script creates a **Leads** tab with this header on the first lead:
`timestamp · name · whatsapp · age · goals · type · frequency · area · times · notes · language · source · bmi · utm_source · utm_campaign`

> If you change the script later, use **Deploy → Manage deployments → Edit → New version**, so the URL stays the same.

## 4. Add the three values to Vercel

1. vercel.com → project **fitologist-website** → **Settings → Environment Variables**.
2. Add each one (Environments: **Production** and **Preview**):
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `SHEETS_WEBHOOK_URL`
3. **Redeploy** (Deployments → latest → ⋯ → Redeploy). Environment variables only apply to new deployments.

Never put these values in the code, in `config/site.ts`, or in a message to anyone. `TELEGRAM_API_BASE` stays empty (it exists only for local testing).

## 5. Send a test lead

1. Open the site → **Book a Free Consultation** → fill in the form with your own details → **Send to Saeid via WhatsApp**.
2. Check:
   - WhatsApp opens with the message ready ✓
   - Telegram: a "🔔 New lead" message arrives ✓
   - Google Sheet: a new row appears ✓
   - The page shows **Request sent ✓** ✓
3. Delete the test row from the sheet.

## Troubleshooting

- **Page shows "Almost done"**: neither delivery worked. Check the three variables are set for the environment you're testing (Production vs Preview) and that you redeployed after adding them.
- **Telegram silent, Sheet works**: you haven't pressed **Start** in your bot, or the chat id is wrong.
- **Sheet silent, Telegram works**: the web app access must be **Anyone**; redeploy the script as a new version.
- Vercel → Deployments → Functions → `/api/lead` logs show `[lead] no delivery succeeded` with the reason.
