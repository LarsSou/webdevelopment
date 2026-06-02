const global={
    current_user: null,
    messages: null,

};
const setup =() =>{
    const randomNmbr = Math.floor(1+Math.random()*4)
    document.bu("")
    console.log(document.getElementById("message-sender").value);
}


window.addEventListener("load",setup);