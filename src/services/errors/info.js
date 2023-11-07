export const generateCreateUserErrorInfo = (user) => {
    return `Una de las propiedas del usuario es incompleta o no valida
    Lista de propiedades:
    * first_name : Se necesita un string, se recibió ${user.first_name}
    * last_name : Se necesita un string, se recibió ${user.last_name}
    * email : Se necesita un string, se recibió ${user.email}`
}

export const generateGetUserErrorInfo = (uid) => {
    return `Se envió un parámetro inválido para obtener el usuario,
    Se necesita un id de tipo number que se mayor a 0, se recibió ${uid}`
}
///
export const generateGetCartErrorInfo = (cid) => {
    return `Se envió un parámetro inválido,
    el id ${cid} no corresponde con ningún carrito.`
}

export const generateAddToCartErrorInfo = (pid, cid) => {
    return `Alguno de los parámetros recibidos son inválidos. Se recibió id ${pid} para producto y id ${cid} para carrito.`
}

export const generateCleanCartErrorInfo = (cid) => {
    return `Se envió un parámetro inválido para limpiar el carrito,
    El id ${cid} no corresponde con ningún carrito.`
}

///

export const generateInvalidTypeErrorInfo = () => {
    return `Alguno de los parámetros recibidos son inválidos.`
}

///

export const generateEmailErrorInfo = (email) => {
    return `El correo enviado fue rechazado. Verifique su dirección de email.
    Correo registrado: ${email}`
}

///

export const generateGetProductErrorInfo = (pid) => {
    return `Se envió un parametro inválido,
    el id ${pid} no corresponde con ningún producto.`
}

///

export const generateGetUserByEmailErrorInfo = (email) => {
    return `Se envió un parámetro inválido,
    el email ${email} no corresponde con ningún usuario.`
}

///

export const generateAuthorizationErrorInfo = (role) => {
    return `Usuario no autorizado. Se necesita rol de ${role}.`
}