# Nghttp2 Stream Analyzer

The stream analyzer for nghttp2.  
This is the very rough prototype ;-)

## Requirements

- Node.js v0.12 or higher

## Install

```
$ git clone 
$ cd nghttp2-stream-analyzer
$ npm install
```

## Usage

```
$ nghttpd 443 server.key server.crt -v > nghttpd.log
$ node ./analyzer.js -f nghttpd.log -o output.html
```

