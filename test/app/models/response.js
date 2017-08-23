'use strict';

var expect = require('chai').expect;

var response = require('../../../app/models/response');

describe('response', function() {
  it('should load', function() {
    expect(response).to.be.a('function');
  });
});
