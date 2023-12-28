const productCards = document.querySelectorAll('.product-card');


productCards.forEach((productCard) => {
    productCard.addEventListener('click', function (event) {

        if (event.target.classList.contains('add-to-cart-button')) {

            event.preventDefault();

            const productId = event.target.getAttribute('data-product-id');
            const cartId = event.target.getAttribute('data-cart-id');

            if(!productId || !cartId) {
                Swal.fire({
                    toast: true,
                    position: "top-right",
                    text: "Error: No autorizado",
                    timer: 5000,
                    showConfirmButton: false
                })
                return
            }

            addToCart(cartId, productId);
        } else {

            window.location.href = '/products/' + this.getAttribute('key');
        }
    });
});