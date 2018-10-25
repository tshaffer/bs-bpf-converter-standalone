let gulp = require('gulp');
let clean = require('gulp-clean');
let concat = require('gulp-concat');
let replace = require('gulp-just-replace');
let through = require('through2');

gulp.task('cleanTypes', function () {
  return gulp.src('./temp/decl/*',  {read: false})
    .pipe(clean({force: true}));
});

let declSrcTS = [
  './temp/decl/bpfConverter.d.ts',
];

function consolidateBsCoreCoreImports () {
  return through.obj(function (file, enc, cb) {
    let src = file.contents.toString();

    let rxp = /import\s{\s*(.*)}.*@brightsign\/bscore.*\n/g;
    let importStrings = [];
    while (true) {
      let result = rxp.exec(src);
      if (result) {
        importStrings.push(result[1]);
      } else {
        break;
      }
    }
    let imports = new Set();
    let splitRxp = /[, ]+/;
    importStrings.forEach(str => {
      let values = str.split(splitRxp);
      values.forEach(val => {
        if (val) {
          imports.add(val);
        }
      });
    });

    let newSrc = '/* tslint:disable:quotemark max-line-length */\n';
    if (imports.size) {
      newSrc = newSrc + 'import {';
      let first = true;
      imports.forEach(str => {
        newSrc = newSrc + (first?'':', ') + str;
        first= false;
      });
      newSrc = newSrc + '} from \'@brightsign/bscore\';\n';
    }
    newSrc = newSrc + src.replace(rxp, '');
    file.contents = new Buffer(newSrc);
    this.push(file);
    cb();
  });
}

function consolidateBsDataModelCoreImports () {
  return through.obj(function (file, enc, cb) {
    let src = file.contents.toString();

    let rxp = /import\s{\s*(.*)}.*@brightsign\/bsdatamodel.*\n/g;
    let importStrings = [];
    while (true) {
      let result = rxp.exec(src);
      if (result) {
        importStrings.push(result[1]);
      } else {
        break;
      }
    }
    let imports = new Set();
    let splitRxp = /[, ]+/;
    importStrings.forEach(str => {
      let values = str.split(splitRxp);
      values.forEach(val => {
        if (val) {
          imports.add(val);
        }
      });
    });

    let newSrc = '/* tslint:disable:quotemark max-line-length */\n';
    if (imports.size) {
      newSrc = newSrc + 'import {';
      let first = true;
      imports.forEach(str => {
        newSrc = newSrc + (first?'':', ') + str;
        first= false;
      });
      newSrc = newSrc + '} from \'@brightsign/bsdatamodel\';\n';
    }
    newSrc = newSrc + src.replace(rxp, '');
    file.contents = new Buffer(newSrc);
    this.push(file);
    cb();
  });
}

let replaceSpecTS = [
  {
    search: /export declare/g,
    replacement: 'export'
  },
  {
    search: /import\s((?!(redux|@brightsign\/bscore|@brightsign\/bsdatamodel)).)*\n/g,
    replacement: ''
  }
];

gulp.task('indexTypescript',function() {
  return gulp.src(declSrcTS)
    .pipe(replace(replaceSpecTS))
    .pipe(concat('index.d.ts'))
    .pipe(consolidateBsDataModelCoreImports())
    .pipe(consolidateBsCoreCoreImports())
    .pipe(gulp.dest('.'));
});
