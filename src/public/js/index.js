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

        fetch('api/products', {
            method: 'POST',
            body: JSON.stringify(product),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(async (result) => {
    
            if (result.status === 200) {
                socket.emit('product-change', { message: result.payload })
            } else {
                return await result.json().then(errorData => {
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
            })

        
        addProductForm.reset();

    })
}

const deleteProductForm = document.getElementById('delete-product-form');
if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', evt => {
        evt.preventDefault();

        const productId = document.getElementById('product-id').value.trim();

        fetch(`api/products/${productId}`, {
            method: 'DELETE'
        }).then(async (result) => {
    
            if (result.status === 200) {
                socket.emit('product-change', { message: result.payload })
            } else {
                return await result.json().then(errorData => {
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
            })

        deleteProductForm.reset();

    })
}

socket.on('products', data => {

    const itemContainer = document.getElementById('item-container');
    itemContainer.innerHTML = ""

    data.forEach((producto) => {

        let prod = document.createElement("div");
        prod.classList.add('product-card');
        prod.innerHTML = `            <p>id: ${producto._id}</p>
                <p>Código: ${producto.code}</p>
                <p>${producto.title}</p>
                <p>Categoría: ${producto.category}</p>
                <p>${producto.description}</p>
                <p>$ ${producto.price}</p>
                <p>Stock: ${producto.stock} unidades</p>`
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