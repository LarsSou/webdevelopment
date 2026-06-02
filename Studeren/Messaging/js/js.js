const global = {
    currentUser: null,
    currentReceiver: null,
}

const setup = () => {
    const selectboxUser = document.getElementById('currentUser');
    const selectboxReceiver = document.getElementById('textTo');
    const submitButton = document.getElementById('submitButton');

    grantUser();
    grantReceiver();
    validate();
    loadBerichten(); // ← toegevoegd

    selectboxUser.addEventListener('change', userChanged);
    selectboxReceiver.addEventListener('change', receiverChanged);
    submitButton.addEventListener('click', Submitmessage);
}

const Submitmessage = () => {
    const inputElement = document.getElementsByClassName('messageTekst')[0];
    const timestamp = new Date().toLocaleTimeString();

    const message = {
        inhoud: inputElement.value.trim(),
        sender: global.currentUser.text,
        receiver: global.currentReceiver.text,
        time: timestamp,
    }

    if (message.inhoud === '') return;

    const berichten = JSON.parse(localStorage.getItem('berichten')) || [];
    berichten.push(message);
    localStorage.setItem('berichten', JSON.stringify(berichten));

    loadBerichten(); // ← herlaad in plaats van enkel renderMessage
    inputElement.value = '';
}

const loadBerichten = () => {
    const container = document.getElementById('MessageContainer');
    container.querySelectorAll('.bericht').forEach(b => b.remove());

    const berichten = JSON.parse(localStorage.getItem('berichten')) || [];
    const user = global.currentUser.text;

    berichten
        .filter(m => m.sender === user || m.receiver === user)
        .forEach((m, index) => renderMessage(m, index));
}

const renderMessage = (message, index) => {
    const container = document.getElementById('MessageContainer');

    const wrapper = document.createElement('div');
    wrapper.classList.add('bericht');

    const sender = document.createElement('em');
    sender.innerText = message.sender + ' → ' + message.receiver;

    const inhoud = document.createElement('p');
    inhoud.innerText = message.inhoud;

    const time = document.createElement('span');
    time.innerText = message.time;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'X';
    deleteBtn.addEventListener('click', () => {
        // Verwijder uit localStorage op basis van inhoud+tijd+sender
        let berichten = JSON.parse(localStorage.getItem('berichten')) || [];
        berichten = berichten.filter(m =>
            !(m.inhoud === message.inhoud && m.time === message.time && m.sender === message.sender)
        );
        localStorage.setItem('berichten', JSON.stringify(berichten));
        loadBerichten();
    });

    wrapper.appendChild(sender);
    wrapper.appendChild(inhoud);
    wrapper.appendChild(time);
    wrapper.appendChild(deleteBtn);
    container.appendChild(wrapper);
}

const validate = () => {
    while (global.currentUser.value === global.currentReceiver.value) {
        grantReceiver();
    }
}

const userChanged = () => {
    const selectboxUser = document.getElementById('currentUser');
    global.currentUser = selectboxUser.options[selectboxUser.selectedIndex];
    validate();
    loadBerichten();
}

const receiverChanged = () => {
    const selectboxReceiver = document.getElementById('textTo');
    global.currentReceiver = selectboxReceiver.options[selectboxReceiver.selectedIndex];
    validate();
}

const grantUser = () => {
    const userList = document.getElementsByTagName('select')[0];
    const randomIndex = Math.floor(Math.random() * userList.length);
    global.currentUser = userList[randomIndex];
    global.currentUser.selected = true;
}

const grantReceiver = () => {
    const receiverList = document.getElementsByTagName('select')[1];
    const randomIndex = Math.floor(Math.random() * receiverList.length);
    global.currentReceiver = receiverList[randomIndex];
    global.currentReceiver.selected = true;
}

window.addEventListener('load', setup);