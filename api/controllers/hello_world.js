'use strict';

var util = require('util');

module.exports = {
  hello(req, res) {
    var name = req.swagger.params.name.value || 'stranger';
    var hello = util.format('Hello, %s!', name);
  
    res.json(hello);
  },

  bye(req, res) {
    var name = req.swagger.params.name.value || 'stranger';
    var hello = util.format('Bye, %s!', name);
  
    res.json(hello);
  }
};
