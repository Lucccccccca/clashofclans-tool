import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Lädt Umgebungsvariablen

const app = express();
const PORT = process.env.PORT || 3001;
const PROXY_URL = process.env.PROXY_URL; // Render-Proxy URL

// 🏠 Startseite
app.get("/", (req, res) => {
    res.send("🔥 Clash of Clans Tool mit Railway & Render Proxy läuft!");
});

// 🏆 Clan-Daten über den Proxy abrufen
app.get("/clan/:tag", async (req, res) => {
    try {
        const clanTag = encodeURIComponent(req.params.tag);
        const url = `${PROXY_URL}/clan/${clanTag}`;

        console.log(`🔍 Anfrage über Proxy: ${url}`);

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            }
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
