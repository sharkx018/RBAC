const inquirer = require('inquirer');


exports.askForLogin = async (usersArr) => {
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
        // console.log(ans);
    let x = usersArr.allUsers.find(user => user.userId == ans.username && user.password == ans.pass)

    if (x != null) {
    
        loggedInUser = x;
    } else {
        console.log("Incorrect Credentials");
    }

    return x;

}

exports.getAllResources = (resourcesArr) => {
    return resourcesArr.allResources.map(p => p.name);
}