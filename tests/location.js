'use strict';
const Location = require('../').Location;
const Range = require('../').Range;
const assert = require('chai').assert;

describe('Location', () => {
  it('should return a location', () => {
    let location = new Location();
    assert.isDefined(location);
    assert.isDefined(location.line);
    assert.isDefined(location.column);
  })
});

describe('Range', function () {
  it('should return a range', () =>{
    let start = new Location(1, 1);
    let end = new Location(1, 2);
    let range = new Range(start, end);
    [start, end, range].forEach(i => assert.isDefined(i));
    [['start', start], ['end', end]]
    .forEach(i => assert.strictEqual(range[i[0]], i[1]));
  });
});
