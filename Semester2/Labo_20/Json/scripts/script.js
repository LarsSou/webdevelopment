let setup =()=>{
    let student1={
        voornaam: "Lars",
        familienaam: "Southcott",
        geboorteDatum: new Date(2006, 5, 27,18,48 ),

        adres: {
            straat: "Bruggestraat",
            straatNummer: "167",
            gemeente: "Menen",
            postcode: "8930",
        },
        adres: "wordt overschreven",

        hobbys: ["Rugby","Gamen","Studeren"],
    }
    let JsonWaarden = JSON.stringify(student1);
    console.log(JsonWaarden);





    let jsonOmvorming = JSON.parse(JsonWaarden);
    console.log(jsonOmvorming);
}

//DE ISOstring wordt gebruikt voor een "date" object
//alsje meermaals dezelfde naam gebruikt wordt het 2 genomen
window.addEventListener("load", setup);