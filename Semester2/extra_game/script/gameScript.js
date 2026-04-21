// ─── Audio ────────────────────────────────────────────────────────────────
const sound = new Audio("sounds/GrassWalking.mp3");
sound.loop = true;

const startMusic = () => {
    sound.play().catch(() => {
        const unlock = () => {
            sound.play();
            window.removeEventListener('click', unlock);
            window.removeEventListener('keydown', unlock);
        };
        window.addEventListener('click', unlock);
        window.addEventListener('keydown', unlock);
    });
};

// ─── Enemy types ──────────────────────────────────────────────────────────
const ENEMY_TYPES = {
    grunt: {
        label: 'Grunt',
        maxHP: 60, dmg: 15, speed: 1.2, width: 100,
        baseFilter: '',
        hitboxOffsetX: -15, hitboxWidth: 120, hitboxHeight: 100,
        knockbackResist: 1,
    },
    rusher: {
        label: 'Rusher',
        maxHP: 35, dmg: 8, speed: 2.8, width: 80,
        baseFilter: 'hue-rotate(100deg) saturate(2)',
        hitboxOffsetX: -10, hitboxWidth: 100, hitboxHeight: 90,
        knockbackResist: 0.7,
    },
    tank: {
        label: 'Tank',
        maxHP: 280, dmg: 35, speed: 0.5, width: 150,
        baseFilter: 'hue-rotate(220deg) saturate(1.5) brightness(0.8)',
        hitboxOffsetX: -20, hitboxWidth: 160, hitboxHeight: 115,
        knockbackResist: 3.5,
    },
    jumper: {
        label: 'Jumper',
        maxHP: 45, dmg: 10, speed: 1.5, width: 85,
        baseFilter: 'hue-rotate(280deg) saturate(2) brightness(1.1)',
        hitboxOffsetX: -12, hitboxWidth: 110, hitboxHeight: 125,
        knockbackResist: 0.8,
    },
};

// ─── State ────────────────────────────────────────────────────────────────
const global = {
    ground: null,
    SPRITE_CONTAINER_OFFSET: 200,
    tileWidth: 500,
    speed: 2,
    baseSpeed: 2,
    offset: 0,
    worldOffset: 0,
    movingRight: false,
    movingLeft: false,
    movingDown: false,
    goldenBall: null,
    goldenBallVisible: false,
    goldenBallWorldX: 0,
    coins: [],
    coinCount: 0,
    coinLabel: null,
    debugHitboxes: false,
    debugHeroBox: null,
    enemysKilled: 0,
};

let enemies     = [];
let spawnTimer  = 0;
let gameRunning = false;

const hero = {
    el: null,
    x: 0, y: 0,
    velocityY: 0,
    gravity: 0.8,
    direction: 'right',
    isJumping: false,
    isSwinging: false,
    sliding: false,
    slidingCooldown: false,
    isDead: false,
    hp: 150, maxHP: 150,
    dmg: 20, baseDmg: 20,
    hitCooldown: false,
    jumpForce: -15, baseJumpForce: -15,
    speed: 5, baseSpeed: 5,
    powerUpActive: false,
    powerUpTimer: null,
    leftBound: 200,
    rightBound: 0,
    hitboxOffsetX: 180,
    hitboxWidth: 150,
    src: {
        rest:     'images/hero_rust.png',
        restLeft: 'images/hero_rust.png',
        punch:    'images/hero_punch.png',
        run:      'images/hero_rust.png',
        runLeft:  'images/hero_rust.png',
    },
    hpBar: null, hpFill: null, hpLabel: null,
};

// ─── Setup ────────────────────────────────────────────────────────────────
const setup = () => {
    gameRunning        = true;
    global.ground      = document.querySelector('.ground');
    hero.el            = document.querySelector('.hero');
    hero.x             = window.innerWidth / 3;
    hero.rightBound    = window.innerWidth - hero.leftBound - hero.x;

    startMusic();
    hero.el.style.cssText = 'position:absolute; width:100px; bottom:0px;';

    global.goldenBall = createElement('goldenBall');
    setupHeroHPBar();
    setupDebugBoxes();
    setupInGameBackButton();

    spawnGoldenBall();
    trySpawnEnemy();

    window.addEventListener('click', punch);
    gameLoop();
};

