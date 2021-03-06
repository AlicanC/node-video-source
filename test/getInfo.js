var vows   = require('vows');
var ytdl   = require('..');
var assert = require('assert');


vows.describe('getInfo').addBatch({
  'from a youtube video': {
    'topic': function() {
      var video = 'http://www.youtube.com/watch?v=90AiXO1pAiA';
      var that = this;
      ytdl.getInfo(video, ['-f', '18/22/37/38'])
        .then(function (info) {

          that.callback(null, info);

        })
        .catch(that.callback);;
    },

    'info returned': function(err, info) {
      assert.isNull(err);
      assert.isObject(info);
      assert.equal(info.id, '90AiXO1pAiA');
      assert.equal(info.format_id, '18');
      assert.equal(info.title, 'lol');
      assert.isString(info.url);
      assert.isString(info.thumbnail);
      assert.equal(info.description,
        'Ridley High School\'s real American Bad ASS,A true Delco Savage. ' +
        'Filmed in 2003 before Youtube was invented. ' +
        'This is also the original I find it hilarious that there ' +
        'are copycat videos!');
      assert.equal(info._filename, 'lol-90AiXO1pAiA.mp4');
      assert.equal(info.format, '18 - 640x360');
      assert.equal(info.duration, '12');
      assert.equal(info.width, 640);
      assert.equal(info.height, 360);
      assert.isArray(info.formats);
    }
  },
  'from a youtube playlist': {
    'topic': function() {
      var pl = 'https://www.youtube.com/playlist?list=PLEFA9E9D96CB7F807';
      var that = this;
      ytdl.getInfo(pl)
        .then(function (info) {

          that.callback(null, info);

        })
        .catch(that.callback);;
    },

    'info returned': function(err, info) {
      assert.isNull(err);
      assert.isArray(info);
      assert.ok(info.length);
      info.forEach(function(videoInfo) {
        assert.isString(videoInfo.url);
      });
    }
  },
  'from a soundcloud track': {
    'topic': function() {
      var video = 'https://soundcloud.com/erasedtapes/kiasmos-bent';
      var that = this;
      ytdl.getInfo(video)
        .then(function (info) {

          that.callback(null, info);

        })
        .catch(that.callback);;
    },
    'info returned': function(err, info) {
      assert.isNull(err);
      assert.isObject(info);
      assert.equal(info.id, '147055755');
      assert.equal(info.title, 'Kiasmos - Bent');
      assert.isString(info.url);
      assert.isString(info.thumbnail);
      assert.isString(info.description);
      assert.equal(info._filename, 'Kiasmos - Bent-147055755.mp3');
      assert.equal(info.format, 'http_mp3_128_url - audio only');
      assert.equal(info.duration, '5:45');
    }
  },
  'from a vimeo video': {
    'topic': function() {
      var video = 'https://vimeo.com/6586873';
      var that = this;
      ytdl.getInfo(video)
        .then(function (info) {

          that.callback(null, info);

        })
        .catch(that.callback);;
    },

    'info returned': function(err, info) {
      assert.isNull(err);
      assert.isObject(info);
      assert.equal(info.id, '6586873');
      assert.equal(info.title, 'OWEN - good friends, bad habits');
      assert.isString(info.url);
      assert.isString(info.thumbnail);
      assert.equal(info.description,
        'Video for the song "Good Friends, Bad Habits" from the album ' +
        'New Leaves. Directed by Joe Wigdahl. Purchase the album here: ' +
        'hobbledehoyrecords.com/store');
      assert.equal(info._filename,
        'OWEN - good friends, bad habits-6586873.mp4');
      assert.equal(info.format, 'h264-sd - 480x272');
      assert.equal(info.duration, '3:55');
    }
  },

  'from multiple videos': {
    'topic': function() {
      var vimeo = 'https://vimeo.com/6586873';
      var youtube = 'http://www.youtube.com/watch?v=90AiXO1pAiA';
      var that = this;
      ytdl.getInfo([vimeo, youtube])
        .then(function (info) {

          that.callback(null, info);

        })
        .catch(that.callback);
    },

    'info returned': function(err, info) {
      assert.isNull(err);
      assert.isArray(info);
      assert.equal(info.length, 2);
      assert.equal(info[0].id, '6586873');
      assert.equal(info[0].title, 'OWEN - good friends, bad habits');
      assert.isString(info[0].url);
      assert.isString(info[0].thumbnail);
      assert.equal(info[0].description,
        'Video for the song "Good Friends, Bad Habits" from the album ' +
        'New Leaves. Directed by Joe Wigdahl. Purchase the album here: ' +
        'hobbledehoyrecords.com/store');
      assert.equal(info[0]._filename,
        'OWEN - good friends, bad habits-6586873.mp4');
      assert.equal(info[0].format, 'h264-sd - 480x272');
      assert.equal(info[0].duration, '3:55');

       assert.equal(info[1].id, '90AiXO1pAiA');
      assert.equal(info[1].format_id, '18');
      assert.equal(info[1].title, 'lol');
      assert.isString(info[1].url);
      assert.isString(info[1].thumbnail);
      assert.equal(info[1].description,
        'Ridley High School\'s real American Bad ASS,A true Delco Savage. ' +
        'Filmed in 2003 before Youtube was invented. ' +
        'This is also the original I find it hilarious that there ' +
        'are copycat videos!');
      assert.equal(info[1]._filename, 'lol-90AiXO1pAiA.mp4');
      assert.equal(info[1].format, '18 - 640x360');
      assert.equal(info[1].duration, '12');
      assert.equal(info[1].width, 640);
      assert.equal(info[1].height, 360);
      assert.isArray(info[1].formats);
    }
  }
}).export(module);
