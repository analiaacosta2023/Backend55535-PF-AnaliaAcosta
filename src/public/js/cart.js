function addToCart(cid, pid) {

    fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
    }).then(result => {

        if (result.status === 200) {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Se agregó el producto al carrito",
                timer: 10000,
                showConfirmButton: false
            });
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
                timer: 10000,
                showConfirmButton: false
            });

            console.log(error.message)
        })
}

function cartCounter() {

    const totalCart = countProducts();

    const countCart = document.querySelector("#badgeCart");
    countCart.innerHTML = totalCart;

}

function countProducts() {

    let productCount = 0;

    user.cart.products.forEach((product) => {

        productCount += product.quantity;

    })

    return productCount;

}