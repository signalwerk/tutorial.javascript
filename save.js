/*



ffmpeg -i index.webm -c copy index.mp4

ffmpeg -i ./index.webm -c:v libx264 -crf 18 -filter:v "scale=-2:400, crop=400:400" -c:a aac index.mp4


to stop creat react app from refresh wen writing:

https://stackoverflow.com/a/65099810/1184829



You can open the file node_modules\react-scripts\config\webpackDevServer.config.js and change the watchOptions.ignored setting to include the public folder like this:

```js
watchOptions: {
  ignored: [ ignoredFiles(paths.appSrc), paths.appPublic ]
},
```

Of course this is only temporary as reinstall/updates to node_modules will remove this.

*/

var http = require("http");
var querystring = require("querystring");
const url = require("url");
const { spawn } = require("child_process");

const fs = require("fs");
// const { exec } = require("child_process");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

var server = http.createServer().listen(3005);
let data = [];

server.on("request", function async(req, res) {
  if (req.method == "POST") {
    data = [];
  }

  req.on("data", function (chunk) {
    data.push(chunk);
  });

  // const buffer = Buffer.from(res, 'utf8');
  // fs.writeFileSync('/some/path', buffer);

  req.on("end", function async() {
    // Parse the request url
    const reqUrl = url.parse(req.url).pathname;

    console.log("req path", reqUrl);
    const body = Buffer.concat(data).toString();

    if (reqUrl === "/") {
      console.log("write json");

      var post = JSON.parse(body);

      const path = `./public/api/course/js/basic/chapter/${post.chapter}`;
      fs.mkdirSync(path, { recursive: true });

      fs.writeFileSync(`${path}/${post.step}.json`, post.content);
    } else {
      console.log("write movie");

      // console.log("Request completed, " + body.length + " bytes received");

      let buff = new Buffer(body, "base64");
      // fs.writeFileSync('stack-abuse-logo-out.png', buff);

      const [chapter, step] = reqUrl.split("/").slice(-2);

      const path = `./public/movies/course/js/basic/chapter/${chapter}/${step}`;
      const movieFile = `${path}/index`;
      fs.mkdirSync(path, { recursive: true });

      fs.writeFileSync(
        `${movieFile}.webm`,
        buff
        // body
      );

      const cmd = `ffmpeg -i ${movieFile}.webm -c:v libx264 -crf 23 -filter:v "scale=-2:400, crop=400:400" -c:a aac -y ${movieFile}.mp4`;

      console.log(cmd);

      // exec(cmd, (err, stdout, stderr) => {
      //   if (err) {
      //     //some err occurred
      //     console.error(err);
      //     console.log(cmd);
      //   } else {
      //     // the *entire* stdout and stderr (buffered)
      //     // console.log(`stdout: ${stdout}`);
      //     // console.log(`stderr: ${stderr}`);
      //     console.log("file converted");
      //   }
      // });

      // async function ffmpeg() {
      //   try {
      //     const { stdout, stderr } = await exec(cmd);
      //     console.log("stdout:", stdout);
      //     console.log("stderr:", stderr);
      //     console.log("file conversion exit");
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }

      // ffmpeg();

      // const child = spawn(cmd);
      // // use child.stdout.setEncoding('utf8'); if you want text chunks
      // child.stdout.on("data", (chunk) => {
      //   // data from the standard output is here as buffers
      //   console.log(chunk);
      // });
      // // since these are streams, you can pipe them elsewhere
      // // child.stderr.pipe(dest);
      // child.on("close", (code) => {
      //   console.log(`child process exited with code ${code}`);
      // });
    }

    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    });
    res.end("Done!\n");
  });
});

console.log("Listening on port 3005");
