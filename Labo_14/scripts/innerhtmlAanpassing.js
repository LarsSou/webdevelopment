const sendWelkom = () => {
    let output=document.getElementById("txtOutput");
    output.innerHTML="Welkom!";
}

let pELEMENT = document.getElementById("btn");
pELEMENT.addEventListener("click",sendWelkom)

