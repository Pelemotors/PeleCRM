const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp listener ready');
});

client.on('message', async msg => {
    const lower = msg.body.toLowerCase();
    const hasKeywords = lower.includes('מימון') || lower.includes('ת.ז');

    const hasMedia = msg.hasMedia;

    if (hasKeywords || hasMedia) {
        if (hasMedia) {
            const media = await msg.downloadMedia().catch(() => null);
            if (media) {
                const mime = media.mimetype || '';
                if (mime.startsWith('image/') || mime === 'application/pdf') {
                    console.log(`\n[MEDIA] ${msg.from} => ${msg.body}`);
                }
            }
        } else {
            console.log(`\n[MSG] ${msg.from} => ${msg.body}`);
        }
    }
});

client.initialize();
