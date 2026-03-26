const global = {
    ground: document.querySelector('.ground'),
    hero: document.querySelector('.hero'),

    tileWidth: 500,
    speed: 5,
    offset: 0,

    heroX: window.innerWidth / 2,
    heroY: 0,           // huidige hoogte boven de grond
    velocityY: 0,       // sprong snelheid
    gravity: 0.8,       // zwaartekracht
    jumpForce: -15,     // hoe hoog hij springt (negatiever = hoger)
    isJumping: false,

    leftBound: 200,
    rightBound: 0,

    movingRight: false,
    movingLeft: false,
    isSwinging: false,
};

const setup = () => {
    global.hero.style.position = 'absolute';
    global.hero.style.width = '100px';
    global.hero.style.bottom = '0px';
    global.heroX = window.innerWidth / 2;
    global.rightBound = window.innerWidth - global.leftBound - global.hero.offsetWidth;

    movement();
};

const movement = () => {
    if (global.movingRight) {
        if (global.heroX < global.rightBound) {
            global.heroX += global.speed;
        } else {
            global.offset = (global.offset + global.speed) % global.tileWidth;
        }
    }

    if (global.movingLeft) {
        if (global.heroX > global.leftBound) {
            global.heroX -= global.speed;
        } else {
            global.offset = (global.offset - global.speed + global.tileWidth) % global.tileWidth;
        }
    }

    // Sprong fysica
    if (global.isJumping) {
        global.velocityY += global.gravity;
        global.heroY -= global.velocityY;

        // Landen op de grond
        if (global.heroY <= 0) {
            global.heroY = 0;
            global.velocityY = 0;
            global.isJumping = false;
        }
    }

    global.hero.style.left = global.heroX + 'px';
    global.hero.style.bottom = global.heroY + 'px';
    global.ground.style.backgroundPositionX = -global.offset + 'px';

    requestAnimationFrame(movement);
};

const jump = () => {
    if (global.isJumping) return; // Geen dubbel springen

    global.isJumping = true;
    global.velocityY = global.jumpForce;
};

const punch = () => {
    if (global.isSwinging) return;

    global.isSwinging = true;
    global.hero.src = 'images/hero_punch.png';
    global.hero.style.width = '175px';
    global.hero.style.transform = 'translateY(35px)';

    setTimeout(() => {
        global.hero.src = 'images/hero.png';
        global.hero.style.width = '100px';
        global.hero.style.transform = 'translateY(0px)';
        global.isSwinging = false;
    }, 200);
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyD') global.movingRight = true;
    if (e.code === 'KeyA') global.movingLeft = true;
    if (e.code === 'Space') jump();
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') global.movingRight = false;
    if (e.code === 'KeyA') global.movingLeft = false;
});

window.addEventListener('click', punch);
window.addEventListener('load', setup);