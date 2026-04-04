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

// ─── State objecten ───────────────────────────────────────────────────────

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
    debugEnemyBox: null,
    debugHeroBox: null,
    enemysKilled: 0,
};

const hero = {
    el: null,

    x: 0,
    y: 0,
    velocityY: 0,
    gravity: 0.8,

    direction: 'right',
    isJumping: false,
    isSwinging: false,
    sliding: false,
    slidingCooldown: false,
    isDead: false,

    hp: 150,
    maxHP: 150,
    dmg: 20,
    boostedDmg: 40,
    hitCooldown: false,

    jumpForce: -15,
    baseJumpForce: -15,
    speed: 5,
    baseSpeed: 5,

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

    hpBar: null,
    hpFill: null,
    hpLabel: null,
};

const enemy = {
    el: null,

    hp: 25,
    maxHP: 25,
    dmg: 20,
    worldX: 0,
    visible: false,
    src: 'images/hero_rust.png',
    width: 120,
    speed: 1.2,
    hitThisSwing: false,
    knockback: 0,
    isSwinging: false,

    hitboxOffsetX: -15,
    hitboxWidth: 150,
    hitboxHeight: 100,

    hpBar: null,
    hpFill: null,
};

// ─── Setup ────────────────────────────────────────────────────────────────

const setup = () => {
    global.ground = document.querySelector('.ground');
    hero.el       = document.querySelector('.hero');
    hero.x        = window.innerWidth / 3;
    hero.rightBound = window.innerWidth - hero.leftBound - hero.x;

    startMusic();

    hero.el.style.cssText = 'position:absolute; width:100px; bottom:0px;';

    global.goldenBall = createElement('goldenBall');
    setupEnemyEl();
    setupEnemyHPBar();
    setupHeroHPBar();
    setupDebugBoxes();

    spawnGoldenBall();
    spawnEnemy();

    window.addEventListener('click', punch); // ← pas hier toevoegen
    gameLoop();
};

// ─── Element helpers ──────────────────────────────────────────────────────

const createElement = (id, isImage = false) => {
    const el = document.createElement(isImage ? 'img' : 'div');
    el.id = id;
    document.body.appendChild(el);
    return el;
};

const setupEnemyEl = () => {
    enemy.el = createElement('enemy', true);
    enemy.el.src = enemy.src;
    enemy.el.style.cssText = `position:absolute; width:${enemy.width}px; bottom:0px; display:none; transition:opacity 0.4s;`;
};

const setupEnemyHPBar = () => {
    enemy.hpBar = document.createElement('div');
    enemy.hpBar.style.cssText = `
        position: absolute;
        width: ${enemy.width}px; height: 8px;
        background: #333; border: 1px solid #000;
        border-radius: 4px; display: none; overflow: hidden;
    `;
    enemy.hpFill = document.createElement('div');
    enemy.hpFill.style.cssText = `height:100%; width:100%; background:#e74c3c; border-radius:3px; transition:width 0.1s;`;
    enemy.hpBar.appendChild(enemy.hpFill);
    document.body.appendChild(enemy.hpBar);
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
    global.debugEnemyBox = document.createElement('div');
    global.debugHeroBox  = document.createElement('div');
    [global.debugEnemyBox, global.debugHeroBox].forEach(el => {
        el.style.cssText = `position:absolute; border:2px solid red; pointer-events:none; z-index:999; display:none;`;
        document.body.appendChild(el);
    });
};

// ─── Golden Ball ──────────────────────────────────────────────────────────

