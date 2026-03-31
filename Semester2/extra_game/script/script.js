const global = {
    ground: document.querySelector('.ground'),
    hero: document.querySelector('.hero'),
    rustImage: document.querySelector('.hero'),

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
    sliding: false, // sliding flag

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

    heroHP: 150,
    heroDmg: 20,
    heroBoostedDmg: 40,
    heroHitCooldown: false,
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

    // HP-balk container
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

    // HP-balk vulling
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

    spawnGoldenBall();
    spawnEnemy();
    script();
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
        global.heroX + 100 > screenX &&
        global.heroY < ballSize + 10
    ) {
        collectGoldenBall();
    }
};

const collectGoldenBall = () => {
    global.goldenBall.style.display = 'none';
    global.goldenBallVisible = false;
    global.heroHP = 150;

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

    setTimeout(() => {
        global.enemy.style.display = 'none';
        global.enemyHP = global.enemyMaxHP;
        setTimeout(spawnEnemy, 2000);
    }, 400);
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
    }

    const screenX = global.enemyWorldX - global.worldOffset;
    global.enemy.style.left = screenX + 'px';
    global.enemyHPBar.style.left = screenX + 'px';
    global.enemyHPBar.style.bottom = (global.enemyWidth + 10) + 'px';

    if (screenX < -200) killEnemy();
};

// Floating damage number
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

const checkEnemyCollision = () => {
    if (!global.enemyVisible) return;

    const screenX = global.enemyWorldX - global.worldOffset;
    const size = global.enemyWidth;
    const overlapping =
        global.heroX < screenX + size &&
        global.heroX + 100 > screenX &&
        global.heroY < size;

    if (!overlapping) {
        global.enemyHitThisSwing = false;
        return;
    }

    if (global.isSwinging && !global.enemyHitThisSwing) {
        global.enemyHitThisSwing = true;
        global.enemyHP -= global.heroDmg;
        updateEnemyHPBar();
        spawnDamageNumber(screenX, global.heroDmg);

        global.enemyKnockback = screenX > global.heroX ? 15 : -15;

        global.enemy.style.filter = 'brightness(3) sepia(1) hue-rotate(-30deg)';
        setTimeout(() => { global.enemy.style.filter = ''; }, 150);

        if (global.enemyHP < 1) killEnemy();
    }

    if (!global.heroHitCooldown) {
        global.heroHP -= global.enemyDmg;
        global.heroHitCooldown = true;
        setTimeout(() => { global.heroHitCooldown = false; }, 800);
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
    global.rustImage.style.width = '100px';
};

// ─── Game Loop ────────────────────────────────────────────────────────────

const script = () => {
    // ─── Horizontale beweging ───
    if (global.movingRight) {
        global.direction = 'right';
        if (!global.isSwinging) {
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
        if (!global.isSwinging) {
            global.hero.src = global.RunLeftImageSrc;
            global.hero.style.transform = 'scaleX(-1)';
        }
        if (global.heroX > global.leftBound) global.heroX -= global.speed;
        else {
            global.worldOffset -= global.speed;
            global.offset = ((global.worldOffset % global.tileWidth) + global.tileWidth) % global.tileWidth;
        }
    }

    // ─── Sliding / Crouch ───
    // ─── Sliding / Crouch ───
    if (global.movingDown) {
        if ((global.movingLeft || global.movingRight) && !global.sliding && !global.slidingCooldown) {
            global.sliding = true;
            global.slidingCooldown = true; // start cooldown
            global.speed += 5;
            console.log("Sliding gestart, speed:", global.speed);

            setTimeout(() => {
                global.speed -= 5;
                global.sliding = false;
                console.log("Sliding afgelopen, speed terug:", global.speed);
            }, 500); // sliding duration

            // reset cooldown na 1 seconde
            setTimeout(() => {
                global.slidingCooldown = false;
                console.log("Sliding is weer beschikbaar");
            }, 1000);
        } else if (!global.movingLeft && !global.movingRight) {
            console.log("Crouch");
        }
    }

    // ─── Idle richting ───
    if (!global.movingLeft && !global.movingRight && !global.isSwinging) {
        changeDirection();
    }

    // ─── Springen ───
    if (global.isJumping) {
        global.velocityY += global.gravity;
        global.heroY -= global.velocityY;
        if (global.heroY <= 0) {
            global.heroY = 0;
            global.velocityY = 0;
            global.isJumping = false;
        }
    }

    global.hero.style.left = global.heroX + 'px';
    global.hero.style.bottom = global.heroY + 'px';
    global.ground.style.backgroundPositionX = -global.offset + 'px';

    updateGoldenBallPosition();
    checkGoldenBallCollision();
    updateEnemyPosition();
    checkEnemyCollision();

    requestAnimationFrame(script);
};

// ─── Jump ─────────────────────────────────────────────────────────────────

const jump = () => {
    if (global.isJumping) return;
    global.isJumping = true;
    global.velocityY = global.jumpForce;
};

// ─── Punch ────────────────────────────────────────────────────────────────

const punch = () => {
    if (global.isSwinging) return;

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
        global.hero.style.width = '100px';
        global.isSwinging = false;
    }, 200);
};

// ─── Events ───────────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD') global.movingRight = true;
    if (e.code === 'KeyA') global.movingLeft = true;
    if (e.code === 'Space') jump();
    if (e.code === 'KeyS') global.movingDown = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') global.movingRight = false;
    if (e.code === 'KeyA') global.movingLeft = false;
    if (e.code === 'KeyS') global.movingDown = false;
});

window.addEventListener('click', punch);
window.addEventListener('load', setup);