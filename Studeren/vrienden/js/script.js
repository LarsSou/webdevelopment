const global = {
    user: document.getElementById("User").value,
}

const setup = () => {
    const saveBtn = document.getElementById("submit");

    const randomNumber = Math.floor(Math.random() * document.getElementById("User").getElementsByTagName("option").length);
    document.getElementById("User")[randomNumber].selected = true;
    global.user = document.getElementById("User").value;

    saveBtn.addEventListener("click", createFriend);
    printFriends();
}
const createFriend = () => {
    const vriendkaart = {
        naam: document.getElementById("name").value,
        geboortedatum: document.getElementById("ageDate").value,
        gender: document.getElementById("gender").checked
    }

    const opgeslagen = JSON.parse(localStorage.getItem(global.user));
    const bestaande = Array.isArray(opgeslagen) ? opgeslagen : [];
    bestaande.push(vriendkaart);
    localStorage.setItem(global.user, JSON.stringify(bestaande));

    printFriends();
}

const printFriends = () => {
    const opgeslagen = JSON.parse(localStorage.getItem(global.user));
    const bestaande = Array.isArray(opgeslagen) ? opgeslagen : [];

    const container = document.getElementById("friends");
    container.replaceChildren();

    bestaande.forEach(vriend => {
        const kaart = document.createElement("div");

        const naam = document.createElement("p");
        naam.textContent = `Naam: ${vriend.naam}`;

        const geboortedatum = document.createElement("p");
        geboortedatum.textContent = `Geboortedatum: ${vriend.geboortedatum}`;

        const gender = document.createElement("p");
        gender.textContent = `Gender: ${vriend.gender ? "Man" : "Vrouw"}`;

        const hr = document.createElement("hr");

        kaart.appendChild(naam);
        kaart.appendChild(geboortedatum);
        kaart.appendChild(gender);
        kaart.appendChild(hr);

        container.appendChild(kaart);
    });
}

window.addEventListener("load", setup)