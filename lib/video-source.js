var Q = require('q');

var execFile  = require('child_process').execFile;
var url       = require('url');
var path = require('path');
var util      = require('./util');

var isDebug = /^\[debug\] /;
var isWarning = /^WARNING: /;
var isYouTubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//;
var isNoSubsRegex =
  /WARNING: video doesn't have subtitles|no closed captions found/;
var subsRegex = /--write-sub|--write-srt|--srt-lang|--all-subs/;

var ytdlBinary = path.join(__dirname, '..', 'bin', 'youtube-dl');

var videoSource = module.exports = {};


/**
 * Calls youtube-dl with some arguments and the `callback`
 * gets called with the output.
 *
 * @param {String} url
 * @param {Array.<String>} args
 * @param {Object} options
 * @param {Function(!Error, String)} callback
 */
videoSource.exec = function (url, args, options) {
  return call(url, [], args, options);
};


/**
 * Calls youtube-dl with some arguments and the `callback`
 * gets called with the output.
 *
 * @param {String|Array.<String>}
 * @param {Array.<String>} args
 * @param {Array.<String>} args2
 * @param {Object} options
 * @param {Function(!Error, String)} callback
 */
function call(urls, args1, args2, options) {

  var args = args1;
  if (args2) {
    args = args.concat(util.parseOpts(args2));
  }
  options = options || {};

  if (urls != null) {
    if (typeof urls === 'string') {
      urls = [urls];
    }

    for (var i = 0; i < urls.length; i++) {
      var video = urls[i];
      if (isYouTubeRegex.test(video)) {
        // Get possible IDs.
        var details = url.parse(video, true);
        var id = details.query.v || '';
        if (id) {
          args.push('http://www.youtube.com/watch?v=' + id);
        } else {
          // Get possible IDs for youtu.be from urladdr.
          id = details.pathname.slice(1).replace(/^v\//, '');
          if (id || id === 'playlist') {
            args.push(video);
          }
        }
      } else {
        args.push(video);
      }
    }
  }

  var file = process.env.PYTHON || 'python';
  args = [ytdlBinary].concat(args);

  // Call youtube-dl.
  return Q.nfcall(execFile, file, args, options)
    .spread(function (stdout, stderr) {

      if (stderr) {
        // Try once to download video if no subtitles available
        if (!options.nosubs && isNoSubsRegex.test(stderr)) {
          var i;
          var cleanupOpt = args2;

          for (i = cleanupOpt.length - 1; i >= 0; i--) {
            if (subsRegex.test(cleanupOpt[i])) { cleanupOpt.splice(i, 1); }
          }

          options.nosubs = true;

          return call(video, args1, cleanupOpt, options, callback);

        }

        if (isDebug.test(stderr) && args.indexOf('--verbose') > -1) {
          console.log('\n' + stderr);
        } else if (isWarning.test(stderr)) {
          console.warn(stderr);
        } else {
          throw new Error(stderr.slice(7));
        }

      }

      var data = stdout.trim().split(/\r?\n/);

      return data;

    });

}


/**
 * @param {Object} data
 * @returns {Object}
 */
function parseInfo(data) {
  var info = JSON.parse(data);

  // Add and process some entries to keep backwards compatibility
  Object.defineProperty(info, 'filename', {
    get: function() {
      console.warn('`info.filename` is deprecated, use `info._filename`');
      return info._filename;
    }
  });
  Object.defineProperty(info, 'itag', {
    get: function() {
      console.warn('`info.itag` is deprecated, use `info.format_id`');
      return info.format_id;
    }
  });
  Object.defineProperty(info, 'resolution', {
    get: function() {
      console.warn('`info.resolution` is deprecated, use `info.format`');
      return info.format.split(' - ')[1];
    }
  });
  info.duration = util.formatDuration(info.duration);
  return info;
}


/**
 * Gets info from a video.
 *
 * @param {String} url
 * @param {Array.<String>} args
 * @param {Object} options
 * @param {Function(!Error, Object)} callback
 */
videoSource.getInfo = function(url, args, options) {

  var defaultArgs = ['--dump-json'];
  if (!args || args.indexOf('-f') < 0 && args.indexOf('--format') < 0 &&
      args.every(function(a) {
        return a.indexOf('--format=') !== 0;
      })) {
    defaultArgs.push('-f');
    defaultArgs.push('best');
  }
  return call(url, defaultArgs, args, options)
    .then(function (data) {

      var info;
      try {
        info = data.map(parseInfo);
      } catch (err) {
        return callback(err);
      }

      return (info.length === 1 ? info[0] : info);

    });
};
