const setup = () => {
    let colorDemos = document.getElementsByClassName("colorDemo");
    let sliders = document.getElementsByClassName("slider");
    let btnSave = document.createElement("button");
    let pClear = document.getElementById("pClear");
    let clear = document.getElementById('clearButton');
    clear.addEventListener('click', clearBtn);
    btnSave.textContent = "Save";
    pClear.prepend(btnSave)
    btnSave.addEventListener("click", save);

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener("input", update);
    }

    let rgb = JSON.parse(localStorage.getItem("currentRGB"));
    if (rgb) {
        sliders[0].value = rgb.R;
        sliders[1].value = rgb.G;
        sliders[2].value = rgb.B;
        update();
    } else {
        colorDemos[0].style.backgroundColor = "rgb(255, 0, 0)";
    }

    let colors = JSON.parse(localStorage.getItem("colors")) || [];
    colors.forEach(color => createPreview(color.R, color.G, color.B));
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

    localStorage.setItem("currentRGB", JSON.stringify({ R: valueR, G: valueG, B: valueB }));
};

const save = () => {
    let sliders = document.getElementsByClassName("slider");

    let valueR = sliders[0].value;
    let valueG = sliders[1].value;
    let valueB = sliders[2].value;

    let colors = JSON.parse(localStorage.getItem("colors")) || [];
    colors.push({ R: valueR, G: valueG, B: valueB });
    localStorage.setItem("colors", JSON.stringify(colors));

    createPreview(valueR, valueG, valueB);
};

const createPreview = (valueR, valueG, valueB) => {
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
    ColorPreview.classList.add("color-preview");
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
    let preview = event.target.parentElement;

    let colors = JSON.parse(localStorage.getItem("colors")) || [];

    let index = colors.findIndex(color => color.R === preview.dataset.r && color.G === preview.dataset.g && color.B === preview.dataset.b);
    if (index !== -1) colors.splice(index, 1);

    localStorage.setItem("colors", JSON.stringify(colors));

    preview.remove();
};
const clearBtn = () => {
    localStorage.clear();

    // Verwijder alle opgeslagen kleur-previews uit de DOM
    document.querySelectorAll(".color-preview").forEach(el => el.remove());

    // Reset de sliders naar 0
    let sliders = document.getElementsByClassName("slider");
    sliders[0].value = 255;
    sliders[1].value = 0;
    sliders[2].value = 0;

    // Update de weergave
    update();
};

window.addEventListener("load", setup);