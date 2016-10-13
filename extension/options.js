// Saves options to localStorage.
function save_options() {
  try {
    localStorage['api_endpoint'] = document.getElementById('api_endpoint').value.replace(/\/*$/, '');
    localStorage['uname'] = document.getElementById('uname').value || '';
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
