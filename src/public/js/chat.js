const socket = io();
const chatBox = document.getElementById('chatBox');
const sendMessageButton = document.getElementById('sendMessageButton');

let user
let messages

document.addEventListener("DOMContentLoaded", async () => {

    await fetch('api/sessions/current', {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

            user = data.payload;
            sendMessageButton.addEventListener('click', evt => {
                newMessage()

            })    
            socket.emit('authenticated', user);  
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            window.location.replace('/login')
        });

})




function newMessage() {
    if (chatBox.value.trim().length > 0) {

        if (user.role === 'admin') {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: Admin no autorizado",
                timer: 5000,
                showConfirmButton: false
            })
            return
        }

        socket.emit('message', { message: chatBox.value, user: user._id })
        chatBox.value = "";

    }
}

socket.on('messageLogs', data => {

    if (!user) return;
    let log = document.getElementById('messageLogs');
    messages = "";
    data.forEach(message => {
        if(message.user){
            messages = messages + `${message.user.first_name} dice: ${message.message} </br>`
        } else {
            messages = messages + `Usuario eliminado dice: ${message.message} </br>`
        }

    })
    log.innerHTML = messages;

})

socket.on('newUserConnected', data => {
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Nuevo usuario conectado",
        title: `${data.first_name} ${data.last_name} se ha unido al chat`,
        timer: 5000,
        showConfirmButton: false
    })
})

socket.on('error', error => {

    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Error",
        title: `${error}`,
        timer: 5000,
        showConfirmButton: false
    })
})