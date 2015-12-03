# Nghttp2 Stream Analyzer

This is a prototype of stream analyzer for nghttp2.

## Requirements

- Node.js v0.12 or higher

## Install

```
$ git clone https://github.com/summerwind/nghttp2-stream-analyzer.git
$ cd nghttp2-stream-analyzer
$ npm install
```

## Usage

```
$ nghttpd 443 server.key server.crt -v > nghttpd.log
$ node ./analyzer.js -f nghttpd.log -o output.html
```

## Screenshot

![Sceenshot](https://cloud.githubusercontent.com/assets/230145/11563026/eefe91fe-9a14-11e5-83d4-fe5db073085b.png)