// ─── Stop & cleanup ───────────────────────────────────────────────────────
const stopGame = () => {
    gameRunning = false;
    sound.pause();
    sound.currentTime = 0;
    window.removeEventListener('click', punch);

    [...enemies].forEach(e => removeEnemy(e));
    enemies = [];

    global.coins.forEach(c => c.remove());
    global.coins = [];

    if (global.goldenBall) {
        global.goldenBall.style.display = 'none';
        global.goldenBallVisible = false;
    }

    if (hero.hpBar)   { hero.hpBar.remove();   hero.hpBar   = null; }
    if (hero.hpLabel) { hero.hpLabel.remove();  hero.hpLabel = null; }
    hero.hpFill = null;

    if (global.coinLabel) { global.coinLabel.remove(); global.coinLabel = null; }
    if (global.debugHeroBox) { global.debugHeroBox.remove(); global.debugHeroBox = null; }

    const bb = document.getElementById('inGameBackButton');
    if (bb) bb.remove();

    // Reset tijdelijke state, behoud geüpgradede stats
    if (hero.powerUpTimer) { clearTimeout(hero.powerUpTimer); hero.powerUpTimer = null; }
    hero.powerUpActive   = false;
    hero.speed           = hero.baseSpeed;
    hero.jumpForce       = hero.baseJumpForce;
    hero.dmg             = hero.baseDmg;
    hero.hp              = hero.maxHP;
    hero.isDead          = false;
    hero.isJumping       = false;
    hero.isSwinging      = false;
    hero.sliding         = false;
    hero.slidingCooldown = false;
    hero.hitCooldown     = false;
    hero.velocityY       = 0;

    global.movingLeft    = false;
    global.movingRight   = false;
    global.movingDown    = false;
    global.worldOffset   = 0;
    global.offset        = 0;
    spawnTimer           = 0;

    if (hero.el) {
        hero.el.style.filter    = '';
        hero.el.style.transform = 'scaleX(1)';
        hero.el.style.opacity   = '1';
    }
};

// ─── In-game back button ──────────────────────────────────────────────────
const setupInGameBackButton = () => {
    const btn = document.createElement('button');
    btn.id = 'inGameBackButton';
    btn.textContent = '⬅ Menu';
    btn.style.cssText = `
        position:fixed; top:14px; left:50%; transform:translateX(-50%);
        padding:6px 18px; background:rgba(0,0,0,0.6); color:white;
        border:2px solid #fff; border-radius:8px; font-size:14px;
        font-family:sans-serif; cursor:pointer; z-index:2000;
        transition:background 0.2s;
    `;
    btn.addEventListener('mouseenter', () => btn.style.background = 'rgba(255,255,255,0.2)');
    btn.addEventListener('mouseleave', () => btn.style.background = 'rgba(0,0,0,0.6)');
    btn.addEventListener('click', returnToHome);
    document.body.appendChild(btn);
};

const returnToHome = () => {
    stopGame();
    globalHome.gameScreen.style.display    = 'none';
    globalHome.homeScreen.style.display    = 'block';
    globalHome.upgradeScreen.style.display = 'none';
};

// ─── Element helpers ──────────────────────────────────────────────────────
const createElement = (id, isImage = false) => {
    const el = document.createElement(isImage ? 'img' : 'div');
    el.id = id;
    document.body.appendChild(el);
    return el;
};

const setupHeroHPBar = () => {
    hero.hpBar = document.createElement('div');
    hero.hpBar.style.cssText = `
        position:fixed; top:40px; left:20px;
        width:200px; height:18px;
        background:#333; border:2px solid #000;
        border-radius:6px; overflow:hidden; z-index:1000;
    `;
    hero.hpFill = document.createElement('div');
    hero.hpFill.style.cssText = `height:100%; width:100%; background:#2ecc71; border-radius:4px; transition:width 0.15s, background 0.3s;`;
    hero.hpLabel = document.createElement('div');
    hero.hpLabel.textContent = `HP: ${hero.hp}`;
    hero.hpLabel.style.cssText = `
        position:fixed; top:42px; left:228px;
        color:white; font-family:sans-serif; font-size:13px;
        font-weight:bold; text-shadow:0 0 4px #000; z-index:1000;
    `;
    hero.hpBar.appendChild(hero.hpFill);
    document.body.appendChild(hero.hpBar);
    document.body.appendChild(hero.hpLabel);
};

const setupDebugBoxes = () => {
    global.debugHeroBox = document.createElement('div');
    global.debugHeroBox.style.cssText = `position:absolute; border:2px solid red; pointer-events:none; z-index:999; display:none;`;
    document.body.appendChild(global.debugHeroBox);
};

