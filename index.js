const {
  spawn
} = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
app.get('/', function (_0x45637d, _0x45a9f0) {
  _0x45a9f0.sendFile(path.join(__dirname, "/index.html"));
});
app.listen(port, () => {
  logger("Server is running on port " + port + "...", "[ STARTING ]");
}).on("error", _0x514ae2 => {
  if (_0x514ae2.code === "EACCES") {
    logger("Permission denied. Cannot bind to port " + port + '.', "[ Error ]");
  } else {
    logger("Server error: " + _0x514ae2.message, "[ Error ]");
  }
});
global.countRestart = global.countRestart || 0;
function startBot(_0x4b204b) {
  if (_0x4b204b) {
    logger(_0x4b204b, "[ STARTING ]");
  }
  const _0x574621 = spawn("node", ["--trace-warnings", "--async-stack-traces", "Main.js"], {
    'cwd': __dirname,
    'stdio': "inherit",
    'shell': true
  });
  _0x574621.on("close", _0x1dc226 => {
    if (_0x1dc226 !== 0 && global.countRestart < 5) {
      global.countRestart += 1;
      logger("Bot exited with code " + _0x1dc226 + ". Restarting... (" + global.countRestart + "/5)", "[ RESTARTING ]");
      startBot();
    } else {
      logger("Bot stopped after " + global.countRestart + " restarts.", "[ STOPPED ]");
    }
  });
  _0x574621.on("error", _0x9797c5 => {
    logger("An error occurred: " + JSON.stringify(_0x9797c5), "[ Error ]");
  });
}
;
axios.get("https://raw.githubusercontent.com/sujon/fbbot/main/package.json").then(_0x5aa3bb => {
  logger(_0x5aa3bb.data.name, "[ NAME ]");
  logger("Version: " + _0x5aa3bb.data.version, "[ VERSION ]");
  logger(_0x5aa3bb.data.description, "[ DESCRIPTION ]");
})["catch"](_0x155539 => {
  logger("Failed to fetch update info: " + _0x155539.message, "[ Update Error ]");
});
startBot();