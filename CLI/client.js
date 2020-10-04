//@ts-check

// Install redis on wins: https://github.com/microsoftarchive/redis/releases/tag/win-3.0.504
const client = require("socket.io-client");
const io = client.connect("http://localhost:3001", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 20,
});

let lastObtained;
let connected = false;

io.on("connect", (socket) => {
  connected = true;
  console.log(lastObtained);
  if (lastObtained) {
    io.emit("getBacklog", lastObtained);
  }
  console.log("connected");
});

io.on("event-triggered", (data) => {
  const { timestamp } = JSON.parse(data);
  if (connected) lastObtained = timestamp;
  console.log(data);
});

io.on("connect_error", () => {
  connected = false;
  console.log("no connection");
});

io.on("backlog", (data) => {
  console.log(data);
  lastObtained = null;
});
