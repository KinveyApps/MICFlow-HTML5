/* global Kinvey, $ */

'use strict';

var apiHostName = window.API_HOSTNAME;
var appKey = window.APP_KEY;
var appSecret = window.APP_SECRET;
var redirectUri = window.REDIRECT_URI;
var micHostName = window.MIC_HOSTNAME;
var micOptions = window.MIC_OPTIONS;

var app = window.app = {
  init: function(options) {
    Kinvey.init(options);
    return Kinvey.ping().then(function(response) {
      console.log(response);
      return Kinvey.User.getActiveUser();
    }).then(function(user){
      if (user) {
        user = user.me();
      }

      $('#initialize').fadeOut(250);

      if (user) {
        $('#logout').fadeIn(250);
      }
      else {
        $('#login').fadeIn(250);
      }
    })
    .catch(function(err){
      console.log(err);
      if (err.name === 'InvalidCredentialsError') {
        $('#initialize').fadeOut(250);
        app.logout();
      }
      else {
        $('#initialize').html('<b>An error has occurred:</b> ' + err).addClass('text-closed');
        $('#initialize').append('<p>Please make sure you followed all the instructions in the README to setup the project. The README can be found at the root of the project. Did you forget to run <b>node ./setup</b>?');
      }
    });
  },

  login: function() {
    return Kinvey.User.loginWithMIC(redirectUri, Kinvey.AuthorizationGrant.AuthorizationCodeLoginPage, micOptions).then(function(user) {
      console.log(user);
      $('#login').fadeOut(250, function() {
        $('#logout').fadeIn(250);
      });
      return user;
    }).catch(function(err) {
      $('#initialize').html('<b>An error has occurred:</b> ' + err).addClass('text-closed');
      $('#initialize').append('<p>Please make sure you followed all the instructions in the README to setup the project. The README can be found at the root of the project. Did you forget to run <b>node ./setup</b>?');
    });
  },

  logout: function() {
    return Kinvey.User.logout().then(function() {
      $('#logout').fadeOut(250, function() {
        $('#login').fadeIn(250);
      });
    }).catch(function(err) {
      $('#initialize').html('<b>An error has occurred:</b> ' + err).addClass('text-closed');
      $('#initialize').append('<p>Please make sure you followed all the instructions in the README to setup the project. The README can be found at the root of the project. Did you forget to run <b>node ./setup</b>?');
    });
  }
};

// Initialize the app
app.init({
  //apiHostName: apiHostName,
  appKey: appKey,
  appSecret: appSecret
  //micHostName: micHostName
}).catch(function(err) {
  $('#initialize').html('<b>An error has occurred:</b> ' + err).addClass('text-closed');
  $('#initialize').append('<p>Please make sure you followed all the instructions in the README to setup the project. The README can be found at the root of the project. Did you forget to run <b>node ./setup</b>?');
});
