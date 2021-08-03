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
    usersArr.addUser("myAdminId", "12345", ["admin"])
    usersArr.addUser("myUserId", "12345", ["user"]);
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
    let choices = ["Login as anothor user",
        "Create a user",
        "Update user role",
        "Edit a role",
        "Add a resource",
        "List all Roles",
        "List all Resources",
        "List all Users"
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


            break;
        case 3:


            break;
        case 4:


            break;
        case 5:


            break;
        default:
            break
    }



}

const createUser = async()=>{

    let userId, password, isExit = false;

    console.log("Create a new user");
    // INPUT USERID
    while(1){
        let ans1 = await inquirer.prompt([{
            type: 'input',
            name: "userId",
            message: `Enter the userId`,
        }])

        // admin is exiting the process
        if(ans1.userId == "exit()"){
            isExit = true;
            break;
        }

        let isValidUserId = true;
        // TODO validate the userId
        if(isValidUserId){
            userId = ans1.userId
            break;
        }
    }

    if(isExit){
        return;
    }

    // INPUT
    while(1){
        let ans2 = await inquirer.prompt([{
            type: 'input',
            name: "password",
            message: `Enter the password(password will be shown for admin only).`,
        }])

        // admin is exiting the process
        if(ans2.password == "exit()"){
            isExit = true;
            break;
        }

        let isValidPassword = true;
        // TODO validate the password
        if(isValidPassword){
            password = ans2.password
            break;
        }
    }

    if(isExit){
        return;
    }
    
    // ask for role
    usersArr.addUser(userId, password, ["user"]);
    console.log("User created with default role as `user`");

    
    

}

const handleNormalUser = async () => {
    let choices = ['Login as another user', 'View roles', 'access roles']

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
