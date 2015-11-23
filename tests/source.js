'use strict';
const Source = require('../').Source;
const assert = require('chai').assert;

describe('Source', () => {
  describe('charAt()', ()=>{
    it('should return the char string', () => {
      let src = '1 + 2 = 3';
      let source = new Source(src, { isCharCode:false });
      src.split('').forEach((s, i) => { assert.strictEqual(source.charAt(i), s)})
    });
    
    it('should return the char number', () => {
      let src = '1 + 2 = 3';
      let source = new Source(src, { isCharCode:true });
      src.split('').forEach((s, i) => { assert.strictEqual(source.charAt(i), s.charCodeAt(0))});
    });
  });
});
