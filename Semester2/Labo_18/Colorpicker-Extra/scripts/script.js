const setup = () => {
    let colorDemos = document.getElementsByClassName("colorDemo");
    let sliders = document.getElementsByClassName("slider");
    let btnSave = document.createElement("button");
    let bodyE = document.querySelector("body");

    btnSave.textContent = "Save";
    bodyE.append(btnSave);

    btnSave.addEventListener("click", save);

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("input", update);
    }

    colorDemos[0].style.backgroundColor = "rgb(255, 0, 0)";
};

const update = () => {
    let sliders = document.getElementsByClassName("slider");

    let valueR = sliders[0].value;
    let valueG = sliders[1].value;
    let valueB = sliders[2].value;

    let value = document.getElementsByClassName("value");

    value[0].innerText = valueR;
    value[1].innerText = valueG;
    value[2].innerText = valueB;

    let colorDemos = document.getElementsByClassName("colorDemo");
    colorDemos[0].style.backgroundColor =
        "rgb(" + valueR + "," + valueG + "," + valueB + ")";
};

const save = () => {
    let sliders = document.getElementsByClassName("slider");

    let valueR = sliders[0].value;
    let valueG = sliders[1].value;
    let valueB = sliders[2].value;

    let ColorPreview = document.createElement("div");

    let buttonRemove = document.createElement("button");
    buttonRemove.textContent = "X";
    buttonRemove.style.width = "30px";

    ColorPreview.append(buttonRemove);
    buttonRemove.addEventListener("click", remove);

    ColorPreview.style.width = "100px";
    ColorPreview.style.height = "100px";
    ColorPreview.style.margin = "5px";
    ColorPreview.style.display = "inline-block";
    ColorPreview.style.border = "1px solid black";

    ColorPreview.classList.add("color-preview"); // Correcte manier om class toe te voegen

    ColorPreview.style.backgroundColor = "rgb(" + valueR + "," + valueG + "," + valueB + ")";

    ColorPreview.dataset.r = valueR;
    ColorPreview.dataset.g = valueG;
    ColorPreview.dataset.b = valueB;

    ColorPreview.addEventListener("click", () => {
        let sliders = document.getElementsByClassName("slider");

        sliders[0].value = ColorPreview.dataset.r;
        sliders[1].value = ColorPreview.dataset.g;
        sliders[2].value = ColorPreview.dataset.b;

        update();
    });

    document.body.append(ColorPreview);
};

const remove = (event) => {
    event.stopPropagation();
    event.target.parentElement.remove();
};

window.addEventListener("load", setup);