// ─── Enemy factory ────────────────────────────────────────────────────────
const createEnemyObject = (type) => {
    const def = ENEMY_TYPES[type];

    const el = document.createElement('img');
    el.src = 'images/hero_rust.png';
    el.style.cssText = `position:absolute; width:${def.width}px; margin-bottom:100px; display:none; transition:opacity 0.4s; filter:${def.baseFilter};`;
    document.body.appendChild(el);

    const hpBar  = document.createElement('div');
    hpBar.style.cssText = `position:absolute; width:${def.width}px; height:8px; background:#333; border:1px solid #000; border-radius:4px; display:none; overflow:hidden;`;
    const hpFill = document.createElement('div');
    hpFill.style.cssText = `height:100%; width:100%; background:#e74c3c; border-radius:3px; transition:width 0.1s;`;
    hpBar.appendChild(hpFill);
    document.body.appendChild(hpBar);

    const nameLabel = document.createElement('div');
    nameLabel.textContent = def.label;
    nameLabel.style.cssText = `position:absolute; font-family:sans-serif; font-size:11px; font-weight:bold; color:white; text-shadow:0 0 3px #000; display:none; text-align:center; width:${def.width}px; pointer-events:none;`;
    document.body.appendChild(nameLabel);

    const debugBox = document.createElement('div');
    debugBox.style.cssText = `position:absolute; border:2px solid lime; pointer-events:none; z-index:999; display:none;`;
    document.body.appendChild(debugBox);

    return {
        type,
        hp: def.maxHP, maxHP: def.maxHP,
        dmg: def.dmg, speed: def.speed, width: def.width,
        baseFilter: def.baseFilter,
        hitboxOffsetX: def.hitboxOffsetX,
        hitboxWidth:   def.hitboxWidth,
        hitboxHeight:  def.hitboxHeight,
        knockbackResist: def.knockbackResist,
        worldX: 0, visible: false,
        el, hpBar, hpFill, nameLabel, debugBox,
        state: 'patrol',
        velocityX: 0, knockback: 0,
        isSwinging: false, hitThisSwing: false,
        isJumping: false, jumpY: 0, jumpVY: 0, jumpCooldown: false,
        patrolDir:   Math.random() < 0.5 ? 1 : -1,
        patrolTimer: Math.floor(Math.random() * 80),
        chargeTimer: 0, isCharging: false, chargeCooldown: false, chargeDir: 1,
        jumpTimer: Math.floor(Math.random() * 60),
    };
};

// ─── Spawn systeem ────────────────────────────────────────────────────────
const getMaxEnemies = () => {
    const k = global.enemysKilled;
    if (k < 5)  return 1;
    if (k < 12) return 2;
    if (k < 25) return 3;
    return 4;
};

const getSpawnPool = () => {
    const k = global.enemysKilled;
    if (k < 5)  return ['grunt', 'grunt', 'grunt'];
    if (k < 10) return ['grunt', 'grunt', 'rusher'];
    if (k < 18) return ['grunt', 'rusher', 'jumper'];
    if (k < 28) return ['grunt', 'rusher', 'jumper', 'tank'];
    return ['rusher', 'jumper', 'tank', 'tank'];
};

const trySpawnEnemy = () => {
    if (!gameRunning) return;
    const active = enemies.filter(e => e.visible).length;
    if (active >= getMaxEnemies()) return;
    const pool = getSpawnPool();
    const type = pool[Math.floor(Math.random() * pool.length)];
    spawnSingleEnemy(type);
};

const spawnSingleEnemy = (type) => {
    const e = createEnemyObject(type);
    const fromRight = Math.random() > 0.35;
    e.worldX = fromRight
        ? global.worldOffset + window.innerWidth + 250 + Math.random() * 700
        : global.worldOffset - 250 - Math.random() * 500;

    e.visible = true;
    e.el.style.opacity = '1';
    e.el.style.display = 'block';
    e.hpBar.style.display = 'block';
    e.nameLabel.style.display = 'block';
    updateEnemyHPBarSingle(e);
    enemies.push(e);
};

const killSingleEnemy = (e) => {
    global.enemysKilled++;
    e.visible = false;
    e.el.style.opacity = '0';
    e.hpBar.style.display = 'none';
    e.nameLabel.style.display = 'none';
    e.debugBox.style.display = 'none';
    spawnCoin(e.worldX);
    setTimeout(() => removeEnemy(e), 400);
    // Spawn een vervanger iets later
    setTimeout(trySpawnEnemy, 1000);
};

const removeEnemy = (e) => {
    e.el.remove();
    e.hpBar.remove();
    e.nameLabel.remove();
    e.debugBox.remove();
    enemies = enemies.filter(x => x !== e);
};

// ─── Enemy HP bar ─────────────────────────────────────────────────────────
const updateEnemyHPBarSingle = (e) => {
    const pct = Math.max(0, e.hp / e.maxHP) * 100;
    e.hpFill.style.width      = pct + '%';
    e.hpFill.style.background = pct > 60 ? '#2ecc71' : pct > 30 ? '#f39c12' : '#e74c3c';
};

