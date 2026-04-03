const global = {
    ground: document.querySelector('.ground'),
    hero: document.querySelector('.hero'),
    rustImage: document.querySelector('.hero'),

    SPRITE_CONTAINER_OFFSET: 200,
    tileWidth: 500,
    speed: 5,
    baseSpeed: 5,
    offset: 0,
    worldOffset: 0,
    lastTileIndex: 0,

    heroX: window.innerWidth / 3,
    heroY: 0,
    velocityY: 0,
    gravity: 0.8,
    jumpForce: -15,
    baseJumpForce: -15,
    isJumping: false,

    leftBound: 200,
    rightBound: 0,

    movingRight: false,
    movingLeft: false,
    movingDown: false,
    isSwinging: false,
    sliding: false,
    slidingCooldown: false,
    isDead: false,

    direction: 'right',

    RestImageSrc: 'images/hero_rust.png',
    LinksRestImageSrc: 'images/hero_rust.png',
    PunchImageSrc: 'images/hero_punch.png',
    RunImageSrc: 'images/hero_rust.png',
    RunLeftImageSrc: 'images/hero_rust.png',

    powerUpActive: false,
    powerUpTimer: null,

    goldenBallVisible: false,
    goldenBallWorldX: 0,

    coin : null,

    // ── Enemy ──
    enemy: null,
    enemyHP: 25,
    enemyMaxHP: 25,
    enemyDmg: 20,
    enemyWorldX: 0,
    enemyVisible: false,
    enemySrc: 'images/hero_rust.png',
    enemyWidth: 120,
    enemySpeed: 1.2,
    enemyHitThisSwing: false,
    enemyKnockback: 0,
    enemyHPBar: null,
    enemyHPFill: null,
    enemyIsSwinging: false,

    // ── Hitboxes ──
    enemyHitboxOffsetX: -15,
    enemyHitboxWidth: 150,
    enemyHitboxHeight: 100,

    heroHitboxOffsetX: 180,
    heroHitboxWidth: 150,

    // ── Debug ──
    debugHitboxes: true,

    heroHP: 150,
    heroMaxHP: 150,
    heroDmg: 20,
    heroBoostedDmg: 40,
    heroHitCooldown: false,

    // ── Hero HP balk ──
    heroHPBar: null,
    heroHPFill: null,
    heroHPLabel: null,



    enemysKilled: 0,
};

// ─── Setup ───────────────────────────────────────────────────────────────

const setup = () => {
    global.hero.style.position = 'absolute';
    global.hero.style.width = '100px';
    global.hero.style.bottom = '0px';
    global.rightBound = window.innerWidth - global.leftBound - global.heroX;

    global.goldenBall = createElement('goldenBall');

    // Enemy image
    global.enemy = createElement('enemy', true);
    global.enemy.src = global.enemySrc;
    global.enemy.style.position = 'absolute';
    global.enemy.style.width = global.enemyWidth + 'px';
    global.enemy.style.bottom = '0px';
    global.enemy.style.display = 'none';
    global.enemy.style.transition = 'opacity 0.4s';

    // Enemy HP balk container
    global.enemyHPBar = document.createElement('div');
    global.enemyHPBar.style.cssText = `
        position: absolute;
        width: ${global.enemyWidth}px;
        height: 8px;
        background: #333;
        border: 1px solid #000;
        border-radius: 4px;
        display: none;
        overflow: hidden;
    `;

    // Enemy HP balk vulling
    global.enemyHPFill = document.createElement('div');
    global.enemyHPFill.style.cssText = `
        height: 100%;
        width: 100%;
        background: #e74c3c;
        border-radius: 3px;
        transition: width 0.1s;
    `;
    global.enemyHPBar.appendChild(global.enemyHPFill);
    document.body.appendChild(global.enemyHPBar);

    // ── Hero HP balk ──
    global.heroHPBar = document.createElement('div');
    global.heroHPBar.style.cssText = `
        position: fixed;
        top: 40px;
        left: 20px;
        width: 200px;
        height: 18px;
        background: #333;
        border: 2px solid #000;
        border-radius: 6px;
        overflow: hidden;
        z-index: 1000;
    `;

    global.heroHPFill = document.createElement('div');
    global.heroHPFill.style.cssText = `
        height: 100%;
        width: 100%;
        background: #2ecc71;
        border-radius: 4px;
        transition: width 0.15s, background 0.3s;
    `;

    global.heroHPLabel = document.createElement('div');
    global.heroHPLabel.textContent = `HP: ${global.heroHP}`;
    global.heroHPLabel.style.cssText = `
        position: fixed;
        top: 42px;
        left: 228px;
        color: white;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: bold;
        text-shadow: 0 0 4px #000;
        z-index: 1000;
    `;

    global.heroHPBar.appendChild(global.heroHPFill);
    document.body.appendChild(global.heroHPBar);
    document.body.appendChild(global.heroHPLabel);

    // ── Debug hitbox elementen ──
    global.debugEnemyBox = document.createElement('div');
    global.debugHeroBox  = document.createElement('div');
    [global.debugEnemyBox, global.debugHeroBox].forEach(el => {
        el.style.cssText = `
            position: absolute;
            border: 2px solid red;
            pointer-events: none;
            z-index: 999;
            display: none;
        `;
        document.body.appendChild(el);
    });

    spawnGoldenBall();
    spawnEnemy();
    gameScript();
};

