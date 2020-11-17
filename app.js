const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const joi = require('joi');
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const arrayOfObjects = [];
const questions = [
    {
        type: 'list',
        message: 'Select a title:',
        choices: ['Manager', 'Engineer', 'Intern'],
        name: 'title'
    },
    {
        type: 'input',
        message: "Enter employee's name:",
        name: 'name',
        validate: validateName
    },
    {
        type: 'input',
        message: 'Enter an id:',
        name: 'id'
    },
    {
        type: 'input',
        message: 'Enter an email address:',
        name: 'email'
    },
    {
        type: 'input',
        message: 'Enter an office number:',
        name: 'officeNumber',
        when: answers => answers.title === 'Manager'
    },
    {
        type: 'input',
        message: 'Enter a GitHub username:',
        name: 'gitHubName',
        when: answers => answers.title === 'Engineer'
    },
    {
        type: 'input',
        message: 'Enter the name of a school:',
        name: 'school',
        when: answers => answers.title === 'Intern'
    },
    {
        type: 'list',
        message: 'another employee?',
        name: 'back',
        choices: ['yes','no']
    }
];
async function ask() {
   await inquirer
        .prompt(questions)
        .then(answers => {
            if (answers.title === 'Manager') {
                const managerOb = new Manager(answers.name, answers.id, answers.email, answers.officeNumber);
                arrayOfObjects.push(managerOb);
            }
            if (answers.title === 'Engineer') {
                const engineerOb = new Engineer(answers.name, answers.id, answers.email, answers.gitHubName);
                arrayOfObjects.push(engineerOb);
            }
            if (answers.title === 'Intern') {
                const internOb = new Intern(answers.name, answers.id, answers.email, answers.school);
                arrayOfObjects.push(internOb);
            }
            console.log('Recorded: ' + answers.name);
            if (answers.back === 'yes') {
                return ask();
            }
        });
}

function validateName(input) {
const reg = /[A-Za-z]+/;
return reg.test(input) || "Name should include letters only and at least one character!"
}

async function renderHtml() {
    const response = await render(arrayOfObjects);
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.writeFileSync(outputPath, response);
    } else {
        fs.mkdirSync(OUTPUT_DIR);
        fs.writeFileSync(outputPath, response);
    }
}

ask().then(renderHtml);