const splitString = () => {

    const string = document.getElementById("txtInput").value;
    const start = Number(document.getElementById("StartIndex").value);
    const end = Number(document.getElementById("EndIndex").value);

    const result = string.substring(start, end);

    document.getElementById("txtOutput").textContent = result;
};
let pELEMENT = document.getElementById("btnActivate");
pELEMENT.addEventListener("click",splitString);