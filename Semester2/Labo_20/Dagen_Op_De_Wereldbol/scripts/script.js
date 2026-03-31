let GeboorteDatum = new Date(2006, 5, 27,18,48 );
console.log(GeboorteDatum);
let vandaag= Date.now();
console.log(vandaag);

let dagenVerschil = (vandaag - GeboorteDatum)/86400000; //86.400.000 is voor van ms naar dagen te gaan
console.log(Math.floor(dagenVerschil));

