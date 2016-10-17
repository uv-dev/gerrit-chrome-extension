(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function queryChangeList(q) {
  var api_endpoint = localStorage.api_endpoint;
  var uname = localStorage.uname;
  var http_password = localStorage.http_password;
  chrome.webRequest.onAuthRequired.addListener(function(details) {
      return {
          authCredentials: {
              username: uname,
              password: http_password
            }
        };
    },
  {urls: [api_endpoint + '/*']},
  ['blocking']);
  return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', api_endpoint + '/changes/?q=' + q);
      xhr.send();
      // call to reject() is ignored once resolve() has been invoked
      xhr.onload = function() {
          try {
            resolve(JSON.parse(xhr.responseText.substr(5)));
          } catch (e) {
            reject(new TypeError(e.message));
          }
        };
      xhr.onloadend = function() {
          reject(new Error('Network error'));
        };
    });
}

},{}]},{},[1]);