const spawnGoldenBall = () => {
    if (global.goldenBallVisible) return;
    const dist = 300 + Math.random() * 2*(Math.random() * 1234);
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

    global.goldenBallClaimed = true;
    global.goldenBall.style.display = 'none';
    global.goldenBallVisible = false;

    hero.hp = hero.maxHP;
    updateHeroHPBar();

    if (hero.powerUpTimer) clearTimeout(hero.powerUpTimer);
    let powerUpEffectSound = new Audio("sounds/powerUp.mp3")
    powerUpEffectSound.play();
    hero.powerUpActive = true;
        hero.speed = hero.baseSpeed + 2;
        hero.jumpForce = hero.baseJumpForce * 2;
        hero.dmg = hero.boostedDmg;


    showPowerUpEffect(true);

    hero.powerUpTimer = setTimeout(() => {
        let powerUpEffectReleasedSound = new Audio("sounds/powerDown.mp3");
        powerUpEffectReleasedSound.play();
        hero.speed = hero.baseSpeed;
        hero.jumpForce = hero.baseJumpForce;
        hero.dmg = 20;
        hero.powerUpActive = false;
        showPowerUpEffect(false);
    }, 5000);

    setTimeout(spawnGoldenBall, Math.random() * 10000);

};

const showPowerUpEffect = (active) => {
    hero.el.style.filter = active ? 'drop-shadow(0 0 8px gold) brightness(1.3)' : '';
};

// ─── Hero HP ──────────────────────────────────────────────────────────────

const updateHeroHPBar = () => {
    const pct = Math.max(0, hero.hp / hero.maxHP) * 100;
    hero.hpFill.style.width = pct + '%';
    hero.hpLabel.textContent = `HP: ${Math.max(0, hero.hp)}`;
    hero.hpFill.style.background = pct > 60 ? '#2ecc71' : pct > 30 ? '#f39c12' : '#e74c3c';
    if (hero.hp <= 0 && !hero.isDead) heroDeath();
};

const heroDeath = () => {
    let dyingSound = new Audio("sounds/dying.mp3");
    dyingSound.play();
    hero.isDead = true;
    hero.isSwinging = false;
    hero.isJumping = false;
    hero.velocityY = 0;
    hero.sliding = false;
    hero.slidingCooldown = false;
    global.movingLeft = false;
    global.movingRight = false;

    if (hero.powerUpTimer) clearTimeout(hero.powerUpTimer);
    hero.powerUpActive = false;
    hero.speed = hero.baseSpeed;
    hero.jumpForce = hero.baseJumpForce;
    hero.dmg = 20;

    hero.el.style.filter = 'grayscale(1) brightness(0.4)';
    hero.el.style.transform = 'rotate(90deg)';

    setTimeout(heroRespawn, 2000);
};

const heroRespawn = () => {
    hero.x = window.innerWidth / 3;
    hero.y = 0;
    hero.hp = hero.maxHP;
    hero.hitCooldown = false;
    hero.isDead = false;
    global.worldOffset = 0;
    global.offset = 0;
    hero.direction = 'right';

    hero.el.style.filter = '';
    hero.el.style.transform = 'scaleX(1)';
    hero.el.style.width = '100px';
    hero.el.src = hero.src.rest;
    updateHeroHPBar();

    let blinks = 0;
    const blink = setInterval(() => {
        hero.el.style.opacity = hero.el.style.opacity === '0' ? '1' : '0';
        if (++blinks >= 6) { clearInterval(blink); hero.el.style.opacity = '1'; }
    }, 200);
};

// ─── Enemy ────────────────────────────────────────────────────────────────

const spawnEnemy = () => {
    let randomNumber = Math.floor(Math.random() * 5);

    if(Math.floor(Math.random() * 5) === randomNumber) {
        enemy.hp = 50 * Math.floor(Math.random() * 5);
    }
    else{
        enemy.hp = enemy.maxHP;
    }

    enemy.knockback = 0;
    enemy.worldX = global.worldOffset + window.innerWidth + 300 + Math.random() * 1200;
    enemy.visible = true;
    enemy.el.style.opacity = '1';
    enemy.el.style.display = 'block';
    enemy.hpBar.style.display = 'block';
    updateEnemyHPBar();
};

