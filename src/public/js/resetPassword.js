const form = document.getElementById('resetForm');

const sendCode = document.getElementById('send-code')

const emailInput = form.querySelector('input[name="email"]');

sendCode.addEventListener('click', e => {
    e.preventDefault();

    const emailInput = form.querySelector('input[name="email"]');

    const email = emailInput.value;

    fetch('api/sessions/resetPassword', {
        method: 'POST',
        body: JSON.stringify({email}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => {
        if (result.status === 200) {

            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Se envió el código de recuperación a tu email",
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
            timer: 10000,
            showConfirmButton: false
        });
    });
});



form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);


    fetch('api/sessions/restartPassword', {
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
                console.log(error.message)
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
    form.reset();
})