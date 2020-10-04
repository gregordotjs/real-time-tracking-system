// socket
const { time } = require("faker");
const socket = require("socket.io");
const io = socket();
const redisAdapter = require("socket.io-redis");
io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

var redis = require("redis"),
  client = redis.createClient();

io.on("connection", function (socket) {
  console.log(`${socket.id} connected!`);

  socket.on("getBacklog", (timestamp) => {
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

io.listen(3001);
