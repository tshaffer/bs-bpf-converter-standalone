const minimist = require('minimist');
const args = minimist(process.argv.slice(2));

let cmd = args._[0] || 'help';

if (args.version || args.v) {
  cmd = 'version';
}

if (args.help || args.h) {
  cmd = 'help';
}

switch (cmd) {
  case 'convert': {
    require('./convert')(args);
    break;
  }
  case 'help': {
    require('./help')();
    break;
  }
  case 'version': {
    require('./version')();
    break;
  }
  default: {
    console.log('[error]: unknown command ' +  cmd);
  }
}
