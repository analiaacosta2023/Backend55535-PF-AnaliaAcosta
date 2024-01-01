const purgeBtn = document.getElementById('purge-btn')

let users = []

document.addEventListener('DOMContentLoaded', getUsers)

function getUsers() {
    fetch(`/api/users/`, {
        method: 'GET',
    }).then(result => {

        if (result.status === 200) {
            return result.json().then(data => {
                users = data.payload
                showUsers(users)
            });
        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: " + error.message,
                timer: 5000,
                showConfirmButton: false
            });

        })
}

function showUsers(users) {
    const usersDiv = document.getElementById("users-list");

    usersDiv.innerHTML = ''

    users.forEach((user) => {


        const row = document.createElement("div");
        row.classList.add('row')

        row.id = "row_" + user._id;

        row.innerHTML = `
        <div class="col-1">${user.first_name}</div>
        <div class="col-1">${user.last_name}</div>
        <div class="col-4">${user.email}</div>
        <div class="col-1">${user.role}</div>
        <div class="col-1"><a href="javascript:handleUpdateUser('${user._id}')" class="text-decoration-none">&starf;</a></div>
        <div class="col-1" ><a href="javascript:handleDeleteUser('${user._id}')" class="text-decoration-none">&cross;</a></div>
        <div class="col-3">${user.last_connection}</div>
`;

        usersDiv.append(row);
    })
}

function handleUpdateUser(userId) {

    if (!userId) {
        Swal.fire({
            toast: true,
            position: "top-right",
            text: "Error: No se encontró usuario",
            timer: 5000,
            showConfirmButton: false
        })
        return
    }
    updateUser(userId);
}

function handleDeleteUser(userId) {

        if (!userId) {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: No se encontró usuario",
                timer: 5000,
                showConfirmButton: false
            })
            return
        }

        deleteUser(userId);

}

function updateUser(uid) {
    fetch(`/api/users/premium/${uid}`, {
        method: 'PUT',
    }).then(result => {

        if (result.status === 200) {
            return result.json().then(data => {
                const updatedUser = data.payload

                users = users.map(user => (user._id === uid ? updatedUser : user))

                showUsers(users)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: "Se cambió el rol del usuario",
                    timer: 5000,
                    showConfirmButton: false
                });
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: " + error.message,
                timer: 5000,
                showConfirmButton: false
            });

        })
}
function deleteUser(id) {
    fetch(`/api/users/${id}`, {
        method: 'DELETE',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const deletedUser = data.payload
                
                users = users.filter(user => deletedUser._id !== user._id)

                showUsers(users)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: `Se eliminó el usuario ${id}`,
                    timer: 5000,
                    showConfirmButton: false
                });
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: " + error.message,
                timer: 5000,
                showConfirmButton: false
            });

        })
}

purgeBtn.addEventListener('click', function (event) {

    event.preventDefault();

    purgeUsers();
    

});

function purgeUsers() {

    fetch(`/api/users/`, {
        method: 'DELETE',
    }).then(result => {

        if (result.status === 200) {

            return result.json().then(data => {

                const deletedUsers = data.payload.users
                
                users = users.filter(user => !deletedUsers.find(deletedUser => deletedUser._id === user._id))

                showUsers(users)

                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: "Se eliminaron los usuarios inactivos",
                    timer: 5000,
                    showConfirmButton: false
                });
            });
        } else if(result.status === 204) {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "No hay usuarios inactivos",
                timer: 5000,
                showConfirmButton: false
            });

        } else {
            return result.json().then(errorData => {
                throw new Error(errorData.error);
            });
        }
    })
        .catch(error => {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: " + error.message,
                timer: 5000,
                showConfirmButton: false
            });

        })
}