const globalHome = {
    start: null,
    stats: null,
    upgrade: null,
    backButton: null,
    homeScreen: null,
    gameScreen: null,
    upgradeScreen: null,
};

const setupHome = () => {
    globalHome.start         = document.getElementById("startButton");
    globalHome.stats         = document.getElementById("statsButton");
    globalHome.upgrade       = document.getElementById("upgradeButton");
    globalHome.backButton    = document.getElementById("backButton");

    globalHome.homeScreen    = document.getElementById("homeScreen");
    globalHome.gameScreen    = document.getElementById("gameScreen");
    globalHome.upgradeScreen = document.getElementById("upgradeScreen");

    globalHome.start.addEventListener("click", startGame);
    globalHome.stats.addEventListener("click", viewStats);
    globalHome.upgrade.addEventListener("click", upgradeStats);
    globalHome.backButton.addEventListener("click", goBack);
};

const startGame = () => {
    globalHome.homeScreen.style.display    = "none";
    globalHome.upgradeScreen.style.display = "none";
    globalHome.gameScreen.style.display    = "block";
    setup();
};

const viewStats = () => {
    alert(messageStats());
};

const upgradeStats = () => {
    globalHome.homeScreen.style.display    = "none";
    globalHome.upgradeScreen.style.display = "block";
    refreshSpans();
};

const goBack = () => {
    globalHome.upgradeScreen.style.display = "none";
    globalHome.homeScreen.style.display    = "block";
};

const messageStats = () => {
    return "Max HP: "         + hero.maxHP          + "\n" +
        "HP: "             + hero.hp              + "\n" +
        "Dmg: "            + hero.baseDmg         + "\n" +
        "Speed: "          + hero.baseSpeed       + "\n" +
        "Coins: "          + global.coinCount     + "\n" +
        "Enemies killed: " + global.enemysKilled;
};

window.addEventListener("load", setupHome);