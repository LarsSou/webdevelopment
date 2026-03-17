const setup = () => {
    let btnElement = document.createElement("button");
    let bodyE = document.querySelector("body");

    btnElement.textContent = "Klik mij";
    bodyE.appendChild(btnElement);

    btnElement.addEventListener("click", addP);


}

const addP = () => {
    let element = document.createElement("p");
    let div = document.getElementById("myDIV");

    element.textContent = "dit is wat je wilde";
    div.appendChild(element);
}

window.addEventListener("load", setup);