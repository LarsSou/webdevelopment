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
    isSwinging: false,

    direction: 'right',

    RestImageSrc:      'images/hero_rust.png',
    LinksRestImageSrc: 'images/hero_rust.png',
    PunchImageSrc:     'images/hero_punch.png',
    RunImageSrc:       'images/hero_rust.png',
    RunLeftImageSrc:   'images/hero_rust.png',

    powerUpActive: false,
    powerUpTimer: null,

    goldenBall: null,
    goldenBallVisible: false,
    goldenBallWorldX: 0,
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const setup = () => {
    global.hero.style.position = 'absolute';
    global.hero.style.width    = '100px';
    global.hero.style.bottom   = '0px';
    global.rightBound = window.innerWidth - global.leftBound - global.heroX;

    createGoldenBall();
    spawnGoldenBall();
    movement();
};

// ─── Gouden gloeibal ──────────────────────────────────────────────────────────

const createGoldenBall = () => {
    const ball = document.createElement('div');
    ball.id = 'goldenBall';
    document.body.appendChild(ball);
    global.goldenBall = ball;
};

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

        const screenX  = global.goldenBallWorldX - global.worldOffset;
        const ballSize = 20;

        if (
            global.heroX < screenX + ballSize &&
            global.heroX + 300 > screenX &&
            global.heroY < ballSize + 10
        ) {
            collectGoldenBall();
        }
};

const collectGoldenBall = () => {
    global.goldenBall.style.display = 'none';
    global.goldenBallVisible = false;


    if (global.powerUpTimer) clearTimeout(global.powerUpTimer);

    global.powerUpActive = true;
    global.speed         = global.baseSpeed * 2;
    global.jumpForce     = global.baseJumpForce * 2;

    showPowerUpEffect(true);

    global.powerUpTimer = setTimeout(() => {
        global.speed         = global.baseSpeed;
        global.jumpForce     = global.baseJumpForce;
        global.powerUpActive = false;
        showPowerUpEffect(false);
    }, 5000);

    setTimeout(spawnGoldenBall, Math.random() * Math.random()*10000);

};

const showPowerUpEffect = (active) => {
    global.hero.style.filter = active
        ? 'drop-shadow(0 0 8px gold) brightness(1.3)'
        : '';
};


// ─── Richting & rust-beeld ────────────────────────────────────────────────────

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

// ─── Beweging ─────────────────────────────────────────────────────────────────

const movement = () => {
    const prevOffset = global.offset;

    if (global.movingRight) {
        global.direction = 'right';

        if (!global.isSwinging) {
            global.hero.src = global.RunImageSrc;
            global.hero.style.width = '100px';
            global.hero.style.transform = 'scaleX(1)';
        }

        if (global.heroX < global.rightBound) {
            global.heroX = Math.min(global.heroX + global.speed, global.rightBound);
        } else {
            global.heroX = global.rightBound;
            global.worldOffset += global.speed;
            global.offset = global.worldOffset % global.tileWidth;
        }
    }

    if (global.movingLeft) {
        global.direction = 'left';

        if (!global.isSwinging) {
            global.hero.src = global.RunLeftImageSrc;
            global.hero.style.width = '100px';
            global.hero.style.transform = 'scaleX(-1)';
        }

        if (global.heroX > global.leftBound) {
            global.heroX -= global.speed;
        } else {
            global.worldOffset -= global.speed;
            global.offset = ((global.worldOffset % global.tileWidth) + global.tileWidth) % global.tileWidth;
        }
    }

    // Stilstaand → rust-beeld
    if (!global.movingLeft && !global.movingRight && !global.isSwinging) {
        changeDirection();
    }

    // Springen / zwaartekracht
    if (global.isJumping) {
        global.velocityY += global.gravity;
        global.heroY     -= global.velocityY;

        if (global.heroY <= 0) {
            global.heroY     = 0;
            global.velocityY = 0;
            global.isJumping = false;
        }
    }

    global.hero.style.left   = global.heroX + 'px';
    global.hero.style.bottom = global.heroY + 'px';
    global.ground.style.backgroundPositionX = -global.offset + 'px';

    updateGoldenBallPosition();
    checkGoldenBallCollision();

    requestAnimationFrame(movement);
};

// ─── Springen ─────────────────────────────────────────────────────────────────

const jump = () => {
    if (global.isJumping) return;
    global.isJumping = true;
    global.velocityY = global.jumpForce;
};

// ─── Slaan ────────────────────────────────────────────────────────────────────

const punch = () => {
    if (global.isSwinging) return;

    global.isSwinging = true;

    global.hero.src = global.PunchImageSrc;
    global.hero.style.width = '175px';
    global.hero.style.transform = global.direction === 'left'
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

// ─── Events ───────────────────────────────────────────────────────────────────

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD') global.movingRight = true;
    if (e.code === 'KeyA') global.movingLeft  = true;
    if (e.code === 'Space') jump();
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') global.movingRight = false;
    if (e.code === 'KeyA') global.movingLeft  = false;
});

window.addEventListener('click', punch);
window.addEventListener('load',  setup);