let {Role, RoleItem} = require('./Role')

class User{
    allUsers = [];
    constructor(){
        this.allUsers = [];
    }

    addUser(userId, role) {
        this.allUsers.push(new UserItem(userId, role))
    }

}


class UserItem{

    constructor(userId, role){
        this.userId = userId,
        this.role = role
    }
}

// let allUsers = [
//     new User("myAdmin", new Role("admin"))
// ]

module.exports = {
    User, UserItem
}