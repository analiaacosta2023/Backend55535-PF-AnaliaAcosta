const productCards = document.querySelectorAll('.product-card');


productCards.forEach((productCard) => {
    productCard.addEventListener('click', function (event) {

        if (event.target.classList.contains('add-to-cart-button')) {

            event.preventDefault();

            const productId = event.target.getAttribute('data-product-id');
            const cartId = event.target.getAttribute('data-cart-id');
            console.log(cartId)

            addToCart(cartId, productId);
        } else {

            window.location.href = '/products/' + this.getAttribute('key');
        }
    });
});