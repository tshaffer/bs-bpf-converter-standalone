const pkg = require('../package.json');

module.exports = function() {
  console.log('v' + pkg.version);
};

