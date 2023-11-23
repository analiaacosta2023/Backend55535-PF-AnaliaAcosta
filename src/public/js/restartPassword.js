const restartForm = document.getElementById('restartForm');

restartForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(restartForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    if (obj.password != obj.password2) {
        return Swal.fire({
            toast: true,
            position: "top-right",
            text: "Error: No hay coincidencia entre las contraseñas ingresadas",
            timer: 5000,
            showConfirmButton: false
        });
    }

    fetch('../api/sessions/restartPassword', {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
            window.location.replace('/login')
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
    restartForm.reset();
})