// ─── Element creation ─────────────────────────────────────────────────────

const createElement = (id, isImage = false) => {
    const element = document.createElement(isImage ? 'img' : 'div');
    element.id = id;
    document.body.appendChild(element);
    return element;
};

// ─── Golden Ball ──────────────────────────────────────────────────────────

const spawnGoldenBall = () => {
    if (global.goldenBallVisible) return;
    const offscreenDistance = 300 + Math.random() * 1200;
    global.goldenBallWorldX = global.worldOffset + window.innerWidth + offscreenDistance;
    global.goldenBall.style.display = 'block';
    global.goldenBallVisible = true;
};

const updateGoldenBallPosition = () => {
    if (!global.goldenBallVisible) return;
    const screenX = global.goldenBallWorldX - global.worldOffset;
    global.goldenBall.style.left = screenX + 'px';
};

const checkGoldenBallCollision = () => {
    if (!global.goldenBallVisible) return;
    const screenX = global.goldenBallWorldX - global.worldOffset;
    const ballSize = 20;
    if (
        global.heroX < screenX + ballSize &&
        global.heroX + 250 > screenX &&
        global.heroY < ballSize + 10
    ) {
        collectGoldenBall();
    }
};

const collectGoldenBall = () => {
    global.goldenBall.style.display = 'none';
    global.goldenBallVisible = false;
    global.heroHP = global.heroMaxHP;
    updateHeroHPBar();

    if (global.powerUpTimer) clearTimeout(global.powerUpTimer);

    global.powerUpActive = true;
    global.speed = global.baseSpeed * 2;
    global.jumpForce = global.baseJumpForce * 2;
    global.heroDmg = global.heroBoostedDmg;

    showPowerUpEffect(true);

    global.powerUpTimer = setTimeout(() => {
        global.speed = global.baseSpeed;
        global.jumpForce = global.baseJumpForce;
        global.heroDmg = 20;
        global.powerUpActive = false;
        showPowerUpEffect(false);
    }, 5000);

    setTimeout(spawnGoldenBall, Math.random() * 10000);
};

const showPowerUpEffect = (active) => {
    global.hero.style.filter = active
        ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
        : '';
};

// ─── Hero HP ──────────────────────────────────────────────────────────────

const updateHeroHPBar = () => {
    const pct = Math.max(0, global.heroHP / global.heroMaxHP) * 100;
    global.heroHPFill.style.width = pct + '%';
    global.heroHPLabel.textContent = `HP: ${Math.max(0, global.heroHP)}`;

    if (pct > 60) global.heroHPFill.style.background = '#2ecc71';
    else if (pct > 30) global.heroHPFill.style.background = '#f39c12';
    else global.heroHPFill.style.background = '#e74c3c';

    if (global.heroHP <= 0 && !global.isDead) heroDeath();
};

