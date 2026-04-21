const STAT_MIN_SPEED = 5;   const STAT_MAX_SPEED = 10;
const STAT_MIN_HP    = 150; const STAT_MAX_HP    = 300;
const STAT_MIN_DMG   = 20;  const STAT_MAX_DMG   = 60;

const globalUpgrade = {};

const setupUpgrade = () => {
    globalUpgrade.speedSpan = document.getElementById("speed-value");
    globalUpgrade.hpSpan    = document.getElementById("hp-value");
    globalUpgrade.dmgSpan   = document.getElementById("dmg-value");

    globalUpgrade.speedUp   = document.getElementById("speed-up");
    globalUpgrade.hpUp      = document.getElementById("hp-up");
    globalUpgrade.dmgUp     = document.getElementById("dmg-up");

    globalUpgrade.speedDown = document.getElementById("speed-down");
    globalUpgrade.hpDown    = document.getElementById("hp-down");
    globalUpgrade.dmgDown   = document.getElementById("dmg-down");

    globalUpgrade.speedUp.addEventListener("click",   () => changeStat("speed", +1));
    globalUpgrade.speedDown.addEventListener("click", () => changeStat("speed", -1));

    globalUpgrade.hpUp.addEventListener("click",     () => changeStat("hp", +10));
    globalUpgrade.hpDown.addEventListener("click",   () => changeStat("hp", -10));

    globalUpgrade.dmgUp.addEventListener("click",    () => changeStat("dmg", +5));
    globalUpgrade.dmgDown.addEventListener("click",  () => changeStat("dmg", -5));
};

const getStatLimits = (stat) => {
    switch (stat) {
        case "speed": return { min: STAT_MIN_SPEED, max: STAT_MAX_SPEED };
        case "hp":    return { min: STAT_MIN_HP,    max: STAT_MAX_HP    };
        case "dmg":   return { min: STAT_MIN_DMG,   max: STAT_MAX_DMG   };
    }
};

const changeStat = (stat, direction) => {
    const heroKey  = stat === "hp" ? "maxHP" : stat;
    const baseKey  = stat === "hp" ? "maxHP" : stat === "dmg" ? "baseDmg" : "baseSpeed";
    const current  = hero[heroKey];
    const newValue = current + direction;
    const { min, max } = getStatLimits(stat);

    if (newValue < min || newValue > max) return;

    if (direction > 0) {
        if (global.coinCount <= 0) return;
        global.coinCount -= 1;
    } else {
        global.coinCount += 1;
    }

    // Update hero waarde én base waarde zodat dood/power-up het niet reset
    hero[heroKey] = newValue;
    hero[baseKey] = newValue;

    if (stat === "hp") hero.hp = Math.min(hero.hp, hero.maxHP);

    refreshSpans();
};

const refreshSpans = () => {
    globalUpgrade.speedSpan.textContent = hero.baseSpeed;
    globalUpgrade.hpSpan.textContent    = hero.maxHP;
    globalUpgrade.dmgSpan.textContent   = hero.baseDmg;
};

window.addEventListener("load", setupUpgrade);