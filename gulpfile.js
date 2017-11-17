'use strict';

let Gulp         = require('gulp');
let Mocha        = require('gulp-mocha');
let Shell        = require('gulp-shell');
let Istanbul     = require('gulp-istanbul');
let GUtil        = require('gulp-util');
let ESLint       = require('gulp-eslint');
let Args         = require('yargs').argv;

// --
// The Tasks
// --

Gulp.task('default', function() {
    GUtil.log(
        '\n\n',
        GUtil.colors.bold.red('Available Commands: \n'),
        '  gulp', GUtil.colors.green('test              '),
        GUtil.colors.grey('  - Run test suites.\n'),
        '  gulp', GUtil.colors.green('jsdoc             '),
        GUtil.colors.grey('  - Generate jsdoc documentation.\n'),
        '  gulp', GUtil.colors.green('eslint            '),
        GUtil.colors.grey('  - Run linting report.\n'),
        '  gulp', GUtil.colors.green('eslint:fix       '),
        GUtil.colors.grey('   - Fix JS files.\n'),
        '\n'
    );
});

// --
// Testing Stuff
// --

(() => {
    
    Gulp.task('pre-test', function () {
        return Gulp.src([
            './util/*.js',
            './lib/**/*.js'
        ])
            .pipe(Istanbul({ includeUntested: true }))
            .pipe(Istanbul.hookRequire());
    });
    
    Gulp.task('test', function() {
        return Gulp.src('./tests/*.js', { read: false })
            .pipe(Mocha({ reporter: 'nyan' }));
    });
    
    
})();

// --
// Documentation
// --

(() => {
    
    Gulp.task('jsdoc', Shell.task([
        './node_modules/.bin/jsdoc -t ./node_modules/ink-docstrap/template -c ./docs/jsdoc_conf.json -r'
    ]));
    
})();

// --
// QA Stuff
// --

(() => {
     Gulp.task('eslint:fix', function () {
        return Gulp.src([
            './index.js',
            './tests/*.js',
            './utils/*.js'
        ])
        // Covering files
            .pipe(ESLint({ fix: true }))
            // Force `require` to return covered files
            .pipe(ESLint.format())
            .pipe(Gulp.dest(
                (file) => {
                    return file.base;
                }
            ))
            .once('end', function () {
                setTimeout(() => {
                    process.exit(0);
                }, 1000);
            });
    });

    Gulp.task('eslint', function () {
        return Gulp.src([
            './index.js',
            './tests/*.js',
            './utils/*.js'
        ])
            // Covering files
            .pipe(ESLint({  }))
            // Force `require` to return covered files
            .pipe(ESLint.format());
    });
    
})();
