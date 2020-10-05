//@ts-check
require("dotenv").config();
const socket = require("socket.io");
const io = socket();
const redisAdapter = require("socket.io-redis");
io.adapter(
  redisAdapter({
    host: process.env.REDIS_URL,
    port: parseInt(process.env.REDIS_PORT),
  })
);
const client = require("redis").createClient();

io.on("connection", function (socket) {
  console.log(`${socket.id} connected!`);

  socket.on("request-backlog", (timestamp) => {
    console.log(timestamp);
    if (timestamp) {
      const excludeLast = timestamp + 1;

      client.zrangebyscore("events", excludeLast, Date.now(), (err, reply) => {
        socket.emit("backlog", reply);
      });
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected!`);
  });
});

io.listen(parseInt(process.env.SOCKET_IO_PORT));

module.exports = io;
