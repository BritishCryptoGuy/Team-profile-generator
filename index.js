const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const githubPrompt = {
  name: "githubUsername",
  message: "Please input engineers Github Username",
};
const schoolPrompt = {
  name: "schoolName",
  message: "Please input intern's school",
};

const employeeObject = [];

// TODO: Write Code to gather information about the development team members, and render the HTML file.

function teamMemberPrompt(input) {
  inquirer
    .prompt([
      {
        name: "employeeName",
        message: "Please input the employees name:",
      },
      {
        name: "employeeID",
        message: "Please input the employees ID",
      },
      {
        name: "employeeEmail",
        message: "Please input the employees email address",
      },
      input,
    ])
    .then((ans) => {
      if (ans.githubUsername) {
        ans.engineer = true;
      } else {
        ans.intern = true;
      }
      employeeObject.push(ans);
      buildTeam();
    });
}

function buildTeam() {
  inquirer
    .prompt({
      type: "list",
      name: "addMember",
      message: "What team member would you like to add?",
      choices: ["Engineer", "Intern", "Finish building the team"],
    })
    .then((ans) => {
      if (ans.addMember === "Engineer") {
        return teamMemberPrompt(githubPrompt);
      } else if (ans.addMember === "Intern") {
        return teamMemberPrompt(schoolPrompt);
      }
      console.log("Lets make this HTML!");
      console.log(employeeObject);
    });
}

function initPrompt() {
  console.log(
    "Welcome to this Team Profile Generator, please input the requested information."
  );
  inquirer
    .prompt([
      {
        name: "managerName",
        message: "Please input the team manager's name:",
      },
      {
        name: "managerID",
        message: "Please input the Managers ID",
      },
      {
        name: "managerEmail",
        message: "Please input the Manager's email address",
      },
      {
        name: "officeNumber",
        message: "Please input the office number",
      },
    ])
    .then((manager) => {
      manager.manager = true;
      employeeObject.push(manager);
      buildTeam();
    });
}

initPrompt();