const killEnemy = () => {
    global.enemysKilled++;
    enemy.visible = false;
    enemy.el.style.opacity = '0';
    enemy.hpBar.style.display = 'none';

    spawnCoin(enemy.worldX);

    setTimeout(() => {
        enemy.el.style.display = 'none';
        enemy.hp = enemy.maxHP;
        setTimeout(spawnEnemy, 2000);
    }, 400);
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
    let coinSound = new Audio("sounds/coinClaimed.mp3");
    coinSound.play();

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

// ─── Enemy HP & positie ───────────────────────────────────────────────────

const updateEnemyHPBar = () => {
    const pct = Math.max(0, enemy.hp / enemy.maxHP) * 100;
    enemy.hpFill.style.width = pct + '%';
    enemy.hpFill.style.background = pct > 60 ? '#2ecc71' : pct > 30 ? '#f39c12' : '#e74c3c';
};

const updateEnemyPosition = () => {
    if (!enemy.visible) return;

    if (enemy.knockback !== 0) {
        enemy.worldX += enemy.knockback * 0.3;
        enemy.knockback *= 0.85;
        if (Math.abs(enemy.knockback) < 0.5) enemy.knockback = 0;
    } else {
        const screenX = enemy.worldX - global.worldOffset;
        if (screenX > hero.x + 5) enemy.worldX -= enemy.speed;
        else if (screenX < hero.x - 5) enemy.worldX += enemy.speed;
        if (Math.abs(screenX - hero.x) < 150) enemyPunch();
    }

    const screenX = enemy.worldX - global.worldOffset;
    enemy.el.style.left = screenX + 'px';
    enemy.hpBar.style.left = screenX + 'px';
    enemy.hpBar.style.bottom = (enemy.width + 10) + 'px';

    if (screenX < -200) killEnemy();
};

const enemyPunch = () => {
    if (!enemy.visible || enemy.isSwinging || hero.isDead) return;
    enemy.isSwinging = true;

    enemy.el.style.filter = 'brightness(1.5)';
    setTimeout(() => { enemy.el.style.filter = ''; }, 200);

    const screenX    = enemy.worldX - global.worldOffset;
    const enemyLeft  = screenX + enemy.hitboxOffsetX;
    const enemyRight = enemyLeft + enemy.hitboxWidth;
    const heroLeft   = hero.x + hero.hitboxOffsetX;
    const heroRight  = heroLeft + hero.hitboxWidth;

    if (heroLeft < enemyRight && heroRight > enemyLeft && hero.y < enemy.hitboxHeight && !hero.hitCooldown) {
        hero.hp -= enemy.dmg;
        updateHeroHPBar();
        hero.hitCooldown = true;

        hero.el.style.filter = hero.powerUpActive
            ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
            : 'brightness(2) sepia(1) hue-rotate(300deg)';
        setTimeout(() => {
            if (!hero.isDead) hero.el.style.filter = hero.powerUpActive ? 'drop-shadow(0 0 8px gold) brightness(1.3)' : '';
        }, 150);

        setTimeout(() => { hero.hitCooldown = false; }, 800);
    }

    setTimeout(() => { enemy.isSwinging = false; }, 500);
};

// ─── Damage number ────────────────────────────────────────────────────────

const spawnDamageNumber = (screenX, damage) => {
    const el = document.createElement('div');
    el.textContent = `-${damage}`;
    el.style.cssText = `
        position:absolute; left:${screenX + enemy.width / 2}px;
        bottom:${enemy.width + 30}px; color:#ff4444;
        font-size:20px; font-weight:bold; font-family:sans-serif;
        text-shadow:0 0 4px #000; pointer-events:none;
        transition:bottom 0.6s ease-out, opacity 0.6s ease-out; z-index:999;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.bottom = (enemy.width + 80) + 'px'; el.style.opacity = '0'; });
    setTimeout(() => el.remove(), 650);
};

// ─── Debug hitboxes ───────────────────────────────────────────────────────

const updateDebugHitboxes = (enemyScreenX) => {
    const show = global.debugHitboxes;

    global.debugEnemyBox.style.display = show && enemy.visible ? 'block' : 'none';
    if (show && enemy.visible) {
        global.debugEnemyBox.style.left   = (enemyScreenX + enemy.hitboxOffsetX) + 'px';
        global.debugEnemyBox.style.bottom = '0px';
        global.debugEnemyBox.style.width  = enemy.hitboxWidth + 'px';
        global.debugEnemyBox.style.height = enemy.hitboxHeight + 'px';
    }

    global.debugHeroBox.style.display = show ? 'block' : 'none';
    if (show) {
        global.debugHeroBox.style.left   = (hero.x + hero.hitboxOffsetX) + 'px';
        global.debugHeroBox.style.bottom = hero.y + 'px';
        global.debugHeroBox.style.width  = hero.hitboxWidth + 'px';
        global.debugHeroBox.style.height = '100px';
    }
};

// ─── Collision ────────────────────────────────────────────────────────────

const checkEnemyCollision = () => {
    if (!enemy.visible || hero.isDead) return;

    const screenX    = enemy.worldX - global.worldOffset;
    const enemyLeft  = screenX + enemy.hitboxOffsetX;
    const enemyRight = enemyLeft + enemy.hitboxWidth;
    const heroLeft   = hero.x + hero.hitboxOffsetX;
    const heroRight  = heroLeft + hero.hitboxWidth;
    updateDebugHitboxes(screenX);

    const overlapping = heroLeft < enemyRight && heroRight > enemyLeft && hero.y < enemy.hitboxHeight;
    if (!overlapping) { enemy.hitThisSwing = false; return; }

    if (hero.isSwinging && !enemy.hitThisSwing && checkPositionRelative()) {
        enemy.hitThisSwing = true;
        enemy.hp -= hero.dmg;
        updateEnemyHPBar();
        spawnDamageNumber(screenX, hero.dmg);

        enemy.knockback = screenX > hero.x ? 15 : -15;
        enemy.el.style.filter = 'brightness(3) sepia(1) hue-rotate(-30deg)';
        setTimeout(() => { enemy.el.style.filter = ''; }, 150);

        if (enemy.hp < 1) killEnemy();
    }
};

const checkPositionRelative = () => {
    const enemyCenterX = (enemy.worldX - global.worldOffset) + enemy.width / 2;
    const heroCenterX  = global.SPRITE_CONTAINER_OFFSET + hero.x + 50;
    return enemyCenterX < heroCenterX ? hero.direction === 'left' : hero.direction === 'right';
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
    if (!hero.isDead) {
        const spd = hero.speed;

        if (global.movingRight) {
            hero.direction = 'right';
            if (!hero.isSwinging && !hero.sliding) {
                hero.el.src = hero.src.run;
                hero.el.style.width = '100px';
                hero.el.style.transform = 'scaleX(1)';
            }
            if (hero.x < hero.rightBound) hero.x = Math.min(hero.x + spd, hero.rightBound);
            else { global.worldOffset += spd; global.offset = global.worldOffset % global.tileWidth; }
        }

        if (global.movingLeft) {
            hero.direction = 'left';
            if (!hero.isSwinging && !hero.sliding) {
                hero.el.src = hero.src.runLeft;
                hero.el.style.width = '100px';
                hero.el.style.transform = 'scaleX(-1)';
            }
            if (hero.x > hero.leftBound) hero.x -= spd;
            else { global.worldOffset -= spd; global.offset = ((global.worldOffset % global.tileWidth) + global.tileWidth) % global.tileWidth; }
        }

        if (global.movingDown && (global.movingLeft || global.movingRight) && !hero.sliding && !hero.slidingCooldown) {
            hero.sliding = true;
            hero.el.style.width = '50px';
            hero.slidingCooldown = true;
            if(!hero.powerUpActive){
                hero.speed += 5;
            }


            setTimeout(() => { if(!hero.powerUpActive) {hero.speed -= 5; }hero.sliding = false; hero.el.style.width = '100px'; }, 500);
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

    updateGoldenBallPosition();
    checkGoldenBallCollision();
    updateEnemyPosition();
    checkEnemyCollision();
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
    if (e.target.closest('button')) return; // ← knoppen worden genegeerd
    if (!hero.el || hero.isSwinging || hero.isDead) return;
    hero.isSwinging = true;
    enemy.hitThisSwing = false;
    hero.el.src = hero.src.punch;
    const punchSound = new Audio("sounds/punch.mp3");
    punchSound.play();
    hero.el.style.width = '175px';
    hero.el.style.transform = hero.direction === 'left' ? 'scaleX(-1) translateY(35px)' : 'translateY(35px)';

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

