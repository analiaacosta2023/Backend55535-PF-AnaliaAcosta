const socket = io()

const addProductForm = document.getElementById('add-product-form');
if (addProductForm) {
    addProductForm.addEventListener('submit', evt => {
        evt.preventDefault();

        const code = document.getElementById('code').value.trim();
        const title = document.getElementById('title').value.trim();
        const category = document.getElementById('category').value.trim();
        const description = document.getElementById('description').value.trim();
        const price = document.getElementById('price').value.trim();
        const stock = document.getElementById('stock').value.trim();

        const product = {
            title,
            description,
            code,
            price,
            stock,
            category
        }

        socket.emit('new-product', { message: product })
        
        addProductForm.reset();

    })
}

const deleteProductForm = document.getElementById('delete-product-form');
if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', evt => {
        evt.preventDefault();

        const productId = document.getElementById('product-id').value.trim();

        socket.emit('delete-product', { message: productId })

        deleteProductForm.reset();

    })
}

socket.on('products', data => {

    const itemContainer = document.getElementById('item-container');
    itemContainer.innerHTML = `<div class="row">
    <div class="col-3">ID</div>
                <div class="col-2">Código</div>
                <div class="col-3">Título</div>
                <div class="col-2">Categoría</div>
                <div class="col-1">Precio</div>
                <div class="col-1">Stock</div></div>`

    data.forEach((producto) => {

        let prod = document.createElement("div");
        prod.classList.add('row');
        prod.innerHTML = `            <div class="col-3">${producto._id}</div>
                <div class="col-2">${producto.code}</div>
                <div class="col-3">${producto.title}</div>
                <div class="col-2">${producto.category}</div>
                <div class="col-1">$ ${producto.price}</div>
                <div class="col-1">${producto.stock}</div>`
        itemContainer.appendChild(prod);
    })

})

socket.on('error', error => {
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Error",
        title: `${error}`,
        timer: 5000,
        showConfirmButton: false
    })
})