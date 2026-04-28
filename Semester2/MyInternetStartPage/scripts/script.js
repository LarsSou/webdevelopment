const global = {
    historyContainer: null,

    inputBar: null,
    textInputBar: null,
    char: null,
    zoekOpdracht: null,
    button: null,

    YOUTUBE_QUERRY: null,
    GOOGLE_QUERRY: null,
    INSTAGRAM_QUERRY: null,
    TWITTER_QUERRY: null,

    latest: null,
}

const setup = () => {
    const clearbtn = document.getElementById("clearBtn");

    global.historyContainer = document.getElementById("history-container");
    global.inputBar = document.getElementsByTagName("input")[0];
    global.button = document.getElementById("btn");

    global.YOUTUBE_QUERRY = "https://www.youtube.com/results?search_query=";
    global.GOOGLE_QUERRY = "https://www.google.com/search?q=";
    global.INSTAGRAM_QUERRY = "https://www.instagram.com/explore/search/keyword/?q=%2523";
    global.TWITTER_QUERRY = "https://x.com/i/flow/login?redirect_after_login=%252Fhashtag%252F";

    global.button.addEventListener("click", search);

    loadHistory();

    clearbtn.addEventListener("click", clear);
}

const search = () => {
    global.textInputBar = global.inputBar.value;
    global.char = global.textInputBar.substring(0, 3);
    global.zoekOpdracht = global.textInputBar.substring(3, global.textInputBar.length);

    // Check eerst op de speciale refresh opdracht
    if (global.textInputBar === "refresh pagina") {
        location.reload();
        return; // Stop de functie hier
    }

    if (global.zoekOpdracht === "") {
        window.alert("Ongeldige zoekopdracht ingegeven");
    }
    else if (global.char === "/y ") {
        window.open(global.YOUTUBE_QUERRY + global.zoekOpdracht, "_blank");
        historyAddOn("YouTube", "Gezocht op YouTube", global.YOUTUBE_QUERRY + global.zoekOpdracht);
        global.latest.className = "y card p-3";
    }
    else if (global.char === "/g ") {
        window.open(global.GOOGLE_QUERRY + global.zoekOpdracht, "_blank");
        historyAddOn("Google", "Gezocht op Google", global.GOOGLE_QUERRY + global.zoekOpdracht);
        global.latest.className = "g card p-3";
    }
    else if (global.char === "/i ") {
        window.open(global.INSTAGRAM_QUERRY + global.zoekOpdracht, "_blank");
        historyAddOn("Instagram", "Gezocht op Instagram", global.INSTAGRAM_QUERRY + global.zoekOpdracht);
        global.latest.className = "i card p-3";
    }
    else if (global.char === "/t ") {
        window.open(global.TWITTER_QUERRY + global.zoekOpdracht, "_blank");
        historyAddOn("Twitter", "Gezocht op Twitter", global.TWITTER_QUERRY + global.zoekOpdracht);
        global.latest.className = "t card p-3";
    }
    else {
        window.alert("Ongeldige Char ingegeven");
    }
}

const historyAddOn = (naam, omschrijving, url) => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");
    history.push({ naam, omschrijving, url, zoekOpdracht: global.zoekOpdracht });
    localStorage.setItem("history", JSON.stringify(history));

    global.latest = document.createElement("div");
    global.latest.classList.add("card", "p-3");
    global.latest.style.height = "150px";
    global.latest.style.width = "250px";

    const naamElement = document.createElement("h5");
    naamElement.classList.add("card-title");
    naamElement.textContent = naam;

    const omschrijvingElement = document.createElement("p");
    omschrijvingElement.classList.add("card-text", "small");
    omschrijvingElement.style.color = "white";
    omschrijvingElement.textContent = `${global.zoekOpdracht}`;

    const btnElement = document.createElement("button");
    btnElement.classList.add("btn", "btn-sm", "btn-outline-light");
    btnElement.textContent = "Go!";
    btnElement.addEventListener("click", () => window.open(url, "_blank"));

    global.latest.append(naamElement, omschrijvingElement, btnElement);
    global.historyContainer.append(global.latest);
}

const loadHistory = () => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    history.forEach(item => {
        global.zoekOpdracht = item.zoekOpdracht;

        global.latest = document.createElement("div");
        global.latest.classList.add("card", "p-3");
        global.latest.style.height = "150px";
        global.latest.style.width = "250px";

        if (item.naam === "YouTube") global.latest.className = "y card p-3";
        else if (item.naam === "Google") global.latest.className = "g card p-3";
        else if (item.naam === "Instagram") global.latest.className = "i card p-3";
        else if (item.naam === "Twitter") global.latest.className = "t card p-3";

        const naamElement = document.createElement("h5");
        naamElement.classList.add("card-title");
        naamElement.textContent = item.naam;

        const omschrijvingElement = document.createElement("p");
        omschrijvingElement.classList.add("card-text", "small");
        omschrijvingElement.style.color = "white";
        omschrijvingElement.textContent = `${item.zoekOpdracht}`;

        const btnElement = document.createElement("button");
        btnElement.classList.add("btn", "btn-sm", "btn-outline-light");
        btnElement.textContent = "Go!";
        btnElement.addEventListener("click", () => window.open(item.url, "_blank"));

        global.latest.append(naamElement, omschrijvingElement, btnElement);
        global.historyContainer.append(global.latest);
    });
}

const clear = () => {
    localStorage.clear();
    global.historyContainer.innerHTML = "";
}

window.addEventListener("load", setup);