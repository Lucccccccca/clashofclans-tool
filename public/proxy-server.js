import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Umgebungsvariablen laden

const app = express();
const PORT = process.env.PORT || 10000;
const API_KEY = process.env.API_KEY; // Clash of Clans API Key

app.use(express.json());

// 🏆 Clan-Daten abrufen
app.get("/clan/:tag", async (req, res) => {
    try {
        const clanTag = encodeURIComponent(req.params.tag);
        const url = `https://api.clashofclans.com/v1/clans/%23${clanTag}`;

        console.log(`📡 Anfrage an Clash of Clans API: ${url}`);

        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("❌ Fehler:", error);
        res.status(500).json({ error: "Fehler beim Abrufen der Clan-Daten" });
    }
});

// 🌍 Proxy starten
app.listen(PORT, () => console.log(`🚀 Proxy läuft auf Port ${PORT}`));
