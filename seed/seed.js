let { DASHBOARD, ACTIVITY, REPORT, NOTIFICATION } = require('./types');

const seedResources = (resourcesArr) => {
    resourcesArr.addNewResource(DASHBOARD);
    resourcesArr.addNewResource(ACTIVITY);
    resourcesArr.addNewResource(REPORT);
    resourcesArr.addNewResource(NOTIFICATION);
}


const seedRoles = (roleArr) => {
    roleArr.addNewRole("admin", [{ name: DASHBOARD, write: true, read: true, delete: true },
    { name: ACTIVITY, write: true, read: true, delete: true },
    { name: REPORT, write: true, read: true, delete: true },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])

    roleArr.addNewRole("user", [{ name: DASHBOARD, write: true, read: true, delete: false },
    { name: NOTIFICATION, write: true, read: true, delete: true }
    ])
}

const seedUsers = (usersArr) => {
    usersArr.addUser("adminId", "123", ["admin"])
    usersArr.addUser("userId", "123", ["user"]);
}


exports.seedData = (resourcesArr, roleArr, usersArr) => {

    seedResources(resourcesArr);
    seedRoles(roleArr);
    seedUsers(usersArr);
    
    // console.log(usersArr.allUsers);
    // console.log(JSON.stringify(roleArr.allRoles, null, 2));
    // console.log(resourcesArr.allResources);

    // let isAccessable = checkRolePermission("myUserId", DASHBOARD, "DELETE");
    // console.log("isAccessable", isAccessable);

}

// seedData();