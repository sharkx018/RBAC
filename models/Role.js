let { ResourceItem } = require("./Resource");
let { ActionType } = require("./ActionType");


class Role {

    // allRoles: [RoleItem]
    allRoles = [];

    constructor() {

        this.allRoles = [];
    }

    addNewRole(roleName, resourcePermissionArr = []) {
        this.allRoles.push(new RoleItem(roleName, resourcePermissionArr));
    }

}

class RoleItem {
    roleName = "";
    // availableResources: [{ actionType: ActionType, resource: ResourceItem }];
    availableResources = [];


    // constructor(roleName: string, resources: ResourceItem[]) {
    constructor(roleName, resourcePermissionArr = []) {

        this.roleName = roleName;
        resourcePermissionArr.forEach(p=>{
            this.availableResources.push({
                resource: new ResourceItem(p.name),
                actionType: new ActionType(p.write, p.read, p.delete)
            })
        })
        
        
        // this.availableResources.add({
        //     resource: new ResourceItem("DASHBOARD"),
        //     actionType: new ActionType()
        // })

    }
}

// let allRoles = [
//     new Role("admin"),
//     new Role("user"),
//     new Role("writer"),
//     new Role("content-writer"),
//     new Role("agent")

// ]

module.exports = { Role, RoleItem }