const setup = () => {
    gui();
    startSpel();

};

const global = {
    AANTAL_HORIZONTAAL: 4,
    AANTAL_VERTICAAL: 3,
    AANTAL_KAARTEN: 12,

    eersteKaart: null,
    tweedeKaart: null,
    lock: false,

    PATH_PREFIX: "images/kaart",
    PATH_SUFFIX: ".jpg",
    score: 0,

    soundCorrect: new Audio("sounds/soundCorrect.mp3"),
    soundTurn1: new Audio("sounds/soundFirst.mp3"),
    soundError: new Audio("sounds/error.mp3"),
};

const maakKaarten = () => {
    let kaarten = [];

    for (let i = 1; i <= global.AANTAL_KAARTEN / 2; i++) {
        kaarten.push(global.PATH_PREFIX + i.toString() + global.PATH_SUFFIX);
    }

    let dubbel = kaarten.concat(kaarten);
    dubbel.sort(() => Math.random() - 0.5);
    return dubbel;
};

const startSpel = () => {
    let playField = document.getElementById("spelbord");
    playField.innerHTML = "";

    let kaarten = maakKaarten();

    for (let i = 0; i < global.AANTAL_KAARTEN; i++) {
        let kaart = document.createElement("div");
        kaart.classList.add("kaart");

        let img = document.createElement("img");
        img.src = "images/achterkant.jpg";

        kaart.dataset.kaart = kaarten[i];

        kaart.appendChild(img);
        playField.appendChild(kaart);

        kaart.addEventListener("click", kaartDraaien);
    }
};

const kaartDraaien = (event) => {
    if (global.lock) return;

    let kaart = event.currentTarget;
    let img = kaart.querySelector("img");

    if (kaart === global.eersteKaart) return;

    img.src = kaart.dataset.kaart;

    if (!global.eersteKaart) {
        global.soundTurn1.currentTime = 0;
        global.soundTurn1.play();
        global.eersteKaart = kaart;
    } else {
        global.soundTurn1.currentTime = 0;
        global.soundTurn1.play();
        global.tweedeKaart = kaart;
        global.lock = true;
        checkMatch();
    }
};

const checkMatch = () => {
    let kaart1 = global.eersteKaart;
    let kaart2 = global.tweedeKaart;

    if (kaart1.dataset.kaart === kaart2.dataset.kaart) {
        global.soundCorrect.currentTime = 0;
        global.soundCorrect.play();

        setTimeout(() => {
            kaart1.style.visibility = "hidden";
            kaart2.style.visibility = "hidden";

            global.score++;
            document.getElementById("scoreBoard").textContent = "Score: " + global.score;

            resetBeurt();

            if (global.score === global.AANTAL_KAARTEN / 2) {
                setTimeout(() => alert("Gewonnen!"), 100);
                setTimeout(() => location.reload(),  1000);
            }
        }, 1500);
    } else {
        setTimeout(() => {
            global.soundError.currentTime = 0;
            global.soundError.play();
            kaart1.querySelector("img").src = "images/achterkant.jpg";
            kaart2.querySelector("img").src = "images/achterkant.jpg";
            resetBeurt();
        }, 1000);
    }
};

const gui = () => {
    let scoreBoard = document.getElementById("scoreBoard");
    if (!scoreBoard) {
        scoreBoard = document.createElement("p");
        scoreBoard.id = "scoreBoard";
        document.body.insertBefore(scoreBoard, document.getElementById("spelbord"));
    }
    scoreBoard.textContent = "Score: 0";
};

const resetBeurt = () => {
    global.eersteKaart = null;
    global.tweedeKaart = null;
    global.lock = false;
};

window.addEventListener("load", setup);