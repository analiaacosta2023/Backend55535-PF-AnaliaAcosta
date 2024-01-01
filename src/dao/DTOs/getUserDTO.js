const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // Use 24-hour format
};

export default class getUserDTO {
    constructor(user) {
        // DTO usado cuando se hace un get user (no en sessions)
        this._id = user._id;
            this.first_name = user.first_name;
            this.last_name = user.last_name;
            this.email = user.email;
            this.cart = user.cart;
            this.role = user.role;
            this.last_connection = user.last_connection.toLocaleString('en-US', options)
    }
}