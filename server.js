import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Lädt Umgebungsvariablen aus .env

const app = express();
const PORT = process.env.PORT || 3001;
const PROXY_URL = process.env.PROXY_URL; // Deine Render-Proxy URL
const API_KEY = process.env.API_KEY; // Clash of Clans API Key

// 🏠 Startseite
app.get("/", (req, res) => {
    res.send("🔥 Clash of Clans Tool mit Railway & Render Proxy läuft!");
});

// 🏆 Clan-Daten über den Render-Proxy abrufen
app.get("/clan/:tag", async (req, res) => {
    try {
        const clanTag = encodeURIComponent(req.params.tag);
        const url = `${PROXY_URL}/clan/${clanTag}`;

        console.log(`🔍 Anfrage über Proxy: ${url}`);

        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Fehler von Proxy:", errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ Fehler:", error);
        res.status(500).json({ error: "Server-Fehler", details: error.message });
    }
});

// 🔥 Direkt auf Clash of Clans API zugreifen (z. B. für Spieler-Profile)
app.get("/player/:tag", async (req, res) => {
    try {
        const playerTag = encodeURIComponent(req.params.tag);
        const url = `https://api.clashofclans.com/v1/players/%23${playerTag}`;

        console.log(`🔍 Anfrage an Clash of Clans API: ${url}`);

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`.trim(), // API-Key ohne Leerzeichen
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Fehler von Clash of Clans API:", errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ Fehler:", error);
        res.status(500).json({ error: "Server-Fehler", details: error.message });
    }
});

// 📊 Clan-Kriegsstatistiken (über Proxy)
app.get("/war/:tag", async (req, res) => {
    try {
        const clanTag = encodeURIComponent(req.params.tag);
        const url = `${PROXY_URL}/war/${clanTag}`;

        console.log(`🔍 Anfrage über Proxy: ${url}`);

        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("❌ Fehler von Proxy:", errorData);
            return res.status(response.status).json(errorData);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ Fehler:", error);
        res.status(500).json({ error: "Server-Fehler", details: error.message });
    }
});

// 🌍 Server starten
app.listen(PORT, () => console.log(`🚀 Railway Server läuft auf Port ${PORT}`));
