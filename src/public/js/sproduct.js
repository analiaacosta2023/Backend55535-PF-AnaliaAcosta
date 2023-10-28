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


addToCartBtn.addEventListener('click', () => {
    const productId = addToCartBtn.getAttribute('data-product-id');
    const cartId = addToCartBtn.getAttribute('data-cart-id');
    console.log(productId)
    console.log(cartId)
    addToCart(cartId, productId)
});


