const express = require('express');
const cors = require('cors');
const { Rcon } = require('rcon-client');

const app = express();
app.use(cors());
app.use(express.json());

// Cooldown ១២ម៉ោង (គិតជា Milliseconds: 12 * 3600 * 1000)
const COOLDOWN_TIME = 12 * 60 * 60 * 1000; 

// Memory Storage សម្រាប់ទប់ស្កាត់តាម IP
const cooldowns = new Map();

const RCON_CONFIG = {
    host: '15.235.151.30',
    port: 62159,
    password: 'CHHIN##$$121314##$$ASCC',
    timeout: 5000
};

// ទាញយក IP ពិតប្រាកដរបស់អ្នកប្រើប្រាស់
const getIP = (req) => {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
};

// API ឆែកម៉ោង Cooldown
app.get('/api/cooldown', (req, res) => {
    const ip = getIP(req);
    const clientKey = req.query.ck || ''; // Client Fingerprint ពី LocalStorage
    
    let expireTime = cooldowns.get(ip) || 0;
    if (clientKey && cooldowns.has(clientKey)) {
        expireTime = Math.max(expireTime, cooldowns.get(clientKey));
    }

    if (expireTime && Date.now() < expireTime) {
        return res.json({ cooldownEnd: expireTime });
    }
    return res.json({ cooldownEnd: null });
});

// API ទទួលការ Vote
app.post('/api/vote', async (req, res) => {
    const ip = getIP(req);
    const { username, gamemode, platform, clientKey } = req.body;

    if (!username || !gamemode || !platform) {
        return res.status(400).json({ error: 'សូមបំពេញព័ត៌មានឱ្យបានគ្រប់គ្រាន់!' });
    }

    // ឆែក Cooldown ម្តងទៀតនៅ Server Side
    let currentExpire = cooldowns.get(ip) || 0;
    if (clientKey && cooldowns.has(clientKey)) {
        currentExpire = Math.max(currentExpire, cooldowns.get(clientKey));
    }

    if (currentExpire && Date.now() < currentExpire) {
        return res.status(403).json({ error: 'អ្នកកំពុងជាប់ម៉ោង Cooldown ១២ម៉ោង!' });
    }

    try {
        // ភ្ជាប់ទៅកាន់ Minecraft Server តាម RCON
        const rcon = await Rcon.connect(RCON_CONFIG);
        const command = `crate key give ${username} vote 1`;
        await rcon.send(command);
        rcon.end();

        // កំណត់ម៉ោង Cooldown ថ្មី
        const newCooldownEnd = Date.now() + COOLDOWN_TIME;
        cooldowns.set(ip, newCooldownEnd);
        if (clientKey) {
            cooldowns.set(clientKey, newCooldownEnd);
        }

        console.log(`[VOTE SUCCESS] User: ${username} | Platform: ${platform} | IP: ${ip}`);
        return res.json({ success: true, cooldownEnd: newCooldownEnd });

    } catch (error) {
        console.error("RCON Error:", error);
        return res.status(500).json({ error: 'មិនអាចតភ្ជាប់ទៅកាន់ Minecraft Server បានទេ!' });
    }
});

module.exports = app;
