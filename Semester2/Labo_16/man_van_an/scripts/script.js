const setup=()=>{
    let button = document.getElementById("startButton");
        button.addEventListener('click', zoek);

}
let Stop1;
let Stop2;
const zoek=()=>{
    let tekst = document.getElementById('inputfieldText').value.replaceAll(" ", "").toLowerCase();
    let zoek = "an";

    let CharIndexOf = [];
    let i = 0;
    let positie = 0;

    while (true) {

        let gevonden = tekst.indexOf(zoek, positie);

        if (gevonden === -1) break;

        CharIndexOf[i] = gevonden;
        i++;

        positie = gevonden + zoek.length;

    }
    if(!Stop1) {
        document.getElementById("resultFieldIndexOf").value += CharIndexOf.length;
        console.log(CharIndexOf);
        console.log("met indexOf aantal keren 'an':", CharIndexOf.length);
        Stop1=true;
    }

    let CharLastIndexOf = [];
    let j = 0;
    positie = tekst.length;

    while (true) {
        let gevonden = tekst.lastIndexOf(zoek, positie);

        if (gevonden === -1) break;

        CharLastIndexOf[j] = gevonden;
        j++;

        positie = gevonden - 1;
    }
    if(!Stop2){
        document.getElementById("resultFieldLastIndexOf").value += CharLastIndexOf.length;
        console.log(CharLastIndexOf);
        console.log("met lastIndexOf aantal keren 'an':", CharLastIndexOf.length);
        Stop2 = true;

    }



}
window.addEventListener("load", setup);
window.addEventListener("change", function(e) {Stop1=false;Stop2=false})

