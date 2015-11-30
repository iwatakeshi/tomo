const isBrowser = typeof window !== 'undefined';
const isNode = (typeof module !== 'undefined' && module.exports);
(function() {
  var Cherry = {};
  var Scanner = require('./lib/Scanner').default,
    Parser = require('./lib/Parser').default,
    Source = require('./lib/Source').default,
    Tokenize = require('./lib/Token').default,
    Stream = require('./lib/Stream').default,
    Location = require('./lib/Location').default,
    Range = require('./lib/Location').Range,
    Collections = require('./lib/Collections').default,
    Utils = require('./lib/Utils').default;


  Cherry = {
    Scanner, Parser, Source,
    Tokenize, Collections, Utils,
    Stream, Location, Range
  };
  /************************************
      Exposing Cherry
  ************************************/

  // CommonJS module is defined
  if(isNode) module.exports = Cherry;
  if(isBrowser) window.cherry = window.Cherry = Cherry;

  /*global define:false */
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return Cherry;
    });
  }
}).call(this);