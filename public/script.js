function ladeClanMitglieder() {
    let clanTag = document.getElementById("clanTag").value.trim();

    if (!clanTag.startsWith("#")) {
        alert("⚠️ Bitte einen gültigen Clantag mit # eingeben!");
        return;
    }

    console.log(`📡 Sende Anfrage an: /api/members?tag=${clanTag}`);

    fetch(`/api/members?tag=${encodeURIComponent(clanTag)}`)
        .then(response => response.json())
        .then(data => {
            console.log("📜 API Antwort:", data);

            if (!Array.isArray(data)) {
                alert("⚠️ Fehler: " + (data.error || "Ungültige API-Antwort"));
                return;
            }

            let tbody = document.querySelector("#memberTable tbody");
            tbody.innerHTML = "";

            data.forEach(member => {
                let row = `<tr>
                    <td>${member.name}</td>
                    <td>${member.role}</td>
                    <td>${member.trophies}</td>
                    <td>${member.offline || "Keine Info"}</td>
                    <td><textarea data-id="${member.tag}">${member.note || ""}</textarea></td>
                    <td><button onclick="speichereNotiz('${member.tag}')">Speichern</button></td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(err => console.error("🚨 API-Fehler:", err));
}

function speichereNotiz(tag) {
    let note = document.querySelector(`textarea[data-id='${tag}']`).value;

    fetch("/api/saveNote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag, note })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(err => console.error("🚨 Fehler beim Speichern der Notiz:", err));
}
