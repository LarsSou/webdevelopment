const setup = () => {
    let button = document.getElementById('button');
    button.addEventListener('click', split);
}

const split = () => {
    let stringInput = document.getElementById('input').value;

    // alle spaties verwijderen
    stringInput = stringInput.replaceAll(" ", "");

    let message = "";

    for (let i = 0; i < stringInput.length; i++) {
        message += stringInput.charAt(i) + " ";
    }

    console.log(message.trim());
}

window.addEventListener('load', setup);