// ─── Enemy gedrag ─────────────────────────────────────────────────────────
const updateGrunt = (e, dist, absDist, hpPct) => {
    if      (hpPct < 0.25)  e.state = 'retreat';
    else if (absDist < 150) e.state = 'attack';
    else if (absDist < 550) e.state = 'chase';
    else if (absDist > 750) e.state = 'patrol';

    switch (e.state) {
        case 'patrol': {
            e.patrolTimer++;
            if (e.patrolTimer > 130) { e.patrolDir *= -1; e.patrolTimer = 0; }
            e.velocityX += (e.speed * 0.5 * e.patrolDir - e.velocityX) * 0.08;
            break;
        }
        case 'chase': {
            const t = dist > 0 ? -e.speed * 1.2 : e.speed * 1.2;
            e.velocityX += (t - e.velocityX) * 0.12;
            break;
        }
        case 'attack': {
            const wobble = Math.sin(Date.now() / 200) * 0.5;
            e.velocityX += (wobble - e.velocityX) * 0.15;
            enemyPunchSingle(e);
            break;
        }
        case 'retreat': {
            const fleeDir = dist > 0 ? 1 : -1;
            e.velocityX += (e.speed * 2 * fleeDir - e.velocityX) * 0.10;
            break;
        }
    }
};

const updateRusher = (e, dist, absDist) => {
    if (e.isCharging) {
        e.velocityX += (e.speed * 5 * e.chargeDir - e.velocityX) * 0.22;
        enemyPunchSingle(e);
        const passed = e.chargeDir === -1 ? dist < -70 : dist > 70;
        if (passed) {
            e.isCharging = false;
            e.state = 'recover';
            e.chargeCooldown = true;
            e.chargeTimer = 0;
            setTimeout(() => { e.chargeCooldown = false; }, 2200);
        }
        return;
    }

    switch (e.state) {
        case 'recover':
            e.velocityX *= 0.88;
            if (Math.abs(e.velocityX) < 0.3) { e.velocityX = 0; e.state = 'patrol'; }
            break;
        case 'patrol': {
            if (!e.chargeCooldown && absDist < 450) {
                e.chargeTimer = 0;
                e.state = 'windUp';
            } else {
                e.patrolTimer++;
                if (e.patrolTimer > 90) { e.patrolDir *= -1; e.patrolTimer = 0; }
                e.velocityX += (e.speed * 0.4 * e.patrolDir - e.velocityX) * 0.06;
            }
            break;
        }
        case 'windUp': {
            e.velocityX *= 0.85;
            e.chargeTimer++;
            if (absDist > 520) {
                e.state = 'patrol';
                e.chargeTimer = 0;
                e.el.style.filter = e.baseFilter;
                break;
            }
            e.el.style.filter = e.chargeTimer % 8 < 4
                ? e.baseFilter + ' brightness(2.4)'
                : e.baseFilter;
            if (e.chargeTimer > 55) {
                e.chargeDir  = dist > 0 ? -1 : 1;
                e.isCharging = true;
                e.el.style.filter = e.baseFilter;
            }
            break;
        }
    }
};

const updateTank = (e, dist, absDist) => {
    if (absDist < 165) {
        e.state = 'attack';
        const wobble = Math.sin(Date.now() / 300) * 0.3;
        e.velocityX += (wobble - e.velocityX) * 0.08;
        enemyPunchSingle(e);
    } else {
        e.state = 'chase';
        const t = dist > 0 ? -e.speed : e.speed;
        e.velocityX += (t - e.velocityX) * 0.04;
    }
};

const updateJumper = (e, dist, absDist, hpPct) => {
    e.jumpTimer++;
    if (e.isJumping) return;

    if (hpPct < 0.3) {
        if (e.jumpTimer > 35) {
            const fleeDir = dist > 0 ? 1 : -1;
            startEnemyJump(e, fleeDir * e.speed * 2.5, -11);
            e.jumpTimer = 0;
        }
        return;
    }

    if (absDist < 140) {
        enemyPunchSingle(e);
        if (e.jumpTimer > 50) {
            const sideDir = dist > 0 ? -0.5 : 0.5;
            startEnemyJump(e, sideDir, -7);
            e.jumpTimer = 0;
        }
        e.velocityX *= 0.88;
    } else if (absDist < 500) {
        if (e.jumpTimer > 55) {
            const dir        = dist > 0 ? -1 : 1;
            const jumpSpeedX = Math.min(absDist / 70, e.speed * 2);
            startEnemyJump(e, dir * jumpSpeedX, -12);
            e.jumpTimer = 0;
        }
        e.velocityX *= 0.92;
    } else {
        e.patrolTimer++;
        if (e.patrolTimer > 100) { e.patrolDir *= -1; e.patrolTimer = 0; }
        if (e.jumpTimer > 75) {
            startEnemyJump(e, e.speed * 0.8 * e.patrolDir, -9);
            e.jumpTimer = 0;
        }
        e.velocityX *= 0.94;
    }
};

