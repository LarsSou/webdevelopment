const v = id => document.getElementById(id).value.trim();
const e = (id, msg) => document.getElementById(id).textContent = msg;
const isGetal = t => !isNaN(t);
const setup = () => {
    document.getElementById("valideer").onclick = () => {
        let ok = true;

        if (v("voornaam").length > 30) {
            e("voornaam-error", "max. 30 karakters"); ok = false;
        } else e("voornaam-error", "");

        let fam = v("familienaam");
        if (fam === "") { e("familienaam-error", "verplicht veld"); ok = false; }
        else if (fam.length > 50) { e("familienaam-error", "max 50 karakters"); ok = false; }
        else e("familienaam-error", "");

        let g = v("geboortedatum");
        if (g === "") { e("geboortedatum-error", "verplicht veld"); ok = false; }
        else if (g.length !== 10 || g[4] !== "-" || g[7] !== "-" ||
            !isGetal(g.substring(0,4)) ||
            !isGetal(g.substring(5,7)) || g.substring(5,7) <= 0 ||
            !isGetal(g.substring(8))   || g.substring(8) <= 0) {
            e("geboortedatum-error", "formaat is niet jjjj-mm-dd"); ok = false;
        } else e("geboortedatum-error", "");

        let mail = v("email"), a = mail.indexOf("@"), b = mail.lastIndexOf("@");
        if (mail === "") { e("email-error", "verplicht veld"); ok = false; }
        else if (a !== b || a <= 0 || a === mail.length - 1) {
            e("email-error", "geen geldig email adres"); ok = false;
        } else e("email-error", "");

        let k = v("aantalKinderen");
        if (!isGetal(k) || k < 0) {
            e("aantalKinderen-error", "is geen positief getal"); ok = false;
        } else if (k >= 99) {
            e("aantalKinderen-error", "is te vruchtbaar"); ok = false;
        } else e("aantalKinderen-error", "");

        if (ok) alert("proficiat!");
    };
};
window.onload = setup;