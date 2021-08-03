const inquirer = require('inquirer');


let { Role } = require('./models/Role');
let { User } = require('./models/User')
let { Resources } = require('./models/Resource')
let { DASHBOARD, ACTIVITY, REPORT, NOTIFICATION } = require('./types');
const { async } = require('rxjs');

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
    usersArr.addUser("adminId", "123", ["admin"])
    usersArr.addUser("userId", "123", ["user"]);
}


const seedData = () => {

    seedResources();
    seedRoles();
    seedUsers();

}

let loggedInUser = null;

const main = async () => {

    seedData();

    // console.log(usersArr.allUsers);
    // console.log(JSON.stringify(roleArr.allRoles, null, 2));
    // console.log(resourcesArr.allResources);

    // let isAccessable = checkRolePermission("myUserId", DASHBOARD, "DELETE");
    // console.log("isAccessable", isAccessable);

    while (1) {

        if (loggedInUser == null) {
            await askForLogin()
            continue;
        }

        if (isAdmin(loggedInUser)) {
            await handleAdmin();
        } else {
            await handleNormalUser();
        }
    }
}

const handleAdmin = async () => {
    let choices = [
        "Login as anothor user",        //0 =======

        "Create a user",                //1 =======
        "View all Users",               //2             all or on basis of roles
        "Update user's role",           //3 =======

        "Add new Role",                 //4 ======
        "View all Roles",               //5 ======
        "Edit a role",                  //6 ======

        "Add a resource",               //7 ======
        "View all Resources",           //8 ======

    ]

    let ans = await inquirer.prompt([{
        type: 'list',
        name: "ans1",
        message: `Hi, you are logged in as ${loggedInUser.userId}`,
        choices
    }])

    switch (choices.indexOf(ans.ans1)) {
        case 0:
            await askForLogin();
            break;
        case 1:
            await createUser();
            break;
        case 2:
            await listAllUsers();
            break;
        case 3:
            await updateUserRole();
            break;

        case 4:
            await addNewRole();
            break;

        case 5:
            listAllRoles();
            break;
        case 6:
            await editRole();
            break;

        case 7:
            await addResource()
            break;
        case 8:
            await listAllResources();
            break;
        default:
            break
    }



}

const listAllUsers = async () => {


    let choices = ["List all users", "List user on the basis of role"]

    let ans1 = await inquirer.prompt([{
        type: 'list',
        name: "type",
        message: `List all users`,
        choices
    }])


    switch (choices.indexOf(ans1.type)) {
        case 0:
            logAllUsersByRole();
            break;

        case 1:
            let allRoles = [];
            for (let i in roleArr.allRoles) {
                allRoles.push(`${roleArr.allRoles[i].roleName}`);
            }

            let ans2 = await inquirer.prompt([{
                type: 'list',
                name: "role",
                message: `Select a role to filter the users`,
                choices: allRoles
            }])

            logAllUsersByRole(ans2.role);
            break;

        default:
            break;
    }

   


}

const logAllUsersByRole = (role = null) => {

    console.log("List of all userId(s):");
    for (let i in usersArr.allUsers) {
        let idx = usersArr.allUsers[i].roles.findIndex(p => p == role);
        if (idx != -1 || role == null) {
            console.log(usersArr.allUsers[i].userId);
        }
    }



}

