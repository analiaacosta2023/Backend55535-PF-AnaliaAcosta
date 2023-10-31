const socket = io();
const chatBox = document.getElementById('chatBox');
const sendMessageButton = document.getElementById('sendMessageButton');

let user

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
            socket.emit('authenticated', user);
            sendMessageButton.addEventListener('click', evt => {
                newMessage(user)

            })
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            window.location.replace('/login')
        });

})

function newMessage(user) {
    if (chatBox.value.trim().length > 0) {

        const messageData = {
            user,
            message: chatBox.value
          };

        fetch('api/messages/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {

                const message = data.payload;
                socket.emit('authenticated', user);

                socket.emit('message', message)

                chatBox.value = "";
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });

    }
}


socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs');

    fetch('/api/messages', {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {

                const messages = data.payload;

                let acum = " "

                messages.forEach(message => {

                    if (message.user) {
                        acum += `<p>${message.user.first_name} dice: ${message.message} </p>`
                    }

                })
                log.innerHTML = acum;

        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });



})
socket.on('newUserConnected', user => {
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Nuevo usuario conectado",
        title: `${user.first_name} se ha unido al chat`,
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