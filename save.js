/*



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

var jsonPath = (post, mode = "private") => {
  const prefix = mode === "private" ? "__temp/public/" : "public/";
  return `./${prefix}api/course/js/basic/chapter/${post.chapter}`;
};
var jsonFile = (post, mode = "private") => {
  return `${jsonPath(post, mode)}/${post.step}.json`;
};

var moviePath = ({ chapter, step }, mode = "private") => {
  const prefix = mode === "private" ? "__temp/public/" : "movies/original/";
  return `./${prefix}course/js/basic/chapter/${chapter}/${step}`;
};
var movieFile = ({ chapter, step }, mode = "private") => {
  return `${moviePath({ chapter, step }, mode)}/index`;
};

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

      let post = JSON.parse(body);

      fs.mkdirSync(jsonPath(post), { recursive: true });
      fs.writeFileSync(jsonFile(post), post.content);
    } else if (reqUrl === "/solution") {
      console.log("--solution");

      let post = JSON.parse(body);

      console.log({ post });
      const path = `./public/api/course/js/basic/chapter/${post.chapter}.json`;

      const currentJSON = fs.readFileSync(path, "utf8");

      let current = JSON.parse(currentJSON).map((item) => ({
        ...item,
        task: {
          ...item.task,
          solution: item.id === post.step ? post.content : item.task.solution,
        },
      }));

      fs.writeFileSync(path, JSON.stringify(current, null, 2));
    } else {
      return;
      console.log("write movie");

      // console.log("Request completed, " + body.length + " bytes received");

      let buff = new Buffer(body, "base64");
      // fs.writeFileSync('stack-abuse-logo-out.png', buff);

      const [chapter, step] = reqUrl.split("/").slice(-2);

      fs.mkdirSync(moviePath({ chapter, step }), { recursive: true });

      fs.writeFileSync(
        `${movieFile({ chapter, step })}.webm`,
        buff
        // body
      );

      const cmd = `
---------------------------------------------------------------------------------
---------------------------------------------------------------------------------

rm -rf ${jsonFile({ chapter, step }, "public")} 
mkdir -p ${jsonPath({ chapter, step }, "public")} 
mv ${jsonFile({ chapter, step })} ${jsonFile({ chapter, step }, "public")} 

ffmpeg -i ${movieFile({
        chapter,
        step,
      })}.webm -c:v libx264 -crf 23 -filter:v "scale=-2:400, crop=400:400" -c:a aac -y ${movieFile(
        { chapter, step }
      )}.mp4

rm -rf ${moviePath({ chapter, step }, "public")} 
mkdir -p ${moviePath({ chapter, step }, "public")} 
mv ${movieFile({ chapter, step })}.webm ${movieFile(
        { chapter, step },
        "public"
      )}.webm 

mv ${movieFile({ chapter, step })}.mp4 ${movieFile(
        { chapter, step },
        "public"
      )}.mp4 

rm -rf ${moviePath({ chapter, step }, "public").replace("original", "convert")} 
bash ./convert/create-vod-hls.sh "${movieFile(
        { chapter, step },
        "public"
      )}.mp4"  ${moviePath({ chapter, step }, "public").replace(
        "original",
        "convert"
      )} 

---------------------------------------------------------------------------------
---------------------------------------------------------------------------------

`;

      console.log(cmd);
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
