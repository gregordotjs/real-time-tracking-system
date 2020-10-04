// @ts-check

const inquirer = require("inquirer");
const request = require("./request");
const cmdsState = require("../states/cmdsState");

const accountsEndpoint = "http://localhost:3000/api/v1/accounts";

const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const cyan = "\x1b[36m"
const reset = "\x1b[0m";

const colorize = (str, color = cyan) => `${color}${str}${reset}`;
module.exports = {
  ["help"]: () => {
    console.log(`Type
  - '${colorize("filter")}' for filtering the events by account id
  - '${colorize(
    "filter --select"
  )}' for selecting an existing and active account
  - '${colorize("filter --remove")}' for removing the filter
  - '${colorize(
    "summary"
  )}' for displaying the summary of emitted events every n-seconds
  - '${colorize(
    "summary --remove"
  )}' for removing the display of summarized reports
    `);
  },
  ["summary --remove"]: async () => {
    clearInterval(cmdsState.summary.intervalHandler);
    cmdsState.summary.summarize = false;
    console.log("Summarization of events is disabled.");
  },
  ["summary"]: async () => {
    const { summary } = cmdsState;
    const input = await inquirer.prompt([
      {
        name: "seconds",
        type: "number",
        message: "Wait for summary (in seconds):",
      },
    ]);
    const { seconds } = input;
    const interval = parseInt(seconds);
    if (!isNaN(interval)) {
      console.log(`Done. Every ${interval} seconds you'll received a summary.`);
      if (cmdsState.filter) {
        console.log(`${colorize('Warning', red)}: you're filtering the results by account id ${colorize(cmdsState.filter)}!`)
      }
      summary.summarize = true;
      summary.events = [];

      clearInterval(summary.intervalHandler);

      summary.intervalHandler = setInterval(() => {
        console.log(
          `${summary.events.length} events were published in the last ${interval} seconds.`
        );
        summary.events = [];
      }, interval * 1000);
    }
  },
  ["filter --select"]: async () => {
    try {
      const accounts = await request(accountsEndpoint);
      const input = await inquirer.prompt([
        {
          type: "list",
          name: "id",
          message: "Select an existing ID to filter by:",
          choices: accounts,
        },
      ]);
      const { id } = input;

      // @ts-ignore
      cmdsState.filter = isNaN(parseInt(id)) ? null : parseInt(id);
      if (cmdsState.filter)
        console.log(
          `Done. Only events of user with account id ${colorize(
            cmdsState.filter
          )} will be displayed.`
        );
    } catch (error) {
      console.log(error);
    }
  },
  ["filter --remove"]: () => {
    cmdsState.filter = null;
    console.log("Filter is removed.");
  },
  ["filter"]: async () => {
    try {
      const input = await inquirer.prompt([
        {
          name: "id",
          type: "number",
          message: `Insert the ID to filter by${
            cmdsState.filter
              ? " (currently filtered by " + colorize(cmdsState.filter) + ")"
              : ""
          }:`,
        },
      ]);
      const { id } = input;
      if (!isNaN(id)) {
        cmdsState.filter = id;
        console.log(
          `Done. Only events of user with account id ${colorize(
            id
          )} will be displayed.`
        );
      } else {
        console.log(`Could not set filter.`);
      }
    } catch (error) {
      console.log(error);
    }
  },
  ["exit"]: async () => {
    process.exit(0);
  },
};
