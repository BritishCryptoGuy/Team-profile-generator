const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

//prompts stored as variables to make code cleaner, each is called when required
const githubPrompt = {
  name: "github",
  message: "Please input engineers Github Username",
};
const schoolPrompt = {
  name: "school",
  message: "Please input intern's school",
};

//Variable that has employee objects added to it as input is given
const employeeObject = [];

// TODO: Write Code to gather information about the development team members, and render the HTML file.

//teamMemberPrompt is called when user wants to add a team member. It then asks for relevant info and passes said info to correct class constructor. After this the object is stored and the buildTeam function is called again
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

//buildTeam function is called to check if user wants to add a team member. If they do teamMemberPrompt is called. If they are finished adding team members the render method is called with saved team info and the received HTML is saved to a file.
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
      const html = render(employeeObject);
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
      }
      fs.writeFile(outputPath, html, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Your team profile HTML file has been generated!");
        }
      });
    });
}

//initPrompt function prompts user to start team generation by inputting manager details. Once input manager details are created and stored, then buildTeam is called to add additional members
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

//initPrompt is called on node index.js being typed into terminal
initPrompt();
