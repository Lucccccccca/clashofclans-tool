const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
require("dotenv").config();

// 📌 fetch-Funktion für Node.js importieren
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 📌 Statische Dateien aus "public/" bereitstellen
app.use(express.static(path.join(__dirname, "public")));

// 📌 Startseite ausliefern
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const API_KEY = process.env.COC_API_KEY;

// 📌 SQLite Datenbank für Notizen initialisieren
const db = new sqlite3.Database("./clan_notes.db", (err) => {
    if (err) console.error("❌ Datenbank-Fehler:", err);
    db.run("CREATE TABLE IF NOT EXISTS notes (tag TEXT PRIMARY KEY, note TEXT)");
});

// 📌 Offline-Zeit berechnen
function berechneOfflineZeit(lastSeen) {
    if (!lastSeen) return "Keine Info";
    let now = new Date().getTime();
    let offlineMillis = now - lastSeen;
    let offlineTage = Math.floor(offlineMillis / (1000 * 60 * 60 * 24));

    return offlineTage < 1 ? "Heute online" : `vor ${offlineTage} Tagen`;
}

// 📌 API: Clan-Mitglieder abrufen
app.get("/api/members", async (req, res) => {
    const clanTag = req.query.tag.replace("#", "%23");
    const url = `https://api.clashofclans.com/v1/clans/${clanTag}`;

    try {
        console.log(`📡 Anfrage an Clash of Clans API: ${url}`);

        const response = await fetch(url, {
            headers: { "Authorization": `Bearer ${API_KEY}` }
        });

        const data = await response.json();
        console.log("🔄 API Antwort von Clash of Clans:", data);

        if (!response.ok) {
            return res.status(400).json({ error: `API-Fehler: ${data.reason || "Unbekannter Fehler"}` });
        }

        if (!data.memberList) {
            return res.status(404).json({ error: "Keine Mitglieder gefunden." });
        }

        let members = data.memberList.map(member => ({
            name: member.name,
            tag: member.tag,
            role: member.role,
            trophies: member.trophies,
            offline: berechneOfflineZeit(member.lastSeen),
            note: null
        }));

        // 📌 Notizen aus der Datenbank abrufen
        db.all("SELECT * FROM notes", [], (err, rows) => {
            if (err) {
                console.error("❌ Fehler beim Abrufen der Notizen:", err);
                return res.status(500).json({ error: "Fehler beim Abrufen der Notizen." });
            }

            members.forEach(member => {
                let noteEntry = rows.find(row => row.tag === member.tag);
                if (noteEntry) member.note = noteEntry.note;
            });

            res.json(members);
        });

    } catch (error) {
        console.error("❌ Fehler beim Abrufen der Clan-Daten:", error);
        res.status(500).json({ error: "Interner Server-Fehler." });
    }
});

// 📌 API: Notizen speichern
app.post("/api/saveNote", (req, res) => {
    const { tag, note } = req.body;

    db.run("INSERT INTO notes (tag, note) VALUES (?, ?) ON CONFLICT(tag) DO UPDATE SET note=?", 
        [tag, note, note], (err) => {
        if (err) {
            console.error("❌ Fehler beim Speichern der Notiz:", err);
            return res.status(500).json({ error: "Fehler beim Speichern der Notiz." });
        }
        res.json({ message: "Notiz gespeichert!" });
    });
});

// 📌 Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf http://localhost:${PORT}`));
