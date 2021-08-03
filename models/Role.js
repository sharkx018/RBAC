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

    constructor(roleName, resourcePermissionArr = []) {

        this.roleName = roleName;
        resourcePermissionArr.forEach(p => {
            this.availableResources.push({
                resource: new ResourceItem(p.name),
                actionType: new ActionType(p.write, p.read, p.delete)
            })
        })
    }

    upsertResourcePermission(resourceName, write = false, read = false, del = false) {

        let idx = this.availableResources.findIndex(p => p.resource.name == resourceName);

        if (idx == -1) {
            this.availableResources.push({
                resource: new ResourceItem(resourceName),
                actionType: new ActionType(write, read, del)
            })
        } else {
            this.availableResources[idx].actionType = new ActionType(write, read, del)
        }

    }

}

module.exports = { Role, RoleItem }