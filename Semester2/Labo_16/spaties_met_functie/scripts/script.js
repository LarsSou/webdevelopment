const setup = () => {
    let button = document.getElementById("button");
    button.addEventListener("click", toonResultaat);
}

const maakMetSpaties = (inputText) => {
    let result = "";

    inputText = inputText.replaceAll(" ", "");

    for (let i = 0; i < inputText.length; i++) {
        result += inputText.charAt(i) + " ";
    }

    return result.trim();
}

const toonResultaat = () => {
    let tekst = document.getElementById("input").value;
    let resultaat = maakMetSpaties(tekst);

    console.log(resultaat);
}

window.addEventListener("load", setup);