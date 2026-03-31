
const setup = () => {
    let btnBewaar = document.getElementById("btnBewaar");
    btnBewaar.addEventListener("click", bewaarBewerktePersoon);

    let btnNieuw = document.getElementById("btnNieuw");
    btnNieuw.addEventListener("click", bewerkNieuwePersoon);

    let lstPersonen = document.getElementById("lstPersonen");
    lstPersonen.addEventListener("change", bewerkGeselecteerdePersoon);
};

const global =  {
    LIJST_PERSONEN: [],
    OBJECT_INDEX: 0
}

const bewaarBewerktePersoon = () => {
    if (valideer()) {
        if (global.LIJST_PERSONEN.length <= global.OBJECT_INDEX) {
            global.LIJST_PERSONEN.push({
                voornaam: document.getElementById("txtVoornaam").value,
                familienaam: document.getElementById("txtFamilienaam").value,
                geboortedatum: document.getElementById("txtGeboorteDatum").value,
                email: document.getElementById("txtEmail").value,
                aantalKinderen: document.getElementById("txtAantalKinderen").value

            })
            let ul = document.getElementById('lstPersonen');
            ul.innerHTML += "<option>"+ global.LIJST_PERSONEN[global.OBJECT_INDEX].voornaam + " " +
                global.LIJST_PERSONEN[global.OBJECT_INDEX].familienaam +"</option>";
        }
        else {
            global.LIJST_PERSONEN[global.OBJECT_INDEX].voornaam = document.getElementById("txtVoornaam").value;
            global.LIJST_PERSONEN[global.OBJECT_INDEX].familienaam = document.getElementById("txtFamilienaam").value;
            global.LIJST_PERSONEN[global.OBJECT_INDEX].geboortedatum = document.getElementById("txtGeboorteDatum").value;
            global.LIJST_PERSONEN[global.OBJECT_INDEX].email = document.getElementById("txtEmail").value;
            global.LIJST_PERSONEN[global.OBJECT_INDEX].aantalKinderen = document.getElementById("txtAantalKinderen").value;
            let lstPersonen = document.getElementById("lstPersonen");
            let oldChild = lstPersonen[global.OBJECT_INDEX].childNodes[0];
            lstPersonen[global.OBJECT_INDEX].removeChild(oldChild);
            let newChild = document.createTextNode(global.LIJST_PERSONEN[global.OBJECT_INDEX].voornaam + " " + global.LIJST_PERSONEN[global.OBJECT_INDEX].familienaam);
            lstPersonen[global.OBJECT_INDEX].appendChild(newChild);
        }
    }
};

const bewerkNieuwePersoon = () => {
    clearAllErrors();
    let inputElem = document.querySelectorAll('input[type=text]')
    inputElem.forEach(elem => {
        elem.value = "";
    })
    global.OBJECT_INDEX = global.LIJST_PERSONEN.length;
};

const bewerkGeselecteerdePersoon = () => {
    let lstPersonen = document.getElementById("lstPersonen");
    global.OBJECT_INDEX = lstPersonen.selectedIndex;
    document.getElementById("txtVoornaam").value = global.LIJST_PERSONEN[global.OBJECT_INDEX].voornaam;
    document.getElementById("txtFamilienaam").value = global.LIJST_PERSONEN[global.OBJECT_INDEX].familienaam;
    document.getElementById("txtGeboorteDatum").value = global.LIJST_PERSONEN[global.OBJECT_INDEX].geboortedatum;
    document.getElementById("txtEmail").value = global.LIJST_PERSONEN[global.OBJECT_INDEX].email;
    document.getElementById("txtAantalKinderen").value = global.LIJST_PERSONEN[global.OBJECT_INDEX].aantalKinderen;
}


window.addEventListener("load", setup);
