const gemeenten = () => {

    let gemeentenLijst = [];
    let invoer = "";

    while (invoer !== "stop") {

        invoer = window.prompt("Geef een gemeente (typ 'stop' om te stoppen)");

        if (invoer === null) {
            break;
        }

        if (invoer.toLowerCase() !== "stop") {
            gemeentenLijst.push(invoer);
        }
    }

    gemeentenLijst.sort();

    let select = document.getElementById("keuzelijst");

    for (let i = 0; i < gemeentenLijst.length; i++) {
        let option = document.createElement("option");
        option.value = gemeentenLijst[i];
        option.textContent = gemeentenLijst[i];
        select.appendChild(option);
    }
}

window.addEventListener("load", gemeenten);