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
  name: "github",
  message: "Please input engineers Github Username",
};
const schoolPrompt = {
  name: "school",
  message: "Please input intern's school",
};

const employeeObject = [];

// TODO: Write Code to gather information about the development team members, and render the HTML file.

function teamMemberPrompt(input) {
  inquirer
    .prompt([
      {
        name: "name",
        message: "Please input the employees name:",
      },
      {
        name: "id",
        message: "Please input the employees ID",
      },
      {
        name: "email",
        message: "Please input the employees email address",
      },
      input,
    ])
    .then((ans) => {
      if (ans.github) {
        let { name, id, email, github } = ans;
        employeeObject.push(new Engineer(name, id, email, github));
      } else if (ans.school) {
        let { name, id, email, school } = ans;
        employeeObject.push(new Intern(name, id, email, school));
      }
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
      console.log(outputPath);
      const html = render(employeeObject);
      fs.writeFile(outputPath, html);
    });
}
// * Create an HTML file using the HTML returned from the `render` function.
//   * Write it to a file named `team.html` in the `output` folder.
//   * You can use the provided variable `outputPath` to target this location.

function initPrompt() {
  console.log(
    "Welcome to this Team Profile Generator, please input the requested information."
  );
  inquirer
    .prompt([
      {
        name: "name",
        message: "Please input the team manager's name:",
      },
      {
        name: "id",
        message: "Please input the Managers ID",
      },
      {
        name: "email",
        message: "Please input the Manager's email address",
      },
      {
        name: "officeNum",
        message: "Please input the office number",
      },
    ])
    .then((manager) => {
      let { name, id, email, officeNum } = manager;
      employeeObject.push(new Manager(name, id, email, officeNum));
      buildTeam();
    });
}

initPrompt();
