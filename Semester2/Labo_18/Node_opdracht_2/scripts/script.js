const setup = () => {
    let li = document.querySelectorAll('li')

    for(let i = 0; i<li.length; i++) {
        li[i].setAttribute('class', 'listitem')
        li[i].style.color = 'red';
    }
    let element = document.createElement('img');
    element.setAttribute('src', 'img/foto.png');
    element.setAttribute('alt', 'foto');
    element.style.width = '100px';
    document.querySelector("body").appendChild(element);
}
window.addEventListener("load", setup);