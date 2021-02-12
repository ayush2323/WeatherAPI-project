// require('dotenv').config();
const http = require("http");
const fs = require("fs");
var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
  console.log(orgVal)
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp/10);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min/10);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max/10);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      // `http://api.openweathermap.org/data/2.5/weather?q=lond&units=metric&appid=${process.env.APPID}`
      `http://api.openweathermap.org/data/2.5/weather?q=patiala&appid=4c496af33d732297c30b641b3b235e47`
    )
      .on("data", (chunk) => {
        console.log(chunk)
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(3001, "127.0.0.1");