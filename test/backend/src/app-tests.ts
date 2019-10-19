var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('Backend Unit Tests', () => {
    it('should run a tests', () => {
        var tautology = true;
        assert.isTrue(tautology, 'the test was ran');
    });
});
