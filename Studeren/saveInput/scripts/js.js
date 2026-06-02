const global={
    teller: 0,
}
const setup = () => {
    const submitBtn = document.getElementById('submitButton');
    const toggleBtn = document.getElementById('toggleButton');

    let spacePlace = document.createElement('div');
    let body = document.getElementsByTagName('body')[0];
    spacePlace.id = 'spacePlace';
    body.prepend(spacePlace);

    const taskId = setInterval(() => toggle(spacePlace), 1);
    submitBtn.addEventListener('click', () => {

        const name = document.getElementById("input").value;
        const inhoud = document.getElementById("inhoud").value;
        const color = document.getElementById("colors").value;

        if(validateInput(inhoud, inhoud) === false) {
            return;
        }
        makeCard(name, inhoud, color);
        saveCard({ naam: name, inhoud: inhoud, color: color });

    });
};
const toggle=(div)=>{
    global.teller++;
    if(global.teller %2){
        div.classList.toggle('RedBackground');
    }
    else if(global.teller %3){
        div.classList.toggle('GreenBackground');

    }
    else if(global.teller %4){
        div.classList.toggle('BlueBackground');

    }
    else if(global.teller %5){
        div.classList.toggle('WhiteBackground');

    }
    else{
        div.classList.toggle('RedBackground');
    }

}

const validateInput = (name, inhoud) => {
    if((name==="")||(inhoud==="")){
        return false
    }
}

const makeCard = (naam, inhoud, color) => {
    let cardBox = document.createElement("div");
    cardBox.className = "cardBoxSessionStorage";
    cardBox.style.backgroundColor = color;
    cardBox.style.padding = "10px";
    cardBox.style.margin = "10px";

    let pNaam = document.createElement("p");
    let pInhoud = document.createElement("p");
    let pDate = document.createElement("p");

    pNaam.textContent = naam;
    pInhoud.textContent = inhoud;
    pDate.textContent = new Date().toLocaleDateString("nl-be");

    cardBox.appendChild(pNaam);
    cardBox.appendChild(pInhoud);
    cardBox.appendChild(pDate);

    document.getElementById("outputDiv").appendChild(cardBox);
};

const saveCard = (cardObject) => {
    let cards = JSON.parse(sessionStorage.getItem("myCards")) || [];
    cards.push(cardObject);
    sessionStorage.setItem("myCards", JSON.stringify(cards));
};

const loadCard = () => {
    let cards = JSON.parse(sessionStorage.getItem("myCards")) || [];
    cards.forEach(card => {
        makeCard(card.naam, card.inhoud, card.color);
    });
};

const SetLocalStorage = () => {
    let counter = JSON.parse(localStorage.getItem("counter"))|| [];
    counter++;
    localStorage.setItem("counter", counter);
    let counterElement = document.getElementById("counter");
    counterElement.textContent = counter;
}


window.addEventListener('DOMContentLoaded', () => {
    setup();
    loadCard();
    SetLocalStorage();
});