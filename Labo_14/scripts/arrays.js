const Familienamen = ['Deak', 'Bonte', 'Verbeke', 'Southcott', 'Debaere'];
console.log(Familienamen.length);
console.log(Familienamen[0], Familienamen[2], Familienamen[4]);


const VoegNaamToe = () => {
    let extraNaam = prompt("Welke naam wil je erbij?");
        Familienamen.unshift(extraNaam);
};

VoegNaamToe();
console.log(Familienamen);

console.log(Familienamen.join(' - '))
