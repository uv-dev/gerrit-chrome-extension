(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Saves options to localStorage.
function save_options() {
  try {
    localStorage['api_endpoint'] = document.getElementById('api_endpoint').value.replace(/\/*$/, '');
    localStorage['uname'] = document.getElementById('uname').value || '';
    localStorage['refresh'] = document.getElementById('refresh').value || '';
    localStorage['http_password'] = document.getElementById('http_password').value || '';
    localStorage['query'] = document.getElementById('query').value || '';
    // TODO: chrome.permissions.request
    chrome.runtime.reload();
  } catch (e) {
    // TODO: handle validation errors
  }
}

function getLocalStorageValue(key, def) {
  return typeof localStorage[key] !== 'undefined' ?
          localStorage[key] : def;
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  document.getElementById('api_endpoint').value = getLocalStorageValue('api_endpoint', '');
  document.getElementById('uname').value = getLocalStorageValue('uname', '');
  document.getElementById('refresh').value = getLocalStorageValue('refresh', '5');
  document.getElementById('http_password').value = getLocalStorageValue('http_password', '');
  document.getElementById('query').value = getLocalStorageValue('query', '');
}

function updateTestUrl() {
  var query = document.getElementById('query').value;
  if (!query) {
    query = 'is:open+reviewer:self+-owner:self';
  }
  var url = document.getElementById('api_endpoint').value +
      '/#/q/' + query;
  var div = document.getElementById('test-url');
  div.innerHTML = '';
  var a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.textContent = url;
  div.appendChild(a);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);

var testUrlDiv = document.getElementById('test-url');
document.getElementById('api_endpoint').addEventListener('keyup', updateTestUrl);
document.getElementById('query').addEventListener('keyup', updateTestUrl);

},{}]},{},[1]);