const startEnemyJump = (e, vx, vy) => {
    if (e.isJumping || e.jumpCooldown) return;
    e.isJumping    = true;
    e.jumpVY       = vy;
    e.velocityX    = vx;
    e.jumpCooldown = true;
    setTimeout(() => { e.jumpCooldown = false; }, 600);
};

// ─── Enemy physics ────────────────────────────────────────────────────────
const updateSingleEnemy = (e) => {
    if (!e.visible) return;

    const screenX = e.worldX - global.worldOffset;
    const dist    = screenX - hero.x;
    const absDist = Math.abs(dist);
    const hpPct   = e.hp / e.maxHP;

    if (e.knockback !== 0) {
        e.worldX += e.knockback;
        e.knockback *= 0.82;
        if (Math.abs(e.knockback) < 0.4) e.knockback = 0;
    } else {
        switch (e.type) {
            case 'grunt':  updateGrunt(e,  dist, absDist, hpPct); break;
            case 'rusher': updateRusher(e, dist, absDist);        break;
            case 'tank':   updateTank(e,   dist, absDist);        break;
            case 'jumper': updateJumper(e, dist, absDist, hpPct); break;
        }
        e.worldX += e.velocityX;
    }

    if (e.isJumping) {
        e.jumpVY += 0.55;
        e.jumpY  -= e.jumpVY;
        if (e.jumpY <= 0) {
            e.jumpY     = 0;
            e.jumpVY    = 0;
            e.isJumping = false;
            e.velocityX *= 0.5;
        }
    }

    const newScreenX = e.worldX - global.worldOffset;
    e.el.style.left          = newScreenX + 'px';
    e.el.style.bottom        = e.jumpY + 'px';
    e.hpBar.style.left       = newScreenX + 'px';
    e.hpBar.style.bottom     = (e.jumpY + e.width + 10) + 'px';
    e.nameLabel.style.left   = newScreenX + 'px';
    e.nameLabel.style.bottom = (e.jumpY + e.width + 22) + 'px';
    e.el.style.transform     = newScreenX > hero.x ? 'scaleX(-1)' : 'scaleX(1)';

    if (global.debugHitboxes) {
        e.debugBox.style.display = 'block';
        e.debugBox.style.left   = (newScreenX + e.hitboxOffsetX) + 'px';
        e.debugBox.style.bottom = e.jumpY + 'px';
        e.debugBox.style.width  = e.hitboxWidth + 'px';
        e.debugBox.style.height = e.hitboxHeight + 'px';
    } else {
        e.debugBox.style.display = 'none';
    }

    if (newScreenX < -500 || newScreenX > window.innerWidth + 500) removeEnemy(e);
};

// ─── Enemy aanval ─────────────────────────────────────────────────────────
const enemyPunchSingle = (e) => {
    if (!e.visible || e.isSwinging || hero.isDead) return;
    e.isSwinging = true;

    e.el.style.filter = e.baseFilter + ' brightness(1.8)';
    setTimeout(() => { if (e.el) e.el.style.filter = e.baseFilter; }, 200);

    const screenX    = e.worldX - global.worldOffset;
    const enemyLeft  = screenX + e.hitboxOffsetX;
    const enemyRight = enemyLeft + e.hitboxWidth;
    const heroLeft   = hero.x + hero.hitboxOffsetX;
    const heroRight  = heroLeft + hero.hitboxWidth;

    const hit = heroLeft < enemyRight && heroRight > enemyLeft
        && hero.y < e.hitboxHeight && !hero.hitCooldown;

    if (hit) {
        hero.hp -= e.dmg;
        updateHeroHPBar();
        hero.hitCooldown = true;
        hero.el.style.filter = hero.powerUpActive
            ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
            : 'brightness(2) sepia(1) hue-rotate(300deg)';
        setTimeout(() => {
            if (!hero.isDead) hero.el.style.filter = hero.powerUpActive
                ? 'drop-shadow(0 0 8px gold) brightness(1.3)' : '';
        }, 150);
        setTimeout(() => { hero.hitCooldown = false; }, 800);
    }

    setTimeout(() => { if (e) e.isSwinging = false; }, 500);
};

