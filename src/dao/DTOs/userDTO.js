export default class UserDTO {
    constructor(user) {
        // DTO usado para guardar el nombre separado del apellido en github passport strategy
        this.first_name = user.name ? user.name.split(" ")[0] : user.first_name,
            this.last_name = user.name ? user.name.split(" ")[user.name.split(" ").length - 1] : user.last_name,
            this.email = user.email,
            this.password = user.password,
            this.age = user.age,
            this.cart = user.cart,
            this.role = user.role

    }
}