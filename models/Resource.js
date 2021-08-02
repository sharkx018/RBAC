const { ActionType } = require("./ActionType");

class Resources{

    allResources = [];
    constructor(){
        this.allResources = [];
    }

    addNewResource(resourceName){
        this.allResources.push(new ResourceItem(resourceName));
    }

}

class ResourceItem{
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

module.exports  = { Resources, ResourceItem}