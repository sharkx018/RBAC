let { Role, RoleItem } = require('./Role')

class User {
    allUsers = [];
    constructor() {
        this.allUsers = [];
    }

    addUser(userId, password, roles = []) {
        this.allUsers.push(new UserItem(userId, password, roles))
    }

}


class UserItem {

    constructor(userId, password, roles) {
        this.userId = userId
        this.password = password
        this.roles = roles
    }

    addRole(newRole) {
        this.roles.push(newRole);
    }

    toogleRole(role) {

        let idx = this.roles.findIndex(p => p == role);
        if (idx == -1) {
            this.roles.push(role);
        } else {
            this.roles.splice(idx, 1);
        }

    }

}

// let allUsers = [
//     new User("myAdmin", new Role("admin"))
// ]

module.exports = {
    User, UserItem
}