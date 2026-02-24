
const setup = () => {

    const buttons = document.querySelectorAll(".button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("blauw");
        });
    });
}
window.addEventListener("load", setup);