// ─── Held → vijand collision ──────────────────────────────────────────────
const checkAllEnemyCollisions = () => {
    if (hero.isDead) return;

    enemies.forEach(e => {
        if (!e.visible) return;

        const screenX    = e.worldX - global.worldOffset;
        const enemyLeft  = screenX + e.hitboxOffsetX;
        const enemyRight = enemyLeft + e.hitboxWidth;
        const heroLeft   = hero.x + hero.hitboxOffsetX;
        const heroRight  = heroLeft + hero.hitboxWidth;

        const overlapping = heroLeft < enemyRight && heroRight > enemyLeft
            && hero.y < e.hitboxHeight;
        if (!overlapping) { e.hitThisSwing = false; return; }

        if (hero.isSwinging && !e.hitThisSwing && checkPositionRelativeToEnemy(e)) {
            e.hitThisSwing = true;
            e.hp -= hero.dmg;
            updateEnemyHPBarSingle(e);
            spawnDamageNumber(screenX, hero.dmg, e);
            e.knockback = ((screenX > hero.x ? 1 : -1) * 15) / e.knockbackResist;
            e.el.style.filter = e.baseFilter + ' brightness(3) sepia(1) hue-rotate(-30deg)';
            setTimeout(() => { if (e.el) e.el.style.filter = e.baseFilter; }, 150);
            if (e.hp < 1) killSingleEnemy(e);
        }
    });
};

const checkPositionRelativeToEnemy = (e) => {
    const enemyCenterX = (e.worldX - global.worldOffset) + e.width / 2;
    const heroCenterX  = global.SPRITE_CONTAINER_OFFSET + hero.x + 50;
    return enemyCenterX < heroCenterX ? hero.direction === 'left' : hero.direction === 'right';
};

