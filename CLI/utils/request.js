//@ts-check

const { get } = require("http");
module.exports = (url) =>
  new Promise((resolve, reject) => {
    get(url, (res) => {
      let body = "";

      res.on("data", function (chunk) {
        body += chunk;
      });

      res.on("end", function () {
        const temp = JSON.parse(body);
        if (temp.length > 0) {
          resolve(
            temp.filter((acc) => acc.isActive).map((acc) => acc.accountId)
          );
        } else resolve([]);
      });

      res.on("error", (err) => {
        reject(err);
      });
    });
  });
