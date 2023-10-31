function addToCart(cid, pid) {

    fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
    }).then(result => {

        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Se agregó el producto al carrito",
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

            console.log(error.message)
        })
}