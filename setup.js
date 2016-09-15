/*eslint-disable */

'use strict';

var prompt = require('prompt');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var configFile = path.join(__dirname, 'app/scripts/config.js');

console.log(chalk.cyan('This utility will walk you through setting up MIC Flow for HTML5.'));
console.log(chalk.cyan('Please refer to http://devcenter.kinvey.com/html5/guides/mobile-identity-connect on how to setup MIC. Defaults are shown next to the question.'))
console.log(chalk.cyan('Press ^C at any time to quite.'));
console.log('');

// Customize the prompt
prompt.message = '';
prompt.delimiter = '';

// Start the prompt
prompt.start();

// Get appKey, appSecret, and redirectUri
prompt.get({
  properties: {
    appKey: {
      description: chalk.white('What is your app key?'),
      required: true
    },
    appSecret: {
      description: chalk.white('What is your app secret?'),
      required: true
    },
    apiHostname: {
      description: chalk.white('What is the API hostname?'),
      default: 'https://baas.kinvey.com'
    },
    micHostname: {
      description: chalk.white('What is the MIC hostname?'),
      default: 'https://auth.kinvey.com'
    },
    redirectUri: {
      description: chalk.white('What is your redirect uri?'),
      default: 'http://localhost:9000/callback',
      required: true
    },
    micVersion: {
      description: chalk.white('Which version of MIC is required?'),
      default: 'v1',
      required: true
    }
  }
}, function(err, result) {
  if (err) {
    console.log(chalk.red(err));
    return;
  }

  var configFileData = '\'use strict\';\n' +
    '\n' +
    'window.APP_KEY = \'' + result.appKey + '\';\n' +
    'window.APP_SECRET = \'' + result.appSecret + '\';\n' +
    'window.API_HOSTNAME = \'' + result.apiHostname + '\';\n' +
    'window.MIC_HOSTNAME = \'' + result.micHostname + '\';\n' +
    'window.REDIRECT_URI = \'' + result.redirectUri + '\';\n' +
    'window.MIC_VERSION = \'' + result.micVersion + '\';\n' +
    'window.MIC_OPTIONS = {\'version\': window.MIC_VERSION };\n';

  console.log();
  console.log('About to write to ' + configFile + '.');
  console.log();
  console.log(chalk.bgBlack(configFileData));
  console.log();

  // Check if it is correct
  prompt.get({
    properties: {
      correct: {
        description: chalk.white('Is this ok?'),
        default: 'yes'
      }
    }
  }, function(err, result) {
    if (err) {
      console.log(chalk.red(err));
      return;
    }

    if (result.correct.toLowerCase() === 'yes' || result.correct.toLowerCase() === 'y') {
      // Write config file
      fs.writeFile(configFile, configFileData, function(err) {
        if (err) {
          console.log(chalk.red(err));
          return;
        }

        console.log(chalk.white('Done. Start the application by running `npm start`.'));
      });
    }
    else {
      console.log(chalk.red('Aborted.'));
    }
  });
});