const updateUserRole = async () => {


    let user;
    let isExit = false;

    // input the resource name 
    while (1) {
        let ans1 = await inquirer.prompt([{
            type: 'input',
            name: "userId",
            message: `Enter the userId, type exit() to cancel.`,
        }])

        // admin is exiting the process
        if (ans1.userId == "exit()") {
            isExit = true;
            break;
        }

        // find if the valid user exists or not
        let isValidUser = findUserById(ans1.userId);
        if (isValidUser) {
            user = isValidUser
            break;
        } else {
            console.log("No user found, Please try again.");
        }

    }
    if (isExit) {
        return;
    }

    let roleInfoArr = getRoleInfoForUser(user);


    let ans2 = await inquirer.prompt([{
        type: 'list',
        name: "roleInfo",
        message: `Select the role to update.`,
        choices: roleInfoArr
    }])

    let [role, status] = parseRoleInfo(ans2.roleInfo);

    let ans3;
    switch (status) {
        case "ASSIGNED":
            ans3 = await inquirer.prompt([{
                type: 'list',
                name: "bool",
                message: `Are you sure to remove the role.`,
                choices: ["Yes", "No"]
            }])

            break;
        case "NOT-ASSIGNED":
            ans3 = await inquirer.prompt([{
                type: 'list',
                name: "bool",
                message: `Are you sure to assign the role.`,
                choices: ["Yes", "No"]
            }])
            break;
        default:
            break;
    }

    if (ans3.bool == "Yes") {
        user.toogleRole(role);
    }

}

const getRoleInfoForUser = (user) => {

    let allRoleInfo = [];
    for (let i in roleArr.allRoles) {
        let roleName = roleArr.allRoles[i].roleName
        let idx = user.roles.findIndex(p => p == roleName);
        if (idx != -1) {
            allRoleInfo.push(`${roleName} (ASSIGNED)`)
        } else {
            allRoleInfo.push(`${roleName} (NOT-ASSIGNED)`)
        }
    }
    return allRoleInfo;

}

const parseRoleInfo = (roleInfoItem) => {
    let i = 0;
    let role = "";
    let status = "";
    while (roleInfoItem[i] != " ") {
        role += roleInfoItem[i];
        i++;
    }
    i += 2;

    while (roleInfoItem[i] != ")") {
        status += roleInfoItem[i];
        i++;
    }
    return [role, status];


}

const findUserById = (userId) => {

    let user = usersArr.allUsers.find(user => user.userId == userId);

    return user;

}

const editRole = async () => {
    console.log("List of all the roles:");

    let allRoleChoices = [];

    for (let i in roleArr.allRoles) {
        allRoleChoices.push(`${roleArr.allRoles[i].roleName}`);
    }

    let ans1 = await inquirer.prompt([{
        type: 'list',
        name: "roleChoice",
        message: `Select a role`,
        choices: allRoleChoices
    }])

    let resourceDetailsArr = getResoureceDetailsForGivenRole(ans1.roleChoice); //TODO

    let ans2 = await inquirer.prompt([{
        type: 'list',
        name: "resourceItem",
        message: `Select the resource`,
        choices: resourceDetailsArr
    }])

    let resourceName = parseResourceName(ans2.resourceItem); //TODO

    let actionType = await inquirer.prompt([
        {
            type: 'list',
            name: "read",
            message: `Read permission`,
            choices: ["true", "false"]
        },
        {
            type: 'list',
            name: "write",
            message: `Write permission`,
            choices: ["true", "false"]
        },
        {
            type: 'list',
            name: "delete",
            message: `Delete permission`,
            choices: ["true", "false"]
        }
    ])

    updateRoleForGivenResource(ans1.roleChoice, resourceName, actionType); //TODO

}

const getResoureceDetailsForGivenRole = (role) => {

    let arr = [];

    // find the roleObj forom role table
    let roleObj = roleArr.allRoles.find(p => p.roleName == role)

    for (let i in resourcesArr.allResources) {
        let resourceName = resourcesArr.allResources[i].name;

        let permissionForResource = roleObj.availableResources.find(p => p.resource.name == resourceName);
        if (permissionForResource == null) {
            arr.push(`${resourceName} ( Read = fasle, Write = false, Delete = false )`);
        } else {
            arr.push(`${resourceName} ( Read = ${permissionForResource.actionType.read}, Write = ${permissionForResource.actionType.write}, Delete = ${permissionForResource.actionType.delete} )`);
        }

    }

    return arr;

}

