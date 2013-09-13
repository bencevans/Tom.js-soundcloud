
/**
 * Module Dependencies
 */

var $ = require('jquery');

/**
 * Tom.js SoundCloud Resolver
 */

module.exports = function(options) {
  if(typeof options == 'string') options = { CLIENT_ID: options };

  this.options = options;

  var soundcloudResolver = this;

  function parseSongResponse (track) {
    if(Array.isArray(track)) return track.map(parseSongResponse);

    var result = {};

    result.title = track.title;
    result.artist = track.user.username;
    result.track = track.track;
    result.album = track.album;
    result.year = track.release_year || (new Date(track.created_at)).getYear();
    result.source = 'SoundCloud';
    result.url = track.stream_url + '?client_id=' + soundcloudResolver.options.CLIENT_ID;
    result.mimetype = "audio/mpeg";
    result.bitrate = 128;
    result.duration = track.duration / 1000;
    result.score = 0.95;
    return result;

  }

  this.search = function(query, callback) {
    $.getJSON('http://api.soundcloud.com/tracks.json?q=' + query + '&client_id=' + soundcloudResolver.options.CLIENT_ID, function(data) {
      if(data && data.errors) return callback(new Error(JSON.stringify(data)));
      callback(null, parseSongResponse(data));
    });
  };

  this.resolve = function(query, callback) {
    this.search(query.artist + ' - ' + query.title, callback);
  };

  return this;
};