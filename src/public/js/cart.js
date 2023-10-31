let cart
let subtotal
let total

let shippingPrice

const cartDiv = document.querySelector('#cart-id');
const cartId = cartDiv.getAttribute('data-cart-id');

document.addEventListener("DOMContentLoaded", () => {

    initCart(cartId)

})

function initCart(cid) {

    fetch(`/api/carts/${cid}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cart = data.payload;
            showCart(cart)
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function showCount(products) {

    const count = countProducts(products)

    const counter = document.querySelector("#cart-badge");

    if (count === 0) {
        counter.innerHTML = 'No hay productos en el carrito'
    } else {
        counter.innerHTML = `${count} items`
    }


}

function countProducts(products) {

    let acc = 0;
    if (products.length > 0) {
        products.forEach((product) => {

            acc += product.quantity;

        })
    }

    return acc;
}

function showCart(cart) {

    const { products } = cart

    showCount(products)
    showSubtotal(products)
    showTotal()

    const productsDiv = document.getElementById("cart-products");

    productsDiv.innerHTML = ''

    products.forEach((product) => {


        const row = document.createElement("div");
        row.classList.add('row')
        row.classList.add('border-top')


        const img = product.product.thumbnail[0]
        const pid = product.product._id
        const stock = product.product.stock
        row.id = "row_" + pid;

        row.innerHTML = `
<div class="row main align-items-center">
        <div class="col-2"><img class="img-fluid" src="/img/${img}"></div>
        <div class="col">
            <div class="row text-muted">${product.product.category}</div>
            <div class="row">${product.product.title}</div>
        </div>
        <div class="col d-flex justify-content-center align-items-center">
        <button class="btn btn-dark less-quantity handle-quantity" data-product-id="${pid}" data-product-quantity="${product.quantity - 1}" style="--bs-btn-padding-y: .2rem; --bs-btn-padding-x: .4rem; --bs-btn-font-size: 1rem;">-</button>
        <p class="mx-2 my-0">${product.quantity}</p>
        <button class="btn btn-dark more-quantity handle-quantity" data-product-id="${pid}" data-product-quantity="${product.quantity + 1}" style="--bs-btn-padding-y: .2rem; --bs-btn-padding-x: .4rem; --bs-btn-font-size: 1rem;">+</button>
        </div>
        <div class="col d-flex justify-content-center">$ ${product.product.price}</div>
        <div class="col d-flex justify-content-center"><span class="close" data-product-id="${pid}" >&#10005;</span></div>
    </div>
`;

        productsDiv.append(row);

        const lessQuantityButton = row.querySelector('.less-quantity');

        if (product.quantity <= 1) {
            lessQuantityButton.disabled = true;
        } else {
            lessQuantityButton.disabled = false;
        }

        const moreQuantityButton = row.querySelector('.more-quantity');

        if (product.quantity >= stock) {
            moreQuantityButton.disabled = true;
        } else {
            moreQuantityButton.disabled = false;
        }

    })

}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('close')) {
        const productId = event.target.getAttribute('data-product-id');
        deleteProduct(productId);
    }
});

function deleteProduct(pid) {

    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cart = data.payload;
            showCart(cart)
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

document.addEventListener('click', function (event) {
    if (event.target.classList.contains('handle-quantity')) {
        const productId = event.target.getAttribute('data-product-id');
        const productQ = event.target.getAttribute('data-product-quantity');
        handleQuantity(productId, productQ);
    }
});

function handleQuantity(pid, productQ) {

    const Data = {
        quantity: productQ
    }

    fetch(`/api/carts/${cartId}/product/${pid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            cart = data.payload;
            showCart(cart)
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}

function handleSubtotal(products) {

    let acc = 0;
    if (products.length > 0) {
        products.forEach((product) => {

            acc += product.quantity * product.product.price;

        })
    }

    return acc;

}

function showSubtotal(products) {

    subtotal = handleSubtotal(products)

    const subtotalDiv = document.querySelector("#subtotal");

    if (subtotal === 0) {
        subtotalDiv.innerHTML = ''
    } else {
        subtotalDiv.innerHTML = `&dollar; ${subtotal.toFixed(2)}`
    }

}

const selectElement = document.getElementById("shippingSelect");

selectElement.addEventListener("change", showTotal);

const checkoutBtn = document.querySelector('#checkout');
checkoutBtn.addEventListener("click", checkout);

function showTotal() {

    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const totalDiv = document.querySelector("#total");



    if (selectedOption.value === "") {
        totalDiv.innerHTML = ''
        checkoutBtn.disabled = true;
        return;
    }

    shippingPrice = parseInt(selectedOption.value);

    total = subtotal + shippingPrice

    totalDiv.innerHTML = `&dollar; ${total.toFixed(2)}`

    checkoutBtn.disabled = false;

}

function checkout() {

    const email = checkoutBtn.getAttribute('data-user-email');

    const Data = {
        email,
        shippingPrice
    }



    fetch(`/api/carts/${cartId}/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data)
    })
        .then(response => {
            if (!response.ok) {

                return response.json().then(errorData => {
                    throw new Error(`Status ${response.status}, ${errorData.message}`);
                })
            }

            return response.json();
        })
        .then(data => {
            const { ticket, noStockProducts } = data.payload;

            const orderedProducts = ticket.products

            let mssg = ''
            orderedProducts.forEach(product => {
                mssg += `<br> Id ${product.product}: ${product.quantity} unidades`
            })

            if (noStockProducts.length > 0) {
                Swal.fire({
                    icon: 'warning',
                    title: `ticket: ${ticket.code}`,
                    html: `<p>Se realizó su orden parcialmente ${mssg}</p>`
                }).then(() => {
                    location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: `ticket: ${ticket.code}`,
                    html: `<p>Se completó su orden ${mssg}</p>`
                }).then(() => {
                    location.reload();
                });
            }
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: `${error}`,
            })
        });
}