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
    const sortAscBtn = document.getElementById("sortAsc");
    const sortDescBtn = document.getElementById("sortDesc");

    global.historyContainer = document.getElementById("history-container");
    global.inputBar = document.getElementsByTagName("input")[0];
    global.button = document.getElementById("btn");

    global.YOUTUBE_QUERRY = "https://www.youtube.com/results?search_query=";
    global.GOOGLE_QUERRY = "https://www.google.com/search?q=";
    global.INSTAGRAM_QUERRY = "https://www.instagram.com/explore/search/keyword/?q=%2523";
    global.TWITTER_QUERRY = "https://x.com/i/flow/login?redirect_after_login=%252Fhashtag%252F";

    global.button.addEventListener("click", search);

    sortAscBtn.addEventListener("click", () => sortHistory("asc"));
    sortDescBtn.addEventListener("click", () => sortHistory("desc"));

    loadHistory();

    clearbtn.addEventListener("click", clear);
}

const search = () => {
    global.textInputBar = global.inputBar.value;
    global.char = global.textInputBar.substring(0, 3);
    global.zoekOpdracht = global.textInputBar.substring(3);

    if (global.textInputBar === "refresh pagina") {
        location.reload();
        return;
    }

    if (global.char === "/c") {
        clear();
    }
    else if (global.zoekOpdracht === "") {
        window.alert("Ongeldige zoekopdracht ingegeven");
    }

    else if (global.char === "/y ") {
        openAndSave("YouTube", global.YOUTUBE_QUERRY);
    }
    else if (global.char === "/g ") {
        openAndSave("Google", global.GOOGLE_QUERRY);
    }
    else if (global.char === "/i ") {
        openAndSave("Instagram", global.INSTAGRAM_QUERRY);
    }
    else if (global.char === "/t ") {
        openAndSave("Twitter", global.TWITTER_QUERRY);
    }
    else {
        window.alert("Ongeldige Char ingegeven");
    }
}

const openAndSave = (naam, baseUrl) => {
    const url = baseUrl + global.zoekOpdracht;

    window.open(url, "_blank");

    historyAddOn(naam, "zoek", url);

    if (naam === "YouTube") global.latest.className = "y card p-3";
    if (naam === "Google") global.latest.className = "g card p-3";
    if (naam === "Instagram") global.latest.className = "i card p-3";
    if (naam === "Twitter") global.latest.className = "t card p-3";
}

const historyAddOn = (naam, omschrijving, url) => {
    const history = JSON.parse(localStorage.getItem("history") || "[]");

    const datum = new Date().toISOString();

    history.push({
        naam,
        omschrijving,
        url,
        zoekOpdracht: global.zoekOpdracht,
        datum
    });

    localStorage.setItem("history", JSON.stringify(history));

    addhistory({ naam, url, zoekOpdracht: global.zoekOpdracht, datum });
}

const addhistory = (item) => {
    global.latest = document.createElement("div");
    global.latest.classList.add("card", "p-3");
    global.latest.style.height = "175px";
    global.latest.style.width = "250px";

    if (item.naam === "YouTube") global.latest.className = "y card p-3";
    if (item.naam === "Google") global.latest.className = "g card p-3";
    if (item.naam === "Instagram") global.latest.className = "i card p-3";
    if (item.naam === "Twitter") global.latest.className = "t card p-3";

    const naamElement = document.createElement("h5");
    naamElement.textContent = item.naam;

    const omschrijvingElement = document.createElement("p");
    omschrijvingElement.style.color = "white";
    omschrijvingElement.textContent = item.zoekOpdracht;

    const datumElement = document.createElement("p");
    datumElement.classList.add("small");
    datumElement.style.color = "lightgray";
    datumElement.textContent = new Date(item.datum).toLocaleString();

    const btnElement = document.createElement("button");
    btnElement.textContent = "Go!";
    btnElement.classList.add("btn", "btn-sm", "btn-outline-light");

    btnElement.addEventListener("click", () => {
        window.open(item.url, "_blank");

        const history = JSON.parse(localStorage.getItem("history") || "[]");
        const index = history.findIndex(h => h.url === item.url);

        if (index !== -1) {
            history[index].datum = new Date().toISOString();
            localStorage.setItem("history", JSON.stringify(history));

            datumElement.textContent = new Date(history[index].datum).toLocaleString();
        }
    });

    global.latest.append(naamElement,datumElement,omschrijvingElement, btnElement);
    global.historyContainer.append(global.latest);
}

const loadHistory = () => {
    global.historyContainer.innerHTML = "";

    const history = JSON.parse(localStorage.getItem("history") || "[]");

    history.forEach(item => addhistory(item));
}

const sortHistory = (order) => {
    let history = JSON.parse(localStorage.getItem("history") || "[]");

    history.sort((a, b) => {
        const dateA = new Date(a.datum);
        const dateB = new Date(b.datum);

        return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    localStorage.setItem("history", JSON.stringify(history));

    loadHistory();
}

const clear = () => {
    localStorage.clear();
    global.historyContainer.innerHTML = "";
}

window.addEventListener("load", setup);