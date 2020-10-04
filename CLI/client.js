//@ts-check

// Install redis on wins: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504
const client = require("socket.io-client");
const io = client.connect("http://localhost:3001", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 20,
});
const inquirer = require("inquirer");
const cmdsState = require("./states/cmdsState");
const connState = require("./states/connectionState");
const cmds = require("./utils/cmds");

io.on("connect", (socket) => {
  if (connState.connected) {
    io.emit("request-backlog", connState.lastObtained);
  }
  connState.connected = true;
  connState.lastObtained = null;
  console.log("Connected.");
});

io.on("connect_error", () => {
  // @ts-ignore
  if (!connState.lastObtained) connState.lastObtained = Date.now();
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
  connState.lastObtained = null;
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
      await cmds[command]();
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
