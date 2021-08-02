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

const seedUsers = () => {
    usersArr.addUser("myAdminId", "admin")
    usersArr.addUser("myUserId", "user")

}

const seedRoles = () => {
    roleArr.addNewRole("admin", [{ name: DASHBOARD, write: true, read: true, delete: true },
    { name: ACTIVITY, write: true, read: true, delete: true },
    { name: REPORT, write: true, read: true, delete: true },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])

    roleArr.addNewRole("user", [{ name: DASHBOARD, write: true, read: true, delete: true },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])

}

const seedData = () => {

    seedResources();
    seedRoles();
    seedUsers();

}

const main = () => {
    seedData();

    console.log(usersArr.allUsers);
    // console.log(JSON.stringify(roleArr.allRoles, null, 2));
    // console.log(resourcesArr.allResources);
}


main();
