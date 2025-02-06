import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";

dotenv.config(); // Lädt Umgebungsvariablen

const app = express();
const PORT = process.env.PORT || 3001;
const PROXY_URL = process.env.PROXY_URL; // Proxy URL (Render)
const API_KEY = process.env.API_KEY; // Clash of Clans API-Key

// 📂 Statische Dateien bereitstellen
app.use(express.static(path.join(process.cwd(), "public")));

// 🏠 Startseite (Frontend)
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// 🏆 Clan-Daten über den Proxy abrufen
app.get("/clan/:tag", async (req, res) => {
    try {
        const clanTag = encodeURIComponent(req.params.tag);
        const url = `${PROXY_URL}/clan/${clanTag}`;

        console.log(`🔍 Anfrage über Proxy: ${url}`);

        const response = await fetch(url, { headers: { "Content-Type": "application/json" } });
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

// 🔥 Direkt auf Clash of Clans API zugreifen
app.get("/player/:tag", async (req, res) => {
    try {
        const playerTag = encodeURIComponent(req.params.tag);
        const url = `https://api.clashofclans.com/v1/players/%23${playerTag}`;

        console.log(`🔍 Anfrage an Clash of Clans API: ${url}`);

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`.trim(),
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

// 🌍 Server starten
app.listen(PORT, () => console.log(`🚀 Railway Server läuft auf Port ${PORT}`));
