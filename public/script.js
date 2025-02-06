async function ladeClanMitglieder() {
    const clanTag = document.getElementById("clanTag").value.replace("#", "");
    if (!clanTag) return alert("Bitte Clantag eingeben!");

    const url = `/clan/${clanTag}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert(`Fehler: ${data.error}`);
            return;
        }

        const tbody = document.querySelector("#memberTable tbody");
        tbody.innerHTML = "";

        data.memberList.forEach(member => {
            const row = tbody.insertRow();
            row.insertCell(0).textContent = member.name;
            row.insertCell(1).textContent = member.role;
            row.insertCell(2).textContent = member.trophies;
            row.insertCell(3).textContent = `${member.lastSeen}`;
            row.insertCell(4).innerHTML = `<button onclick="kickMember('${member.tag}')">Kick</button>`;
        });
    } catch (error) {
        alert("Fehler beim Abrufen der Clan-Daten.");
    }
}
