let { Role } = require('./models/Role');
let { User } = require('./models/User')
let { Resources } = require('./models/Resource')
let { DASHBOARD, ACTIVITY, REPORT, NOTIFICATION } = require('./types')

let usersArr = new User()
let roleArr = new Role();
let resourcesArr = new Resources();


const seedResources = () => {
    resourcesArr.addNewResource(DASHBOARD);
    resourcesArr.addNewResource(ACTIVITY);
    resourcesArr.addNewResource(REPORT);
    resourcesArr.addNewResource(NOTIFICATION);
}


const seedRoles = () => {
    roleArr.addNewRole("admin", [{ name: DASHBOARD, write: true, read: true, delete: true },
    { name: ACTIVITY, write: true, read: true, delete: true },
    { name: REPORT, write: true, read: true, delete: true },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])

    roleArr.addNewRole("user", [{ name: DASHBOARD, write: true, read: true, delete: false },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])
}

const seedUsers = () => {
    usersArr.addUser("myAdminId", "admin")
    usersArr.addUser("myUserId", "user")
}


const seedData = () => {

    seedResources();
    seedRoles();
    seedUsers();

}

const main = () => {
    seedData();

    console.log(usersArr.allUsers);
    console.log(JSON.stringify(roleArr.allRoles, null, 2));
    console.log(resourcesArr.allResources);

    let isAccessable = checkRolePermission("myUserId", DASHBOARD, "DELETE");
    console.log("isAccessable", isAccessable);
}

const checkRolePermission = (userId, resourceRequested, requestedActionType) => {

    let user = usersArr.allUsers.find(p => p.userId == userId);
    if (user == null) {
        console.log("No user Found");
        return false;
    }

    let roleItem = roleArr.allRoles.find(p => p.roleName == user.role)

    console.log("==>>>>>",roleItem);


    let resourceAccess = roleItem.availableResources.find(p => p.resource.name == resourceRequested);

    if (resourceAccess == null) {
        console.log("No access found");
        return false;
    }

    let flag = false;

    switch (requestedActionType) {
        case "READ":
            flag = resourceAccess.actionType.read == true
            break;
        case "WRITE":
            flag = resourceAccess.actionType.write == true
            break;
        case "DELETE":
            flag = resourceAccess.actionType.delete == true
            break;
        default:
            break;
    }

    return flag;

}


main();
