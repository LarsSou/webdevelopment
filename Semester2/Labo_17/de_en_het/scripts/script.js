const VervangDeDoorHet = () => {
    let zin = "Gisteren zat de jongen op de stoep en at de helft van de appel";
    let start = 0;
    let spatiePosB = 0;
    let spatiePosities = [];
    let words = [];

    while (true) {
        spatiePosB = zin.indexOf(" ", spatiePosB);
        if (spatiePosB === -1) {
            break;
        }
        spatiePosities.push(spatiePosB);
        spatiePosB++;
    }
    for (let i = 0; i < spatiePosities.length; i++) {

        let woord = zin.substring(start, spatiePosities[i]);
        words.push(woord);

        start = spatiePosities[i] + 1;
    }
    words.push(zin.substring(start));

    for (let i = 0; i < words.length; i++) {
        if (words[i] === "de") {
            words[i] = "het";
        }
    }
    let answer = words.join(" ");
    console.log(answer);
}
window.addEventListener('load', VervangDeDoorHet);