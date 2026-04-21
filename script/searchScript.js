const setup = () => {
    const searchInput = document.getElementById("searchInput");
    const suggestionsBox = document.getElementById("suggestions");
    const labos = Array.from(document.querySelectorAll(".labo"))
        .map(l => l.dataset.labo);

    // Bug 1 fixed: use navigation API to detect actual reload
    if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
        searchInput.value = "";
    }

    let button = document.getElementById("funButton");
    button.addEventListener("mouseenter", funButton);

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
};

const showAllLabos = () => {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.style.display = "inline-block";
        dropdown.querySelector(".dropdown-content").style.display = "none";
    });

    document.querySelectorAll(".labo").forEach(l => {
        l.style.display = "block";
    });
};

const showOnlyLabo = (selectedLabo) => {
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
};

const funButton = () => {
    let button = document.getElementById("funButton");

    let speelveld = document.getElementsByTagName("body")[0];
    let maxLeft = speelveld.clientWidth - button.offsetWidth;
    let maxHeight = speelveld.clientHeight - button.offsetHeight;

    let left = Math.floor(Math.random() * maxLeft);
    let top = Math.floor(Math.random() * maxHeight);
    button.style.left = left + "px";
    button.style.top = top + "px";
};


window.addEventListener("load", setup);