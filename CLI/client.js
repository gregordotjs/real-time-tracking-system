//@ts-check
require("dotenv").config();
const client = require("socket.io-client");
const io = client.connect(
  `${process.env.SOCKET_IO_URL}:${process.env.SOCKET_IO_PORT}`,
  {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 20,
  }
);
const inquirer = require("inquirer");
const cmdsState = require("./states/cmdsState");
//const connState = require("./states/connectionState");
let lastObtained;
const cmds = require("./utils/cmds");

io.on("reconnect", () => {
  io.emit("request-backlog", lastObtained);
});

io.on("connect", () => {
  console.log("Connected.");
});

io.on("reconnect_attempt", () => {
  if (!lastObtained) lastObtained = Date.now();
  console.log("Attempting to reconnect...");
});

io.on("event", (data) => {
  const { accountId } = JSON.parse(data);

  if (cmdsState.filter === null || cmdsState.filter === parseInt(accountId)) {
    if (!cmdsState.summary.summarize) {
      console.log(data);
    } else {
      cmdsState.summary.events.push(data);
    }
  }
});

io.on("backlog", (data) => {
  console.log(data);
  lastObtained = null;
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

// CLI interface
const cli = async () => {
  try {
    const input = await inquirer.prompt([
      {
        name: "cmd",
        message: "$",
      },
    ]);
    const command = input.cmd.trim();
    if (cmds[command]) {
      const keepAlive = await cmds[command]();
      if (!keepAlive) {
        io.disconnect();
        process.exit(0);
      }
    } else {
      console.log(
        `Unrecognized command ${command}. Type '\x1b[36mhelp\x1b[0m'`
      );
    }
    cli();
  } catch (error) {}
};

// run CLI
cli();
