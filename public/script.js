const API_URL = "https://clashofclans-tool-production.up.railway.app";

function ladeClanMitglieder() {
    const clanTag = document.getElementById("clanTag").value.replace("#", "%23");

    fetch(`${API_URL}/clan/${clanTag}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(`Fehler: ${data.error}`);
            } else {
                console.log("📡 Clan-Daten:", data);
                displayClanData(data);
            }
        })
        .catch((error) => console.error("❌ Fehler:", error));
}

function displayClanData(data) {
    const tbody = document.querySelector("#memberTable tbody");
    tbody.innerHTML = "";

    data.memberList.forEach((member) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.role}</td>
            <td>${member.trophies}</td>
            <td>${member.donationsReceived}</td>
            <td><input type="text" placeholder="Notiz"></td>
            <td><button>Speichern</button></td>
        `;
        tbody.appendChild(row);
    });
}
