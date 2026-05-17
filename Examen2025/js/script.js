const global = {
    currentUser: null,
    messages: [],
    timer: null,
}

const setup = () => {
    const sendBtn = document.getElementById('send-button');
    const clearBtn = document.getElementById('clear-all');
    const users = document.getElementById('message-sender').children;

    if (sessionStorage.getItem('currentUser')) {
        global.currentUser = sessionStorage.getItem('currentUser');
    } else {
        const randomNumber = Math.floor(Math.random() * users.length);
        global.currentUser = users[randomNumber].value;
        sessionStorage.setItem('currentUser', global.currentUser);
    }

    Array.from(users).find(u => u.value === global.currentUser).selected = true;


    sendBtn.addEventListener('click', sendMessage);
    clearBtn.addEventListener('click', clearChat);
    global.timer = setInterval(checkMessages, 1000);
}

const sendMessage = () => {
    const inhoudMessage = document.getElementById('message-input');
    const selectedUser = document.getElementById('message-sender').value;

    if (inhoudMessage.value.trim() === "") return;

    const message = {
        id: Date.now(),
        sender: selectedUser,
        text: inhoudMessage.value,
        timestamp: new Date().toDateString() + " " + new Date().toLocaleTimeString(),
    }

    const stored = JSON.parse(localStorage.getItem('messages') || '[]');
    stored.push(message);
    localStorage.setItem('messages', JSON.stringify(stored));

    inhoudMessage.value = "";
    checkMessages();

    inhoudMessage.focus();

}

const deleteMessage = (id) => {
    const bevestiging = confirm("Wil je dit bericht verwijderen?");
    if (!bevestiging) return;

    const stored = JSON.parse(localStorage.getItem('messages') || '[]');
    const gefilterd = stored.filter(m => m.id !== id);
    localStorage.setItem('messages', JSON.stringify(gefilterd));

    global.messages = global.messages.filter(m => m.id !== id);

    const el = document.getElementById(`msg-${id}`);
    if (el) el.remove();
}

const checkMessages = () => {
    const stored = JSON.parse(localStorage.getItem('messages') || '[]');
    const chatruimte = document.getElementById('chat-box');

    global.messages = global.messages.filter(m => {
        if (!stored.find(s => s.id === m.id)) {
            const el = document.getElementById(`msg-${m.id}`);
            if (el) el.remove();
            return false;
        }
        return true;
    });

    stored.forEach(msg => {
        if (!global.messages.find(m => m.id === msg.id)) {
            global.messages.push(msg);

            const message = document.createElement("div");
            message.classList.add('message');
            message.id = `msg-${msg.id}`;

            if (msg.sender === global.currentUser) {
                message.classList.add('same-user');
            }

            const sender = document.createElement("span");
            sender.classList.add('sender');
            sender.textContent = msg.sender;

            if (msg.sender === global.currentUser) {
                const deleteBtn = document.createElement("button");
                deleteBtn.addEventListener('click', () => deleteMessage(msg.id));
                sender.appendChild(deleteBtn);
            }

            const timestamp = document.createElement("span");
            timestamp.classList.add('timestamp');
            timestamp.textContent = msg.timestamp;

            message.appendChild(sender);
            message.appendChild(timestamp);
            message.append(" " + msg.text);

            chatruimte.prepend(message);
        }
    });
}

const clearChat = () => {
    localStorage.removeItem('messages');
    global.messages = [];
    document.getElementById('chat-box').innerHTML = "";
}

window.addEventListener('load', setup);