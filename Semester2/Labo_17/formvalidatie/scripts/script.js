document.getElementById("valideer").addEventListener("click", valideer);

const valideer(){

    resetErrors();

    checkVoornaam();
    checkFamilienaam();
    checkGeboorte();
    checkEmail();
    checkKinderen();

}

function resetErrors(){

    let inputs = document.querySelectorAll("input");

    inputs.forEach(input => {
        input.classList.remove("error");
        input.nextElementSibling.innerHTML = "";
    });

}

function checkVoornaam(){

    let v = document.getElementById("voornaam");

    if(v.value.length > 30){
        setError(v,"max. 30 karakters");
    }

}

function checkFamilienaam(){

    let f = document.getElementById("familienaam");

    if(f.value === ""){
        setError(f,"verplicht veld");
    }
    else if(f.value.length > 50){
        setError(f,"max 50 karakters");
    }

}

function checkGeboorte(){

    let g = document.getElementById("geboorte");

    if(g.value === ""){
        setError(g,"verplicht veld");
        return;
    }

    let regex = /^\d{4}-\d{2}-\d{2}$/;

    if(!regex.test(g.value)){
        setError(g,"formaat is niet jjjj-mm-dd");
    }

}

function checkEmail(){

    let e = document.getElementById("email");

    if(e.value === ""){
        setError(e,"verplicht veld");
        return;
    }

    let regex = /^[^@]+@[^@]+$/;

    if(!regex.test(e.value)){
        setError(e,"geen geldig email adres");
    }

}

function checkKinderen(){

    let k = document.getElementById("kinderen");

    if(k.value === "" || k.value < 0){
        setError(k,"is geen positief getal");
    }
    else if(k.value >= 99){
        setError(k,"is te vruchtbaar");
    }

}

function setError(input, message){

    input.classList.add("error");
    input.nextElementSibling.innerHTML = message;

}