const globalHome = {
    start: null,
    stats: null,
    gameScreen: null,
}

window.addEventListener("load", () => {
    globalHome.start      = document.getElementById("startButton");
    globalHome.stats      = document.getElementById("statsButton");
    globalHome.gameScreen = document.getElementById("gameScreen");

    globalHome.start.addEventListener("click", startGame);
    globalHome.stats.addEventListener("click", vieuwStats);
});

const startGame = () => {
    document.getElementById("homeScreen").style.display = "none";
    globalHome.gameScreen.style.display = "block";
    setup(); // komt uit gameScript.js
};

const vieuwStats = () => {
    alert(messageStats());
};

const messageStats = () => {
    return "Max HP: "         + hero.maxHP          + "\n" +
        "HP: "             + hero.hp              + "\n" +
        "Dmg: "            + hero.dmg             + "\n" +
        "Coins: "          + global.coinCount     + "\n" +
        "Enemies killed: " + global.enemysKilled;
};