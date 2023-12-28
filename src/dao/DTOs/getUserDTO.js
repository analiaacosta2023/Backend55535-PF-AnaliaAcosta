export default class getUserDTO {
    constructor(user) {
        // DTO usado cuando se hace un get user (no en sessions)
        this._id = user._id ? user._id : user.id,
        this.first_name = user.first_name,
            this.last_name = user.last_name,
            this.email = user.email,
            this.cart = user.cart._id,
            this.role = user.role
    }
}