// ─── Damage number ────────────────────────────────────────────────────────
const spawnDamageNumber = (screenX, damage, e) => {
    const el = document.createElement('div');
    el.textContent = `-${damage}`;
    el.style.cssText = `
        position:absolute; left:${screenX + e.width / 2}px;
        bottom:${e.jumpY + e.width + 30}px; color:#ff4444;
        font-size:20px; font-weight:bold; font-family:sans-serif;
        text-shadow:0 0 4px #000; pointer-events:none;
        transition:bottom 0.6s ease-out, opacity 0.6s ease-out; z-index:999;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
        el.style.bottom  = (e.jumpY + e.width + 80) + 'px';
        el.style.opacity = '0';
    });
    setTimeout(() => el.remove(), 650);
};

// ─── Golden Ball ──────────────────────────────────────────────────────────
const spawnGoldenBall = () => {
    if (global.goldenBallVisible) return;
    // Fix: één nette random range
    const dist = 500 + Math.random() * 1500;
    global.goldenBallWorldX = global.worldOffset + window.innerWidth + dist;
    global.goldenBall.style.display = 'block';
    global.goldenBallVisible = true;
};

const updateGoldenBallPosition = () => {
    if (!global.goldenBallVisible) return;
    global.goldenBall.style.left = (global.goldenBallWorldX - global.worldOffset) + 'px';
};

const checkGoldenBallCollision = () => {
    if (!global.goldenBallVisible) return;
    const screenX = global.goldenBallWorldX - global.worldOffset;
    if (hero.x < screenX + 20 && hero.x + 250 > screenX && hero.y < 30) collectGoldenBall();
};

const collectGoldenBall = () => {
    global.goldenBall.style.display = 'none';
    global.goldenBallVisible = false;

    hero.hp = hero.maxHP;
    updateHeroHPBar();

    if (hero.powerUpTimer) clearTimeout(hero.powerUpTimer);
    new Audio("sounds/powerUp.mp3").play();
    hero.powerUpActive = true;
    hero.speed         = hero.baseSpeed + 2;
    hero.jumpForce     = hero.baseJumpForce * 2;
    hero.dmg           = hero.baseDmg * 2;  // Fix: scaled op baseDmg, niet hardcoded
    showPowerUpEffect(true);

    hero.powerUpTimer = setTimeout(() => {
        new Audio("sounds/powerDown.mp3").play();
        hero.speed         = hero.baseSpeed;
        hero.jumpForce     = hero.baseJumpForce;
        hero.dmg           = hero.baseDmg;  // Fix: terug naar baseDmg
        hero.powerUpActive = false;
        showPowerUpEffect(false);
    }, 5000);

    setTimeout(spawnGoldenBall, 5000 + Math.random() * 10000);
};

const showPowerUpEffect = (active) => {
    hero.el.style.filter = active ? 'drop-shadow(0 0 8px gold) brightness(1.3)' : '';
};

// ─── Hero HP ──────────────────────────────────────────────────────────────
const updateHeroHPBar = () => {
    const pct = Math.max(0, hero.hp / hero.maxHP) * 100;
    hero.hpFill.style.width      = pct + '%';
    hero.hpLabel.textContent     = `HP: ${Math.max(0, hero.hp)}`;
    hero.hpFill.style.background = pct > 60 ? '#2ecc71' : pct > 30 ? '#f39c12' : '#e74c3c';
    if (hero.hp <= 0 && !hero.isDead) heroDeath();
};

const heroDeath = () => {
    new Audio("sounds/dying.mp3").play();
    hero.isDead          = true;
    hero.isSwinging      = false;
    hero.isJumping       = false;
    hero.velocityY       = 0;
    hero.sliding         = false;
    hero.slidingCooldown = false;
    global.movingLeft    = false;
    global.movingRight   = false;

    if (hero.powerUpTimer) clearTimeout(hero.powerUpTimer);
    hero.powerUpActive = false;
    hero.speed         = hero.baseSpeed;
    hero.jumpForce     = hero.baseJumpForce;
    hero.dmg           = hero.baseDmg;  // Fix: niet hardcoded 20

    hero.el.style.filter    = 'grayscale(1) brightness(0.4)';
    hero.el.style.transform = 'rotate(90deg)';

    setTimeout(heroRespawn, 2000);
};

const heroRespawn = () => {
    [...enemies].forEach(e => removeEnemy(e));

    hero.x             = window.innerWidth / 3;
    hero.y             = 0;
    hero.hp            = hero.maxHP;
    hero.hitCooldown   = false;
    hero.isDead        = false;
    global.worldOffset = 0;
    global.offset      = 0;
    hero.direction     = 'right';

    hero.el.style.filter    = '';
    hero.el.style.transform = 'scaleX(1)';
    hero.el.style.width     = '100px';
    hero.el.src = hero.src.rest;
    updateHeroHPBar();

    setTimeout(trySpawnEnemy, 1500);

    let blinks = 0;
    const blink = setInterval(() => {
        hero.el.style.opacity = hero.el.style.opacity === '0' ? '1' : '0';
        if (++blinks >= 6) { clearInterval(blink); hero.el.style.opacity = '1'; }
    }, 200);
};

// ─── Coins ────────────────────────────────────────────────────────────────
const spawnCoin = (worldX) => {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    document.body.appendChild(coin);
    coin._worldX = worldX;
    global.coins.push(coin);
    setTimeout(() => { coin.style.bottom = '120px'; }, 50);
};

const updateCoins = () => {
    global.coins = global.coins.filter(coin => {
        const screenX = coin._worldX - global.worldOffset;
        coin.style.left = screenX + 'px';

        if (screenX < -100 || screenX > window.innerWidth + 100) {
            coin.remove();
            return false;
        }

        if (hero.x < screenX + 24 && hero.x + 250 > screenX && hero.y < 54) {
            collectCoin(coin);
            return false;
        }
        return true;
    });
};

const collectCoin = (coin) => {
    new Audio("sounds/coinClaimed.mp3").play();
    coin.remove();
    global.coinCount++;
    updateCoinUI();

    const flash = document.createElement('div');
    flash.textContent = '+1 🪙';
    flash.style.cssText = `
        position:fixed; left:${hero.x}px; bottom:120px;
        color:gold; font-size:18px; font-weight:bold;
        font-family:sans-serif; text-shadow:0 0 4px #000;
        pointer-events:none; z-index:1000;
        transition:bottom 0.5s, opacity 0.5s;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.bottom = '160px'; flash.style.opacity = '0'; });
    setTimeout(() => flash.remove(), 550);
};

const updateCoinUI = () => {
    if (!global.coinLabel) {
        global.coinLabel = document.createElement('div');
        global.coinLabel.style.cssText = `
            position:fixed; top:20px; right:20px;
            color:gold; font-size:18px; font-weight:bold;
            font-family:sans-serif; text-shadow:0 0 4px #000; z-index:1000;
        `;
        document.body.appendChild(global.coinLabel);
    }
    global.coinLabel.textContent = `🪙 ${global.coinCount}`;
};

// ─── Richting ─────────────────────────────────────────────────────────────
const changeDirection = () => {
    if (hero.direction === 'left') {
        hero.el.src = hero.src.restLeft;
        hero.el.style.transform = 'scaleX(-1)';
    } else {
        hero.el.src = hero.src.rest;
        hero.el.style.transform = 'scaleX(1)';
    }
    if (!hero.sliding) hero.el.style.width = '100px';
};