const heroDeath = () => {
    global.isDead = true;
    global.movingLeft = false;
    global.movingRight = false;
    global.isSwinging = false;
    global.isJumping = false;
    global.velocityY = 0;
    global.sliding = false;
    global.slidingCooldown = false;

    if (global.powerUpTimer) clearTimeout(global.powerUpTimer);
    global.powerUpActive = false;
    global.speed = global.baseSpeed;
    global.jumpForce = global.baseJumpForce;
    global.heroDmg = 20;

    global.hero.style.filter = 'grayscale(1) brightness(0.4)';
    global.hero.style.transform = 'rotate(90deg)';

    setTimeout(() => heroRespawn(), 2000);
};

const heroRespawn = () => {
    // reset positie
    global.heroX = window.innerWidth / 3;
    global.heroY = 0;
    global.worldOffset = 0;
    global.offset = 0;
    global.direction = 'right';

    // reset HP
    global.heroHP = global.heroMaxHP;
    global.heroHitCooldown = false;
    global.isDead = false;

    // reset visueel
    global.hero.style.filter = '';
    global.hero.style.transform = 'scaleX(1)';
    global.hero.style.width = '100px';
    global.hero.src = global.RestImageSrc;

    updateHeroHPBar();

    // knippereffect om respawn aan te geven
    let blinks = 0;
    const blink = setInterval(() => {
        global.hero.style.opacity = global.hero.style.opacity === '0' ? '1' : '0';
        blinks++;
        if (blinks >= 6) {
            clearInterval(blink);
            global.hero.style.opacity = '1';
        }
    }, 200);
};

// ─── Enemy ────────────────────────────────────────────────────────────────

const spawnEnemy = () => {
    global.enemyHP = global.enemyMaxHP;
    global.enemyKnockback = 0;

    const offscreenDistance = 300 + Math.random() * 1200;
    global.enemyWorldX = global.worldOffset + window.innerWidth + offscreenDistance;

    global.enemyVisible = true;
    global.enemy.style.opacity = '1';
    global.enemy.style.display = 'block';
    global.enemyHPBar.style.display = 'block';

    updateEnemyHPBar();
};

const killEnemy = () => {
    global.enemyVisible = false;
    global.enemy.style.opacity = '0';
    global.enemyHPBar.style.display = 'none';

    spawnCoin(global.enemyWorldX); // ← positie meegeven vóór de timeout

    setTimeout(() => {
        global.enemy.style.display = 'none';
        global.enemyHP = global.enemyMaxHP;
        setTimeout(spawnEnemy, 2000);
    }, 400);


}
// ─── Coin ─────────────────────────────────────────────────────────────────

const spawnCoin = (worldX) => {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    document.body.appendChild(coin);

    // Sla de world X op in het element zelf
    coin._worldX = worldX;
    global.coins = global.coins || [];
    global.coins.push(coin);

    // Bounce animatie omhoog dan naar beneden
    setTimeout(() => { coin.style.bottom = '120px'; }, 50);

};

const updateCoins = () => {
    if (!global.coins || global.coins.length === 0) return;

    global.coins = global.coins.filter(coin => {
        const screenX = coin._worldX - global.worldOffset;
        coin.style.left = screenX + 'px';

        if (screenX < -100 || screenX > window.innerWidth + 100) {
            coin.remove();
            return false;
        }

        // Collision met hero
        const coinSize = 24;
        if (
            global.heroX < screenX + coinSize &&
            global.heroX + 250 > screenX &&
            global.heroY < coinSize + 30
        ) {
            collectCoin(coin);
            return false;
        }

        return true;
    });
};

const collectCoin = (coin) => {
    coin.remove();
    global.coinCount = (global.coinCount || 0) + 1;
    updateCoinUI();

    // Kort flash effect
    const flash = document.createElement('div');
    flash.textContent = '+1 🪙';
    flash.style.cssText = `
        position: fixed;
        left: ${global.heroX}px;
        bottom: 120px;
        color: gold;
        font-size: 18px;
        font-weight: bold;
        font-family: sans-serif;
        text-shadow: 0 0 4px #000;
        pointer-events: none;
        z-index: 1000;
        transition: bottom 0.5s, opacity 0.5s;
    `;
    document.body.appendChild(flash);
    requestAnimationFrame(() => {
        flash.style.bottom = '160px';
        flash.style.opacity = '0';
    });
    setTimeout(() => flash.remove(), 550);
};

