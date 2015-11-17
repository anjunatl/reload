module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '../../src',


    // frameworks to use
    frameworks: ['jasmine', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      // Fixtures
      { pattern: '../tests/json/version.json', watched: true, served: true, included: false },

      // Source
      'reload.js',
      '*.js',

      // Tests
      '../tests/unit/*.js'
    ],


    preprocessors: {
      '*.js': ['coverage']
    },


    // optionally, configure the reporter
    coverageReporter: {
      dir : '../coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // cli runner port
    runnerPort: 9100,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera (has to be installed with `npm install karma-opera-launcher`)
    // - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
    // - PhantomJS
    // - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
    browsers: ['PhantomJS'], //'Chrome', 'Firefox', 'Safari']


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    plugins: [
      'karma-sinon',
      'karma-jasmine',
      'karma-phantomjs-launcher',
      'karma-ng-html2js-preprocessor',
      'karma-coverage'
    ]
  });
};