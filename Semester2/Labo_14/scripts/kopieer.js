
const kopieer = () => {
    let txtInput = document.getElementById("txtInput");
    let tekst = txtInput.value;

    let output = document.getElementById("txtOutput");
    output.innerHTML = tekst;

    console.log(tekst);
}
let btnKopieer = document.getElementById("btnKopieer");
btnKopieer.addEventListener("click", kopieer);

