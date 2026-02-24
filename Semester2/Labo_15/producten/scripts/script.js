 herbereken= () => {
    const rijen = document.querySelectorAll('tbody tr:not(:last-child)');
    let totaal = 0;

    rijen.forEach(rij => {
        const input = rij.querySelector('input');
        const prijs = parseFloat(input.dataset.prijs);
        const btw = parseFloat(input.dataset.btw);
        const aantal = parseInt(input.value) || 0;
        const subtotaal = aantal * prijs * (1 + btw);
        totaal += subtotaal;
        rij.querySelector('.subtotaal').textContent = subtotaal.toFixed(2) + ' Eur';
    });

    document.getElementById('totaal').textContent = totaal.toFixed(2) + ' Eur';
}