const parseResourceName = (resourceItem) => {

    let resourceName = "";
    let i = 0;
    while (resourceItem[i] != ' ') {
        resourceName += resourceItem[i];
        i++;
    }
    return resourceName

}

const updateRoleForGivenResource = (roleName, resourceName, actionType) => {

    // find the roleObj forom role table
    let roleItem = roleArr.allRoles.find(p => p.roleName == roleName)
    // console.log(roleItem);

    roleItem.upsertResourcePermission(resourceName, actionType.write.toLowerCase() == 'true', actionType.read.toLowerCase() == 'true', actionType.delete.toLowerCase() == 'true');


}

const addNewRole = async () => {

    // make a new entry and include all the resouces arr in it.

    let roleName = "";
    let isExit = false;

    // input the resource name 
    while (1) {
        let ans1 = await inquirer.prompt([{
            type: 'input',
            name: "roleName",
            message: `Enter the role name`,
        }])

        // admin is exiting the process
        if (ans1.roleName == "exit()") {
            isExit = true;
            break;
        }

        // TODO validate the resource for duplication
        let isValidRole = true;
        if (isValidRole) {
            roleName = ans1.roleName
            break;
        } else {
            console.log("Not a valid role, Please try again.");
        }

    }
    if (isExit) {
        return;
    }

    roleArr.addNewRole(roleName);


}

const listAllRoles = () => {

    console.log("List of all the roles:");

    for (let i in roleArr.allRoles) {
        console.log(`${+i + 1} ${roleArr.allRoles[i].roleName}`);
    }

}


const listAllResources = () => {
    console.log("List of all the resources");
    let allResources = getAllResources();

    for (let i in allResources) {
        console.log(`${+i + 1} ${allResources[i]}`);
    }


}

const addResource = async () => {

    console.log("Add Resource");

    let resName = "";
    let isExit = false;

    // input the resource name 
    while (1) {
        let ans1 = await inquirer.prompt([{
            type: 'input',
            name: "resourceName",
            message: `Enter the resource name`,
        }])

        // admin is exiting the process
        if (ans1.resourceName == "exit()") {
            isExit = true;
            break;
        }

        // TODO validate the resource for duplication
        let isValidResource = true;
        if (isValidResource) {
            resName = ans1.resourceName
            break;
        }

    }

    if (isExit) {
        return;
    }

    // add in the resource arr;
    resourcesArr.addNewResource(resName);


}

const createUser = async () => {

    let userId, password, isExit = false;

    console.log("Create a new user");
    // INPUT USERID
    while (1) {
        let ans1 = await inquirer.prompt([{
            type: 'input',
            name: "userId",
            message: `Enter the userId`,
        }])

        // admin is exiting the process
        if (ans1.userId == "exit()") {
            isExit = true;
            break;
        }

        let isValidUserId = true;
        // TODO validate the userId
        if (isValidUserId) {
            userId = ans1.userId
            break;
        }
    }

    if (isExit) {
        return;
    }

    // INPUT
    while (1) {
        let ans2 = await inquirer.prompt([{
            type: 'input',
            name: "password",
            message: `Enter the password(password will be shown for admin only).`,
        }])

        // admin is exiting the process
        if (ans2.password == "exit()") {
            isExit = true;
            break;
        }

        let isValidPassword = true;
        // TODO validate the password
        if (isValidPassword) {
            password = ans2.password
            break;
        }
    }

    if (isExit) {
        return;
    }

    // ask for role
    usersArr.addUser(userId, password, ["user"]);
    console.log("User created with default role as `user`");




}

