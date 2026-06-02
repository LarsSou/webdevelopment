const global = {
    lijst: document.getElementById('lijst'),
    sortteller: 0,
    count: 0,
};

const setup = () => {
    loadList();
    visitingCount();

    document.getElementById('toevoegen')
        .addEventListener('click', Toevoegen);

    document.getElementById('wissen')
        .addEventListener('click', removeAll);

    document.getElementById('sorteer')
        .addEventListener('click', sorteren);
};

const Toevoegen = () => {

    const Vak = {
        naam: document.getElementById('vak').value,
        tijd: Number(document.getElementById('minuten').value),
        moeilijkheid: document.getElementById('moeilijkheid').value,
        checkbox: document.getElementById('voltooid').checked
    };

    if (!validateInput(Vak)) return;

    const data = getStorage();

    data.push(Vak);

    sessionStorage.setItem('lijst', JSON.stringify(data));

    loadList();
};

const validateInput = (input) => {
    if (input.naam === "" || input.tijd === "" || input.moeilijkheid === "") {
        alert("Please enter a valid input");
        return false;
    }
    return true;
};

const removeVak = (index) => {

    const data = getStorage();

    data.splice(index, 1);

    sessionStorage.setItem('lijst', JSON.stringify(data));

    loadList();
};

const removeAll = () => {
    sessionStorage.removeItem('lijst');
    loadList();
};

const sorteren = () => {

    const data = getStorage();

    data.sort((a, b) => {
        return global.sortteller % 2 === 0
            ? a.tijd - b.tijd
            : b.tijd - a.tijd;
    });

    global.sortteller++;

    sessionStorage.setItem('lijst', JSON.stringify(data));

    loadList();
};

const loadList = () => {

    global.lijst.replaceChildren();

    const data = getStorage();

    data.forEach((item, index) => {

        const vakDiv = document.createElement('div');
        const vakSamenvatting = document.createElement('p');
        const removeDivBtn = document.createElement('button');

        const voltooidString = item.checkbox
            ? "voltooid"
            : "nog niet voltooid";

        vakSamenvatting.textContent =
            `Je hebt aan het vak ${item.naam}, ${item.tijd} minuten gezeten, je vond het ${item.moeilijkheid} van niveau en het is ${voltooidString}.`;

        removeDivBtn.textContent = "Remove";
        removeDivBtn.className = "removeBtn";

        removeDivBtn.addEventListener('click', () => removeVak(index));

        vakDiv.appendChild(vakSamenvatting);
        vakDiv.appendChild(removeDivBtn);

        global.lijst.appendChild(vakDiv);
    });
};

const getStorage = () => {
    return JSON.parse(sessionStorage.getItem('lijst')) || [];
};

const visitingCount = () => {

    global.count = Number(localStorage.getItem('count')) || 0;

    global.count++;

    localStorage.setItem('count', global.count);

    const countlabel = document.getElementById("sessieTeller");

    countlabel.textContent =
        "Studiesessies toegevoegd: " + global.count;
};

// nieuw
window.addEventListener('load', setup);