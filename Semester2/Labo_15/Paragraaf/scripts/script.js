let belangrijkP = document.getElementsByClassName("belangrijk");

for (let i = 0; i < belangrijkP.length; i++) {
    belangrijkP[i].className += " opvallend";
    console.log(belangrijkP[i].className);
}
