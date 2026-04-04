const buttons = {
    playground: document.body,
    start: document.createElement("button"),
    stats: document.createElement("button"),
}

const setupHome = () => {
    buttons.start.textContent = "Start";
    buttons.start.id = "startBtn";

    buttons.stats.textContent = "Stats";
    buttons.stats.id = "statsBtn";

    buttons.playground.append(buttons.start);
    buttons.playground.append(buttons.stats);
};

const startGame = () => {
    console.log("Starting game...");
    console.log(buttons.start.id);
};
const vieuwStats = () => {

    console.log("Reviewing stats...");
    console.log(buttons.stats.id);

    alert(messageStats())
}
const messageStats = () => {

    if(global.coinCount == null){global.coinCount = 0; console.log("con moet mqf"); }

    return"Max HP:" + hero.maxHP + "\n"+
           "HP: " + hero.hp + "\n" +
           "Dmg: " + hero.dmg + "\n" +
           "Coins amount: " + global.coinCount + "\n" +
           "Enemy's killed: " + global.enemysKilled;
}
window.addEventListener("load", setupHome);

buttons.start.addEventListener("click", startGame);
buttons.stats.addEventListener("click", vieuwStats);
