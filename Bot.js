const { makeWASocket, useMultiFileAuthState, DisconnectReason, makeInMemoryStore } = require('@whiskeysockets/baileys');

const { Boom } = require('@hapi/boom');

const fs = require('fs');

const promoTemplate = (link) => `*🎉 Malle-Vibes? Haben wir! Gute Laune? Garantiert!*

Ob du mit dem *Tretboot nach Mali fährst*,

mit dem Bier in der Hand über den *Playa schlenderst*,

oder einfach nur *laut mitsingen willst* –

*DIESER LINK* bringt dir den *Soundtrack für jeden Abriss!*

💃🕺 *Schmeiß die Box an, dreh auf und lass krachen –*

denn *dein Jam wartet hier*:

🍻 Ob am Tresen, auf’m Tisch oder beim Vortrinken:

*Ballermann-Feeling für Zuhause und unterwegs.*

Feier mit, sing mit, *lass alles stehen und liegen –*

*weil diese Playlist liefert!*

*⚓ „Scheißegal, dann komm' ich nach Malle im Tretboot“*

Wenn das dein Lebensmotto ist: *Link klicken, abgehen!*

👉 *${link}*`;

const endText = `🚨 *Jam vorbei!* 🚨  

Danke fürs Mitfeiern – der Abriss ist erstmal beendet. 🎶🍻  

Bis zum nächsten Mal, wenn es wieder heißt: *Malle-Vibes on Tour!* 🎉`;

async function startBot() {

  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({ auth: state });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async ({ messages }) => {

    const msg = messages[0];

    if (!msg.message || !msg.key.remoteJid) return;

    const from = msg.key.remoteJid;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';

    if (text.startsWith('/start')) {

      const parts = text.split(' ');

      const link = parts[1];

      if (!link) {

        await sock.sendMessage(from, { text: '❗ Bitte gib einen Link an: `/start <link>`' });

        return;

      }

      await sock.sendMessage(from, { text: promoTemplate(link) });

    }

    if (text === '/stop') {

      await sock.sendMessage(from, { text: endText });

    }

  });

  sock.ev.on('connection.update', (update) => {

    const { connection, lastDisconnect } = update;

    if (connection === 'close' && lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {

      startBot();

    }

  });

  console.log('✅ WhatsApp-Bot läuft...');

}

startBot();

