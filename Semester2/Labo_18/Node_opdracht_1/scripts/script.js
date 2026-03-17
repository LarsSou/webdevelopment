const setup = () => {

    let p = document.querySelectorAll('p')[0]
    let y = p.childNodes[0]
    p.removeChild(y);
    let textNode = document.createTextNode("Good job");
    p.appendChild(textNode);
}
window.addEventListener("load", setup);