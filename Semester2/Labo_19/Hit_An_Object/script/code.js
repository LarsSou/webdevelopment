const setup = () => {
    window.addEventListener("resize", updateSize);

    // al 1 keer op voorhand oproepen, voor het geval
    // dat de gebruiker nooit manueel het browservenster
    // groter of kleiner maakt
    updateSize();
    gui();
    let sprite = document.getElementsByClassName("sprite")[0];
    sprite.addEventListener("click", spritePressed)

}
let global = {
    IMAGE_COUNT: 5,
// aantal figuren
    IMAGE_SIZE: 48, // grootte van de figuur
    IMAGE_PATH_PREFIX: "images/",
// map van de figuren
    IMAGE_PATH_SUFFIX: ".png",
// extensie van de figuren
    MOVE_DELAY: 3000, // aantal ms voor een nieuwe afbeelding verschijnt
    score: 0,
// aantal hits
    timeoutId: 0 // id van de timeout timer, zodat we kunnen annuleren
};
const returnToOrignalState = () =>{
    location.reload();
}

const change = () => {
    let randomCount = Math.floor(Math.random() * global.IMAGE_COUNT);
    let img = document.getElementsByClassName("sprite unselectable")[0];

    img.src = global.IMAGE_PATH_PREFIX + randomCount+global.IMAGE_PATH_SUFFIX;
    img.id = randomCount.toString();
    img.style.height = "10%";

}
const gui = () =>{
    let startButton = document.createElement("button");
    let field = document.getElementById("speelveld");
    let hits = document.createElement('p')
    hits.id = "score"

    startButton.addEventListener("click", startButton.remove)
    startButton.addEventListener("click", startGame)

    startButton.style.position="absolute";
    startButton.textContent="START";

    hits.textContent="Aantal hits: "+global.score;


    field.append(startButton);
    field.append(hits);
    field.style.border = "10px solid black";
    field.style.scale = "75%";
}
const startGame = ()=> {
    global.timeoutId = setInterval(change, global.MOVE_DELAY);
    moveSprite();
}
const updateScore = () => {
    let hits = document.getElementById('score')
    hits.textContent="Aantal hits: "+global.score;
    console.log(global.score);
    console.log(hits);

}
const spritePressed=()=>{

    moveSprite();
    global.score++;
    updateScore();
}

const updateSize = () => {
    // telkens het window van grootte verandert,
    // wordt deze method opgeroepen
    //
    // Merk op dat de <div> voor layout redenen "leeg" is,
    // omdat het enige kind absoluut gepositioneerd is. Als
    // we niets speciaals doen zal het dus 0px hoog zijn.
    // Daarom stellen we hier programmatorisch de breedte
    // en hoogte in, zodat het altijd alle ruimte inneemt.
    let speelveld=document.getElementById("speelveld");
    speelveld.style.width=window.innerWidth+"px";
    speelveld.style.height=window.innerHeight+"px";
}

const moveSprite = () => {

    let sprite=document.getElementsByClassName("sprite")[0];
    if(sprite.id==="1"){
        alert("Game Over!");
        returnToOrignalState()
    }
    else{
    let speelveld=document.getElementById("speelveld");
    let maxLeft=speelveld.clientWidth - sprite.offsetWidth;
    let maxHeight=speelveld.clientHeight - sprite.offsetHeight;

    // verplaats de sprite
    let left=Math.floor(Math.random()*maxLeft);
    let top=Math.floor(Math.random()*maxHeight);
    sprite.style.left=left+"px";
    sprite.style.top=top+"px";
    }
}

window.addEventListener("load", setup);