const handleNormalUser = async () => {
    let choices = ['Login as another user', 'View my current roles', 'Access resource']

    let ans = await inquirer.prompt([{
        type: 'list',
        name: 'ans1',
        message: `Hi, you are logged in as ${loggedInUser.userId}`,
        choices: choices,
    }])

    switch (choices.indexOf(ans.ans1)) {
        case 0:
            await askForLogin();
            break;
        case 1:
            logAllRole(loggedInUser);
            break;
        case 2:
            let allResources = getAllResources();
            let actionType = ["WRITE", "READ", "DELETE"]
            let resourceAccessQuery = await inquirer.prompt([{
                type: 'list',
                name: 'resource',
                message: 'Please select the resouce',
                choices: allResources
            },
            {
                type: 'list',
                name: 'actionType',
                message: 'Please select the actionType',
                choices: actionType
            }])

            // ask about resourse and action type
            if (isResourceAccessable(loggedInUser, resourceAccessQuery)) {
                console.log("True: Resoure is accessable with given action type");
            } else {
                console.log("False: Resoure is not accessable with given action type");
            }


            break;
        default:
            break;
    }
}


const askForLogin = async () => {
    console.log("Welcome to the Login");
    let ans = await inquirer
        .prompt([
            {
                type: 'input',
                name: 'username',
                message: 'Enter your username',
            },
            {
                type: 'password',
                name: 'pass',
                message: 'Enter the password',
            },
        ])

    let x = usersArr.allUsers.find(user => user.userId == ans.username && user.password == ans.pass)

    if (x != null) {
        loggedInUser = x;
    } else {
        console.log("Incorrect Credentials");
    }

}

const logAllRole = (loggedInUser) => {

    // console.log("==>>>>", loggedInUser);

    console.log("List of all the roles.")
    for (let i in loggedInUser.roles) {
        console.log(loggedInUser.roles[i]);
    }
}

// const checkRolePermission = (userId, resourceRequested, requestedActionType) => {

//     let user = usersArr.allUsers.find(p => p.userId == userId);
//     if (user == null) {
//         console.log("No user Found");
//         return false;
//     }

//     let roleItem = roleArr.allRoles.find(p => p.roleName == user.role)

//     // console.log("==>>>>>",roleItem);


//     let resourceAccess = roleItem.availableResources.find(p => p.resource.name == resourceRequested);

//     if (resourceAccess == null) {
//         console.log("No access found");
//         return false;
//     }

//     let flag = false;

//     switch (requestedActionType) {
//         case "READ":
//             flag = resourceAccess.actionType.read == true
//             break;
//         case "WRITE":
//             flag = resourceAccess.actionType.write == true
//             break;
//         case "DELETE":
//             flag = resourceAccess.actionType.delete == true
//             break;
//         default:
//             break;
//     }

//     return flag;

// }

const isResourceAccessable = (loggedInUser, resourceAccessQuery) => {

    // console.log(resourceAccessQuery);

    for (let i in loggedInUser.roles) {

        // console.log("=======+++++++",loggedInUser.roles[i]);

        for (let j in roleArr.allRoles) {

            // Role Match
            if (loggedInUser.roles[i] == roleArr.allRoles[j].roleName) {
                // console.log("=======+++++++",roleArr.allRoles[j]);

                let idx = -1;
                switch (resourceAccessQuery.actionType) {
                    case "READ":
                        idx = roleArr.allRoles[j].availableResources.findIndex(p => p.resource.name == resourceAccessQuery.resource && p.actionType.read == true)
                        break;
                    case "WRITE":
                        idx = roleArr.allRoles[j].availableResources.findIndex(p => p.resource.name == resourceAccessQuery.resource && p.actionType.write == true)
                        break;
                    case "DELETE":
                        idx = roleArr.allRoles[j].availableResources.findIndex(p => p.resource.name == resourceAccessQuery.resource && p.actionType.delete == true)
                        break;
                    default:
                        break;
                }

                if (idx != -1) {
                    return true;
                }

            }
        }
    }

    return false;


}


const isAdmin = (user) => {

    for (let i in user.roles) {
        if (user.roles[i] == "admin") {
            return true;
        }
    }
    return false;
}


const getAllResources = () => {
    return resourcesArr.allResources.map(p => p.name);
}


main();
