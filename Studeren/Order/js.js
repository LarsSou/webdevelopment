const global = {
    functionSlct: document.getElementById("Function"),
    orders: document.getElementById("Opgenomen-Bestellingen").children,
};

const setup = () => {
    const startBtn = document.getElementById("startBtn");
    const suppBox = document.getElementById("Supplement");
    const clearOrderBtn = document.getElementById("ClearOrderBtn");

    global.functionSlct.addEventListener("change", checkFunction);
    suppBox.addEventListener("change", checkSupplement);
    startBtn.addEventListener("click", start);
    clearOrderBtn.addEventListener("click", clearOrder);

    const opgeslagen = JSON.parse(localStorage.getItem("orders") || "[]");
    opgeslagen.forEach(renderOrder);
};

const checkFunction = () => {
    if (global.functionSlct.value === "Chef") {
        document.getElementById("bestellingen").style.display = "none";
        document.getElementById("ClearOrderBtn").style.display = "none";
        document.getElementById("startBtn").style.display = "none";
        document.getElementById("Opgenomen-Bestellingen").style.display = "block";

        LoadOrders();
        return "chef";
    } else {
        document.getElementById("bestellingen").style.display = "block";
        document.getElementById("ClearOrderBtn").style.display = "block";
        document.getElementById("startBtn").style.display = "block";
        document.getElementById("Opgenomen-Bestellingen").style.display = "block";

        return "waiter";
    }
};


const checkInput = () => {
    const selects = document.getElementsByTagName("select");
    for (let i = 0; i < selects.length; i++) {
        if (selects[i].value === "") {
            alert("Please enter a valid input");
            return false;
        }
    }
};

const checkSupplement = () => {
    const SupplementInput = document.getElementById("Supplement");

    if (SupplementInput.checked) {
        if (document.getElementById("SupplementenKeuze")) return;

        const SupplementenKeuze = document.createElement("select");
        SupplementenKeuze.id = "SupplementenKeuze";

        let keuze1 = document.createElement("option");
        let keuze2 = document.createElement("option");
        keuze1.value = "Frietjes";
        keuze2.value = "Kroketjes";
        keuze1.textContent = keuze1.value;
        keuze2.textContent = keuze2.value;
        keuze1.className = "SuppKeuzes";
        keuze2.className = "SuppKeuzes";

        SupplementenKeuze.appendChild(keuze1);
        SupplementenKeuze.appendChild(keuze2);
        document.getElementById("bestellingen").appendChild(SupplementenKeuze);
    } else {
        document.getElementById("SupplementenKeuze")?.remove();
    }
};

const renderOrder = (order) => {
    const GeplaatsteBestellingen = document.getElementById("Opgenomen-Bestellingen");

    const gerecht = document.createElement("p");
    const supplement = document.createElement("p");
    const wachtTijd = document.createElement("p");

    gerecht.textContent = `Gerecht: ${order.Gerecht}`;
    supplement.textContent = `Supplement: ${order.Supplement ?? "Geen"}`;
    wachtTijd.textContent = `Wachttijd: ${order.wachtTijd}`;

    const Order = document.createElement("div");
    Order.className = "OrderDiv";
    Order.appendChild(gerecht);
    Order.appendChild(supplement);
    Order.appendChild(wachtTijd);
    GeplaatsteBestellingen.appendChild(Order);
    GeplaatsteBestellingen.appendChild(document.createElement("hr"));
};

const MakeOrders = () => {

    const order = {
        Gerecht: document.getElementById("OrderInput").value,
        Supplement: document.getElementById("SupplementenKeuze")?.value ?? null,
        wachtTijd: document.getElementById("timeInput").value,
    };

    // Geen lege bestelling toelaten
    if (order.Gerecht.trim() === "") return;

    // Orders ophalen uit localStorage
    const opgeslagen = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    // Nieuwe order toevoegen
    opgeslagen.push(order);

    // Terug opslaan
    localStorage.setItem(
        "orders",
        JSON.stringify(opgeslagen)
    );

    // Meteen tonen
    renderOrder(order);

    // Inputs leegmaken (optioneel)
    document.getElementById("OrderInput").value = "";

    const supplement = document.getElementById("SupplementenKeuze");
    if (supplement) {
        supplement.value = "";
    }

    document.getElementById("timeInput").value = "";
};


const LoadOrders = () => {

    // Container leegmaken
    const container = document.getElementById(
        "OrdersContainer"
    );

    container.innerHTML = "";

    // Orders uit localStorage halen
    const opgeslagen = JSON.parse(
        localStorage.getItem("orders") || "[]"
    );

    // Alles opnieuw tonen
    opgeslagen.forEach(order => {
        renderOrder(order);
    });
};

const clearInputs = () => {
    document.getElementById("OrderInput").children[0].selected = true;
    document.getElementById("Supplement").checked = false;
    document.getElementById("timeInput").value = "";
    checkSupplement();
};

const clearOrder = () => {
    document.getElementById("Opgenomen-Bestellingen").innerHTML = "";
    localStorage.removeItem("orders");
};

const start = () => {
    if (global.functionSlct.value === "Waiter") {
        checkInput();
        MakeOrders();
        clearInputs();
    }
};

window.addEventListener("load", setup);