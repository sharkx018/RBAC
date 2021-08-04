
const inquirer = require('inquirer');
const{getAllResources} = require('./common')



exports.logAllRole = (loggedInUser) => {

    console.log("List of all the roles.")
    for (let i in loggedInUser.roles) {
        console.log(loggedInUser.roles[i]);
    }
}

exports.controlAccess = async (loggedInUser, resourcesArr, roleArr) => {
    let allResources = getAllResources(resourcesArr);
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
    if (isResourceAccessable(loggedInUser, resourceAccessQuery, roleArr)) {
        console.log("True: Resoure is accessable with given action type");
    } else {
        console.log("False: Resoure is not accessable with given action type");
    }
}


const isResourceAccessable = (loggedInUser, resourceAccessQuery, roleArr) => {

    for (let i in loggedInUser.roles) {

        for (let j in roleArr.allRoles) {

            // Role Match
            if (loggedInUser.roles[i] == roleArr.allRoles[j].roleName) {

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