const updateCoinUI = () => {
    if (!global.coinLabel) {
        global.coinLabel = document.createElement('div');
        global.coinLabel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            color: gold;
            font-size: 18px;
            font-weight: bold;
            font-family: sans-serif;
            text-shadow: 0 0 4px #000;
            z-index: 1000;
        `;
        document.body.appendChild(global.coinLabel);
    }
    global.coinLabel.textContent = `🪙 ${global.coinCount}`;
};

const updateEnemyHPBar = () => {
    const pct = Math.max(0, global.enemyHP / global.enemyMaxHP) * 100;
    global.enemyHPFill.style.width = pct + '%';

    if (pct > 60) global.enemyHPFill.style.background = '#2ecc71';
    else if (pct > 30) global.enemyHPFill.style.background = '#f39c12';
    else global.enemyHPFill.style.background = '#e74c3c';
};

const updateEnemyPosition = () => {
    if (!global.enemyVisible) return;

    if (global.enemyKnockback !== 0) {
        global.enemyWorldX += global.enemyKnockback * 0.3;
        global.enemyKnockback *= 0.85;
        if (Math.abs(global.enemyKnockback) < 0.5) global.enemyKnockback = 0;
    } else {
        const enemyScreenX = global.enemyWorldX - global.worldOffset;
        if (enemyScreenX > global.heroX + 5) global.enemyWorldX -= global.enemySpeed;
        else if (enemyScreenX < global.heroX - 5) global.enemyWorldX += global.enemySpeed;

        const dist = Math.abs(enemyScreenX - global.heroX);
        if (dist < 150) enemyPunch();
    }

    const screenX = global.enemyWorldX - global.worldOffset;
    global.enemy.style.left = screenX + 'px';
    global.enemyHPBar.style.left = screenX + 'px';
    global.enemyHPBar.style.bottom = (global.enemyWidth + 10) + 'px';

    if (screenX < -200) killEnemy();
};

const enemyPunch = () => {
    if (!global.enemyVisible) return;
    if (global.enemyIsSwinging) return;
    if (global.isDead) return;

    const enemyScreenX = global.enemyWorldX - global.worldOffset;

    global.enemyIsSwinging = true;

    global.enemy.style.filter = 'brightness(1.5)';
    setTimeout(() => { global.enemy.style.filter = ''; }, 200);

    const enemyLeft  = enemyScreenX + global.enemyHitboxOffsetX;
    const enemyRight = enemyLeft + global.enemyHitboxWidth;
    const heroLeft   = global.heroX + global.heroHitboxOffsetX;
    const heroRight  = heroLeft + global.heroHitboxWidth;

    const inRange =
        heroLeft  < enemyRight &&
        heroRight > enemyLeft  &&
        global.heroY < global.enemyHitboxHeight;

    if (inRange && !global.heroHitCooldown) {
        global.heroHP -= global.enemyDmg;
        updateHeroHPBar();
        global.heroHitCooldown = true;

        global.hero.style.filter = global.powerUpActive
            ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
            : 'brightness(2) sepia(1) hue-rotate(300deg)';
        setTimeout(() => {
            if (!global.isDead) {
                global.hero.style.filter = global.powerUpActive
                    ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
                    : '';
            }
        }, 150);

        setTimeout(() => { global.heroHitCooldown = false; }, 800);
    }

    setTimeout(() => { global.enemyIsSwinging = false; }, 500);
};

// ─── Floating damage number ───────────────────────────────────────────────

const spawnDamageNumber = (screenX, damage) => {
    const el = document.createElement('div');
    el.textContent = `-${damage}`;
    el.style.cssText = `
        position: absolute;
        left: ${screenX + global.enemyWidth / 2}px;
        bottom: ${global.enemyWidth + 30}px;
        color: #ff4444;
        font-size: 20px;
        font-weight: bold;
        font-family: sans-serif;
        text-shadow: 0 0 4px #000;
        pointer-events: none;
        transition: bottom 0.6s ease-out, opacity 0.6s ease-out;
        z-index: 999;
    `;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
        el.style.bottom = (global.enemyWidth + 80) + 'px';
        el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 650);
};

// ─── Debug hitboxes ───────────────────────────────────────────────────────

const updateDebugHitboxes = (enemyScreenX) => {
    if (!global.debugHitboxes) {
        global.debugEnemyBox.style.display = 'none';
        global.debugHeroBox.style.display  = 'none';
        return;
    }

    global.debugEnemyBox.style.display = global.enemyVisible ? 'block' : 'none';
    global.debugEnemyBox.style.left    = (enemyScreenX + global.enemyHitboxOffsetX) + 'px';
    global.debugEnemyBox.style.bottom  = '0px';
    global.debugEnemyBox.style.width   = global.enemyHitboxWidth + 'px';
    global.debugEnemyBox.style.height  = global.enemyHitboxHeight + 'px';

    global.debugHeroBox.style.display = 'block';
    global.debugHeroBox.style.left    = (global.heroX + global.heroHitboxOffsetX) + 'px';
    global.debugHeroBox.style.bottom  = global.heroY + 'px';
    global.debugHeroBox.style.width   = global.heroHitboxWidth + 'px';
    global.debugHeroBox.style.height  = '100px';


};

// ─── Collision ────────────────────────────────────────────────────────────

const checkEnemyCollision = () => {
    if (!global.enemyVisible) return;
    if (global.isDead) return;

    const screenX = global.enemyWorldX - global.worldOffset;

    const enemyLeft   = screenX + global.enemyHitboxOffsetX;
    const enemyRight  = enemyLeft + global.enemyHitboxWidth;
    const enemyBottom = global.enemyHitboxHeight;

    const heroLeft  = global.heroX + global.heroHitboxOffsetX;
    const heroRight = heroLeft + global.heroHitboxWidth;

    updateDebugHitboxes(screenX);

    const overlapping =
        heroLeft  < enemyRight  &&
        heroRight > enemyLeft   &&
        global.heroY < enemyBottom;

    if (!overlapping) {
        global.enemyHitThisSwing = false;
        return;
    }

    if (global.isSwinging && !global.enemyHitThisSwing && checkPositionRelative()) {
        global.enemyHitThisSwing = true;
        global.enemyHP -= global.heroDmg;
        updateEnemyHPBar();
        spawnDamageNumber(screenX, global.heroDmg);

        global.enemyKnockback = screenX > global.heroX ? 15 : -15;

        global.enemy.style.filter = 'brightness(3) sepia(1) hue-rotate(-30deg)';
        setTimeout(() => { global.enemy.style.filter = ''; }, 150);

        if (global.enemyHP < 1) killEnemy();
    }
};

// ─── Positie check ────────────────────────────────────────────────────────

const checkPositionRelative = () => {
    const enemyScreenX = global.enemyWorldX - global.worldOffset;

    const enemyCenterX = enemyScreenX + global.enemyWidth / 2;
    const heroCenterX  = global.SPRITE_CONTAINER_OFFSET + global.heroX + 50;

    if (enemyCenterX < heroCenterX) {
        return global.direction === 'left';
    } else {
        return global.direction === 'right';
    }
};

// ─── Richting ─────────────────────────────────────────────────────────────

const changeDirection = () => {
    if (global.direction === 'left') {
        global.rustImage.src = global.LinksRestImageSrc;
        global.rustImage.style.transform = 'scaleX(-1)';
    } else {
        global.rustImage.src = global.RestImageSrc;
        global.rustImage.style.transform = 'scaleX(1)';
    }
    if (!global.sliding) global.rustImage.style.width = '100px';
};

// ─── Game Loop ────────────────────────────────────────────────────────────

const gameScript = () => {
    if (!global.isDead) {
        if (global.movingRight) {
            global.direction = 'right';
            if (!global.isSwinging && !global.sliding) {
                global.hero.src = global.RunImageSrc;
                global.hero.style.width = '100px';
                global.hero.style.transform = 'scaleX(1)';
            }
            if (global.heroX < global.rightBound) global.heroX = Math.min(global.heroX + global.speed, global.rightBound);
            else {
                global.heroX = global.rightBound;
                global.worldOffset += global.speed;
                global.offset = global.worldOffset % global.tileWidth;
            }
        }

        if (global.movingLeft) {
            global.direction = 'left';
            if (!global.isSwinging && !global.sliding) {
                global.hero.src = global.RunLeftImageSrc;
                global.hero.style.width = '100px';
                global.hero.style.transform = 'scaleX(-1)';
            }
            if (global.heroX > global.leftBound) global.heroX -= global.speed;
            else {
                global.worldOffset -= global.speed;
                global.offset = ((global.worldOffset % global.tileWidth) + global.tileWidth) % global.tileWidth;
            }
        }

        if (global.movingDown) {
            if ((global.movingLeft || global.movingRight) && !global.sliding && !global.slidingCooldown) {
                global.sliding = true;
                global.hero.style.width = '50px';
                global.slidingCooldown = true;
                global.speed += 5;

                setTimeout(() => {
                    global.speed -= 5;
                    global.sliding = false;
                    global.hero.style.width = '100px';
                }, 500);

                setTimeout(() => {
                    global.slidingCooldown = false;
                }, 1000);
            }
        }

        if (!global.movingLeft && !global.movingRight && !global.isSwinging) {
            changeDirection();
        }

        if (global.isJumping) {
            global.velocityY += global.gravity;
            global.heroY -= global.velocityY;
            if (global.heroY <= 0) {
                global.heroY = 0;
                global.velocityY = 0;
                global.isJumping = false;
            }
        }
    }

    global.hero.style.left = global.heroX + 'px';
    global.hero.style.bottom = global.heroY + 'px';
    global.ground.style.backgroundPositionX = -global.offset + 'px';

    updateGoldenBallPosition();
    checkGoldenBallCollision();
    updateEnemyPosition();
    checkEnemyCollision();

    requestAnimationFrame(gameScript);
    updateCoins();

};

// ─── Jump ─────────────────────────────────────────────────────────────────

const jump = () => {
    if (global.isJumping) return;
    if (global.isDead) return;
    global.isJumping = true;
    global.velocityY = global.jumpForce;
};

// ─── Punch ────────────────────────────────────────────────────────────────

const punch = () => {
    if (global.isSwinging) return;
    if (global.isDead) return;

    global.isSwinging = true;
    global.enemyHitThisSwing = false;

    global.hero.src = global.PunchImageSrc;
    global.hero.style.width = '175px';
    global.hero.style.transform =
        global.direction === 'left'
            ? 'scaleX(-1) translateY(35px)'
            : 'translateY(35px)';

    setTimeout(() => {
        if (global.movingLeft) {
            global.hero.src = global.RunLeftImageSrc;
            global.hero.style.transform = 'scaleX(-1)';
        } else if (global.movingRight) {
            global.hero.src = global.RunImageSrc;
            global.hero.style.transform = 'scaleX(1)';
        } else {
            changeDirection();
        }
        global.hero.style.width = global.sliding ? '50px' : '100px';
        global.isSwinging = false;
    }, 200);
};

// ─── Events ───────────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD') global.movingRight = true;
    if (e.code === 'KeyA') global.movingLeft = true;
    if (e.code === 'Space') jump();
    if (e.code === 'KeyS') global.movingDown = true;
    if (e.code === 'KeyH') {
        global.debugHitboxes = !global.debugHitboxes;
        console.log("Debug hitboxes:", global.debugHitboxes ? 'aan' : 'uit');
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') global.movingRight = false;
    if (e.code === 'KeyA') global.movingLeft = false;
    if (e.code === 'KeyS') global.movingDown = false;
});

window.addEventListener('click', punch);
window.addEventListener('load', setup);