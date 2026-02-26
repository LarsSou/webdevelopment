// Alles terug tonen
function showAllLabos() {

    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.style.display = "inline-block";
        dropdown.querySelector(".dropdown-content").style.display = "none";
    });

    document.querySelectorAll(".labo").forEach(l => {
        l.style.display = "block";
    });
}


//input wordt gezocht
const searchInput = document.getElementById("searchInput");
//alles die overeenkomt
const suggestionsBox = document.getElementById("suggestions");
//alles dat begint met labo
const labos = Array.from(document.querySelectorAll(".labo"))
    .map(l => l.dataset.labo);

// Zoekfunctie
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!query) {
        suggestionsBox.style.display = "none";
        showAllLabos();
        return;
    }

    const matches = labos.filter(l =>
        l.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    matches.forEach(labo => {
        const div = document.createElement("div");
        div.textContent = labo;
        div.classList.add("suggestion-item");

        div.addEventListener("click", () => {
            searchInput.value = labo;
            suggestionsBox.style.display = "none";
            showOnlyLabo(labo);
        });

        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
});

function showOnlyLabo(selectedLabo) {

    document.querySelectorAll(".dropdown").forEach(dropdown => {

        const labo = dropdown.querySelector(`[data-labo="${selectedLabo}"]`);
        const content = dropdown.querySelector(".dropdown-content");

        if (labo) {
            dropdown.style.display = "inline-block";
            content.style.display = "block";

            dropdown.querySelectorAll(".labo").forEach(l => {
                l.style.display = l.dataset.labo === selectedLabo ? "block" : "none";
            });

        } else {
            dropdown.style.display = "none";
        }

    });
}


