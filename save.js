var http = require("http");
var querystring = require("querystring");

const fs = require("fs");

var server = http.createServer().listen(3005);

server.on("request", function (req, res) {
  if (req.method == "POST") {
    var body = "";
  }

  req.on("data", function (data) {
    body += data;
  });

  req.on("end", function () {
    var post = JSON.parse(body);

    fs.writeFileSync(`./src/context/content/${post.id}.json`, post.content);

    console.log(post);
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    });
    res.end("Hello World\n");
  });
});

console.log("Listening on port 3005");
