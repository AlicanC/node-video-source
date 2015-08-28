# node-video-source

Get URLs to actual video sources (.mp4/.webm/...) from video-sharing website URLs like YouTube, Vimeo and many others.

This is a stripped down version of [node-youtube-dl](https://github.com/fent/node-youtube-dl) which uses [youtube-dl](https://github.com/rg3/youtube-dl/).

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

videoSource.getInfo('https://www.youtube.com/watch?v=sPasebVMIW4')
  .then(function (info) {

    console.log('id:', info.id);
    console.log('title:', info.title);
    console.log('url:', info.url);
    console.log('thumbnail:', info.thumbnail);
    console.log('description:', info.description);
    console.log('filename:', info._filename);
    console.log('format id:', info.format_id);

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
