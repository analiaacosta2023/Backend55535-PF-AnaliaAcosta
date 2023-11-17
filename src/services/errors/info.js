export const generateCreateUserErrorInfo = (user) => {
    return `Una de las propiedas del usuario es incompleta o no valida
    Lista de propiedades:
    * first_name : Se necesita un string, se recibió ${user.first_name}
    * last_name : Se necesita un string, se recibió ${user.last_name}
    * email : Se necesita un string, se recibió ${user.email}`
}

///
export const generateGetCartErrorInfo = (cid) => {
    return `El id ${cid} no corresponde con ningún carrito.`
}

export const generateAddToCartErrorInfo = (pid, cid) => {
    return `Alguno de los parámetros recibidos no existen en la base de datos. Se recibió id ${pid} para producto y id ${cid} para carrito.`
}

///

export const generateEmailErrorInfo = (email) => {
    return `El correo enviado fue rechazado. Verifique su dirección de email.
    Correo registrado: ${email}`
}

///

export const generateGetProductErrorInfo = (pid) => {
    return `El id ${pid} no corresponde con ningún producto.`
}

export const generateAddProductErrorInfo = (product)=> {
    return `Todos los campos son obligatorios. Se recibió: Título: ${product.title}, descripción: ${product.description}, código: ${product.code}, precio: ${product.price}, stock: ${product.stock}, categoría: ${product.category}`
}

///

export const generateGetUserByEmailErrorInfo = (email) => {
    return `Se envió un parámetro inválido, el email ${email} no corresponde con ningún usuario.`
}

///

export const generateAuthorizationErrorInfo = (role) => {
    return `Usuario no autorizado. Se necesita rol de ${role}.`
}

///

export const generateObjectIdErrorInfo = (id) => {
    return `El id ${id} no tiene el formato correcto. Debe estar compuesto por números del 0 al 9 y letras minúsculas de la "a" a la "f", con longitud total es de 24 caracteres.`
}