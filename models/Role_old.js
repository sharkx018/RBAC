class Role{

    allRoles = [];
    constructor(){
        this.allRoles = [];
    }

    addNewRole(roleName){
        this.allRoles.push(new RoleItem(roleName));
    }

}

class RoleItem{
    constructor(name){
        this.name = name;
    }
}

// let allRoles = [
//     new Role("admin"),
//     new Role("user"),
//     new Role("writer"),
//     new Role("content-writer"),
//     new Role("agent")

// ]

module.exports  = { Role, RoleItem}