// ─── Game Loop ────────────────────────────────────────────────────────────
const gameLoop = () => {
    if (!gameRunning) return;  // Fix: stopt de loop bij terugkeren

    if (!hero.isDead) {
        const spd = hero.speed;

        if (global.movingRight) {
            hero.direction = 'right';
            if (!hero.isSwinging && !hero.sliding) {
                hero.el.src = hero.src.run;
                hero.el.style.width     = '100px';
                hero.el.style.transform = 'scaleX(1)';
            }
            if (hero.x < hero.rightBound) hero.x = Math.min(hero.x + spd, hero.rightBound);
            else { global.worldOffset += spd; global.offset = global.worldOffset % global.tileWidth; }
        }

        if (global.movingLeft) {
            hero.direction = 'left';
            if (!hero.isSwinging && !hero.sliding) {
                hero.el.src = hero.src.runLeft;
                hero.el.style.width     = '100px';
                hero.el.style.transform = 'scaleX(-1)';
            }
            if (hero.x > hero.leftBound) hero.x -= spd;
            else { global.worldOffset -= spd; global.offset = ((global.worldOffset % global.tileWidth) + global.tileWidth) % global.tileWidth; }
        }

        if (global.movingDown && (global.movingLeft || global.movingRight) && !hero.sliding && !hero.slidingCooldown) {
            hero.sliding = true;
            hero.el.style.width = '50px';
            hero.slidingCooldown = true;
            if (!hero.powerUpActive) hero.speed += 5;

            setTimeout(() => {
                if (!hero.powerUpActive) hero.speed -= 5;
                hero.sliding = false;
                hero.el.style.width = '100px';
            }, 500);
            setTimeout(() => { hero.slidingCooldown = false; }, 1000);
        }

        if (!global.movingLeft && !global.movingRight && !hero.isSwinging) changeDirection();

        if (hero.isJumping) {
            hero.velocityY += hero.gravity;
            hero.y -= hero.velocityY;
            if (hero.y <= 0) { hero.y = 0; hero.velocityY = 0; hero.isJumping = false; }
        }
    }

    hero.el.style.left   = hero.x + 'px';
    hero.el.style.bottom = hero.y + 'px';
    global.ground.style.backgroundPositionX = -global.offset + 'px';

    global.debugHeroBox.style.display = global.debugHitboxes ? 'block' : 'none';
    if (global.debugHitboxes) {
        global.debugHeroBox.style.left   = (hero.x + hero.hitboxOffsetX) + 'px';
        global.debugHeroBox.style.bottom = hero.y + 'px';
        global.debugHeroBox.style.width  = hero.hitboxWidth + 'px';
        global.debugHeroBox.style.height = '100px';
    }

    updateGoldenBallPosition();
    checkGoldenBallCollision();

    spawnTimer++;
    const spawnInterval = Math.max(120, 400 - global.enemysKilled * 8);
    if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        trySpawnEnemy();
    }

    enemies.forEach(e => updateSingleEnemy(e));
    checkAllEnemyCollisions();
    updateCoins();

    requestAnimationFrame(gameLoop);
};

// ─── Jump & Punch ─────────────────────────────────────────────────────────
const jump = () => {
    if (hero.isJumping || hero.isDead) return;
    hero.isJumping = true;
    hero.velocityY = hero.jumpForce;
};

const punch = (e) => {
    if (e.target.closest('button')) return;
    if (!hero.el || hero.isSwinging || hero.isDead) return;
    hero.isSwinging = true;
    enemies.forEach(en => { en.hitThisSwing = false; });

    hero.el.src = hero.src.punch;
    new Audio("sounds/punch.mp3").play();
    hero.el.style.width     = '175px';
    hero.el.style.transform = hero.direction === 'left'
        ? 'scaleX(-1) translateY(35px)'
        : 'translateY(35px)';

    setTimeout(() => {
        if (global.movingLeft) {
            hero.el.src = hero.src.runLeft;
            hero.el.style.transform = 'scaleX(-1)';
        } else if (global.movingRight) {
            hero.el.src = hero.src.run;
            hero.el.style.transform = 'scaleX(1)';
        } else {
            changeDirection();
        }
        hero.el.style.width = hero.sliding ? '50px' : '100px';
        hero.isSwinging = false;
    }, 200);
};

// ─── Events ───────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.code === 'KeyD') global.movingRight = true;
    if (e.code === 'KeyA') global.movingLeft  = true;
    if (e.code === 'Space') jump();
    if (e.code === 'KeyS') global.movingDown  = true;
    if (e.code === 'KeyH') {
        global.debugHitboxes = !global.debugHitboxes;
        console.log('Debug hitboxes:', global.debugHitboxes ? 'aan' : 'uit');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') global.movingRight = false;
    if (e.code === 'KeyA') global.movingLeft  = false;
    if (e.code === 'KeyS') global.movingDown  = false;
});