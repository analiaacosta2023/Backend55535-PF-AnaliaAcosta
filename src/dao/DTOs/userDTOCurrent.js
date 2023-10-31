export default class UserDTOCurrent {
    constructor(user) {
        // DTO usado cuando se llama la estrategia current
        this._id = user._id ? user._id : user.id,
        this.first_name = user.first_name,
            this.last_name = user.last_name,
            this.email = user.email,
            this.age = user.age,
            this.cart = user.cart,
            this.role = user.role
    }
}