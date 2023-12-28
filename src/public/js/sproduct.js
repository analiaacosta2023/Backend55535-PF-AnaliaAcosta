let MainImg = document.getElementById("MainImg");
let smallimg = document.getElementsByClassName("small-img");

smallimg[0].onclick = function () {
    MainImg.src = smallimg[0].src;
}
smallimg[1].onclick = function () {
    MainImg.src = smallimg[1].src;
}
smallimg[2].onclick = function () {
    MainImg.src = smallimg[2].src;
}

const addToCartBtn = document.querySelector('.add-to-cart-button');

if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
        const productId = addToCartBtn.getAttribute('data-product-id');
        const cartId = addToCartBtn.getAttribute('data-cart-id');

        if (!productId || !cartId) {
            Swal.fire({
                toast: true,
                position: "top-right",
                text: "Error: No autorizado",
                timer: 5000,
                showConfirmButton: false
            })
            return
        }


        addToCart(cartId, productId)
    });
}

