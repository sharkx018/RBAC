const inquirer = require('inquirer');
const{getAllResources} = require('./common')

exports.isAdmin = (user) => {

    for (let i in user.roles) {
        if (user.roles[i] == "admin") {
            return true;
        }
    }
    return false;
}

exports.createUser = async (usersArr) => {

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


exports.listAllUsers = async (usersArr, roleArr) => {

    let choices = ["List all users", "List user on the basis of role"]

    let ans1 = await inquirer.prompt([{
        type: 'list',
        name: "type",
        message: `List all users`,
        choices
    }])


    switch (choices.indexOf(ans1.type)) {
        case 0:
            logAllUsersByRole(usersArr);
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

            logAllUsersByRole(usersArr, ans2.role);
            break;

        default:
            break;
    }




}

const logAllUsersByRole = (usersArr, role = null) => {

    console.log("List of all userId(s):");
    for (let i in usersArr.allUsers) {
        let idx = usersArr.allUsers[i].roles.findIndex(p => p == role);
        if (idx != -1 || role == null) {
            console.log(usersArr.allUsers[i].userId);
        }
    }

}

exports.updateUserRole = async (usersArr, roleArr) => {


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
        let isValidUser = findUserById(ans1.userId, usersArr);
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

    let roleInfoArr = getRoleInfoForUser(user, roleArr);


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

const getRoleInfoForUser = (user, roleArr) => {

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

const findUserById = (userId, usersArr) => {

    let user = usersArr.allUsers.find(user => user.userId == userId);

    return user;

}

exports.addNewRole = async (roleArr) => {

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


exports.listAllRoles = (roleArr) => {

    console.log("List of all the roles:");

    for (let i in roleArr.allRoles) {
        console.log(`${+i + 1} ${roleArr.allRoles[i].roleName}`);
    }

}

exports.editRole = async (roleArr, resourcesArr) => {
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

    let resourceDetailsArr = getResoureceDetailsForGivenRole(ans1.roleChoice, roleArr, resourcesArr); //TODO

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

    updateRoleForGivenResource(ans1.roleChoice, resourceName, actionType, roleArr); //TODO

}

const getResoureceDetailsForGivenRole = (role, roleArr, resourcesArr) => {

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

const updateRoleForGivenResource = (roleName, resourceName, actionType, roleArr) => {

    // find the roleObj forom role table
    let roleItem = roleArr.allRoles.find(p => p.roleName == roleName)
    // console.log(roleItem);
    roleItem.upsertResourcePermission(resourceName, actionType.write.toLowerCase() == 'true', actionType.read.toLowerCase() == 'true', actionType.delete.toLowerCase() == 'true');

}


exports.addResource = async (resourcesArr) => {

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


exports.listAllResources = (resourcesArr) => {
    console.log("List of all the resources");
    let allResources = getAllResources(resourcesArr);

    for (let i in allResources) {
        console.log(`${+i + 1} ${allResources[i]}`);
    }
}
