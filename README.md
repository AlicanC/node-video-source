# node-video-source

This is a stripped down version of [node-youtube-dl](https://github.com/fent/node-youtube-dl).
It allows you to get URLs to actual video sources (.mp4/.webm/...) from video-sharing website URLs.

You can see the list of supported websites [here](https://rg3.github.io/youtube-dl/supportedsites.html).
If you want more websites to be supported or have youtube-dl related issues, report [here](https://github.com/rg3/youtube-dl/issues).

# Installation

```
npm install video-source
```

Since the youtube-dl binary is updated regularly, you can run `npm update` to check for and download any updates for it.

# Usage

```javascript
var videoSource = require('video-source');
var url = 'http://www.youtube.com/watch?v=WKsjaOqDXgg';
// Optional arguments passed to youtube-dl.
var options = ['--username=user', '--password=hunter2'];
videoSource.getInfo(url, options, function(err, info) {
  if (err) throw err;

  console.log('id:', info.id);
  console.log('title:', info.title);
  console.log('url:', info.url);
  console.log('thumbnail:', info.thumbnail);
  console.log('description:', info.description);
  console.log('filename:', info._filename);
  console.log('format id:', info.format_id);
});
```

Running that will produce something like

    id: WKsjaOqDXgg
    title: Ace Rimmer to the Rescue
    url: http://r5---sn-p5qlsn7e.c.youtube.com/videoplayback?ms=au&ip=160.79.125.18&cp=U0hWTFVQVl9FTENONl9NSlpDOjgtU1VsODlkVmRH&id=58ab2368ea835e08&source=youtube&expire=1377558202&factor=1.25&key=yt1&ipbits=8&mt=1377534150&itag=34&sver=3&upn=-rGWz2vYpN4&fexp=912306%2C927900%2C919395%2C926518%2C936203%2C913819%2C929117%2C929121%2C929906%2C929907%2C929922%2C929127%2C929129%2C929131%2C929930%2C925726%2C925720%2C925722%2C925718%2C929917%2C906945%2C929919%2C929933%2C912521%2C932306%2C913428%2C904830%2C919373%2C930803%2C908536%2C904122%2C938701%2C936308%2C909549%2C900816%2C912711%2C904494%2C904497%2C900375%2C906001&sparams=algorithm%2Cburst%2Ccp%2Cfactor%2Cid%2Cip%2Cipbits%2Citag%2Csource%2Cupn%2Cexpire&mv=m&burst=40&algorithm=throttle-factor&signature=ABD3A847684AD9B39331E567568D3FA0DCFA4776.7895521E130A042FB3625A17242CE3C02A4460B7&ratebypass=yes
    thumbnail: https://i1.ytimg.com/vi/WKsjaOqDXgg/hqdefault.jpg
    description: An old Red Dwarf eposide where Ace Rimmer saves the Princess Bonjella.
    filename: Ace Rimmer to the Rescue-WKsjaOqDXgg.flv
    format id: 34

You can use an array of urls to produce an array of response objects with matching array index (e.g. the 1st response object will match the first url etc...)
```javascript
var youtubedl = require('youtube-dl');
var url1 = 'http://www.youtube.com/watch?v=WKsjaOqDXgg';
var url2 = 'https://vimeo.com/6586873';
youtubedl.getInfo([url1, url2], function(err, info) {
  if (err) throw err;

  console.log('title for the url1:', info[0].title);
  console.log('title for the url2:', info[1].title);
});
```

# Tests

Tests are written with [vows](http://vowsjs.org/)

```bash
npm test
```

[youtube-dl]: http://rg3.github.com/youtube-dl/
[youtube-dl documentation]: http://rg3.github.com/youtube-dl/documentation.html

# License

MIT
