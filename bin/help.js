module.exports = function() {
  const help = ''
    + '          __      _.._       \n       .-\'__`-._.\'.--.\'.__., \n      /--\'  \'-._.\'    \'-._.\/ \n     /__.--._.--._.\'``-.__\/  \n     \'._.-\'-._.-._.-\'\'-..\'   \n'
    + '\nkosher [command] <options>'
    + '\ncommands:'
    + '\n  help: ............... show supported commands'
    + '\n  version: ............ show package version'
    + '\n  convert ............. convert bpf at path or bpfs at directory path'
    + '\n    options:'
    + '\n      --source, -s .... relative or absolute directory or path of source bpf files'
  console.log(help);
};

