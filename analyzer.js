var fs = require("fs"),
    path = require("path"),
    minimist = require('minimist'),
    ejs = require('ejs');

var args = minimist(process.argv.slice(2));

if (!args.f || !args.o) {
  console.log("Usage: analyzer.js -f <LOG_FILE> -o <OUTPUT_FILE>");
  process.exit(1);
}

// Format:
// ------------------------------------------------------------------
// [ 14.325] recv HEADERS frame <length=23, flags=0x25, stream_id=39>
// [ 14.325] send HEADERS frame <length=10, flags=0x04, stream_id=39>
// [ 14.148] send DATA frame <length=16384, flags=0x00, stream_id=31>
// ------------------------------------------------------------------
var frame_pattern = /\[\s+([0-9\.]+)\] (recv|send) (.+) frame <length=(\d+),.+?, stream_id=(\d+)/;

// Format:
// ------------------------------------------------------------------
// [ 13.804] recv (stream_id=13) :path: /test.html
// ------------------------------------------------------------------
var path_pattern = /\[\s+([0-9\.]+)\] recv \(stream_id=(\d+)\) :path: (.+)/;

var frames = [];
var streams = [];
var resources = {};
var data = { streams: [], resources: {} };

var start_time = 0;
var slot = 0;

var log = fs.readFileSync(args.f, {encoding: "utf8"});
log.split("\n").forEach(function(line) {
  if (line.match(frame_pattern)) {
    if (start_time == 0) {
      start_time = parseFloat(RegExp.$1);
    }

    frames.push({
      time:      parseFloat(RegExp.$1) - start_time,
      server:    (RegExp.$2 == "send"),
      type:      RegExp.$3,
      length:    parseInt(RegExp.$4, 10),
      stream_id: parseInt(RegExp.$5, 10)
    });
  }

  if (line.match(path_pattern)) {
    var stream_id = parseInt(RegExp.$2, 10);
    resources[stream_id] = RegExp.$3;
  }
});

var length = frames.length;
frames.forEach(function(frame) {
  var stream_id = frame.stream_id;

  if (!streams[stream_id]) {
    streams[stream_id] = {
      id: stream_id,
      frames: new Array(length)
    };
  }

  streams[stream_id].frames[slot] = frame;
  slot++;
});

streams.forEach(function(stream) {
  if (stream) {
    data.streams.push(stream);
  }
});
data.resources = resources;

data.colors = {
  client: {
    HEADERS: "#e6550d",
    DATA: "#fdae6b",
    WINDOW_UPDATE: "#e377c2",
    PRIORITY: "#756bb1",
    SETTINGS: "#999",
  },
  server: {
    HEADERS: "#31a354",
    DATA: "#a1d99b",
    WINDOW_UPDATE: "#17becf",
    PRIORITY: "#3182bd",
    SETTINGS: "#999",
  }
};

var template_path = path.resolve(__dirname, "template.ejs")
var template = fs.readFileSync(template_path, {encoding: "utf8"});

var html = ejs.render(template, data);
fs.writeFileSync(args.o, html);

