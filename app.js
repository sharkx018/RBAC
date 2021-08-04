const inquirer = require('inquirer');

let { Role } = require('./models/Role');
let { User } = require('./models/User')
let { Resources } = require('./models/Resource')

const { seedData } = require('./seed/seed');
const { isAdmin, createUser, listAllUsers, updateUserRole, addNewRole, listAllRoles, editRole, addResource, listAllResources } = require('./helpers/admin');
const { askForLogin } = require('./helpers/common')
const { logAllRole, controlAccess } = require('./helpers/user')


let usersArr = new User()
let roleArr = new Role();
let resourcesArr = new Resources();
let loggedInUser = null;

const main = async () => {

    // init seed data
    seedData(resourcesArr, roleArr, usersArr);

    while (1) {

        if (loggedInUser == null) {
            loggedInUser = await askForLogin(usersArr)
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
        "Login as anothor user",        //0 ======

        "Create a user",                //1 ======
        "List all Users",               //2 ======
        "Update user's role",           //3 ======

        "Add new Role",                 //4 ======
        "List all Roles",               //5 ======
        "Edit a role",                  //6 ======

        "Add a resource",               //7 ======
        "List all Resources",           //8 ======

    ]

    let ans = await inquirer.prompt([{
        type: 'list',
        name: "ans1",
        message: `Hi, you are logged in as ${loggedInUser.userId}`,
        choices
    }])

    switch (choices.indexOf(ans.ans1)) {
        case 0:
            loggedInUser = await askForLogin(usersArr);
            break;
        case 1:
            await createUser(usersArr);
            break;
        case 2:
            await listAllUsers(usersArr, roleArr);
            break;
        case 3:
            await updateUserRole(usersArr, roleArr);
            break;

        case 4:
            await addNewRole(roleArr);
            break;

        case 5:
            listAllRoles(roleArr);
            break;
        case 6:
            await editRole(roleArr, resourcesArr);
            break;

        case 7:
            await addResource(resourcesArr)
            break;
        case 8:
            await listAllResources(resourcesArr);
            break;
        default:
            break
    }



}



const handleNormalUser = async () => {
    let choices = [
        'Login as another user',
        'View my current roles',
        'Access resource'
    ]

    let ans = await inquirer.prompt([{
        type: 'list',
        name: 'ans1',
        message: `Hi, you are logged in as ${loggedInUser.userId}`,
        choices: choices,
    }])

    switch (choices.indexOf(ans.ans1)) {
        case 0:
            loggedInUser = await askForLogin(usersArr);
            break;
        case 1:
            logAllRole(loggedInUser);
            break;
        case 2:
            await controlAccess(loggedInUser, resourcesArr, roleArr);
            break;
        default:
            break;
    }
}

main();
