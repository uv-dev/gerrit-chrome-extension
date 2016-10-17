(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function fetchChanges(update_id) {
  console.debug('fetching changes...');
  chrome.browserAction.setBadgeBackgroundColor({color: '#F00'});
  var query = localStorage['query'] ||
      (['is:open', 'reviewer:self', '-owner:self'].join('+') + '&o=LABELS');
  console.debug('query = ' + query);
  queryChangeList(query).then(
     function(result) {
          console.debug('got changes:', result.length);
          chrome.storage.local.set({'changes': result});

          // update timestamp/read state
          var updated = result.filter(function(o) { return o._number === update_id; }).pop().updated;
          chrome.storage.local.get('timestamps', function(items) {
              var timestamps = items.timestamps || {};
              timestamps[update_id] = updated;
              chrome.storage.local.set({'timestamps': timestamps});
            });
        }, function(e) {
          console.warn('failed to fetch changes:', e.message);
          delete chrome.storage.local.changes;
        });
}

function updateIcon(changes) {
  try {
    var unread = changes.filter(function(value, index, array) {return !value.reviewed;});
  } catch (e) {
  }
  chrome.browserAction.setBadgeText({text: unread && unread.length.toString() || '...'});
}

function onAlarm(alarm) {
  console.debug('background.onAlarm...');
  fetchChanges();
}

function favicon(url) {
  var split = url.split('://');
  var host = split.pop();
  if (!host) throw new Error;
  var scheme = split.pop();
  return (scheme ? scheme + '://' : '') + host.split('/').shift() + '/favicon.ico';
}

function getAlarmRefreshMinute() {
  return typeof localStorage.refresh !== 'undefined' ?
    parseInt(localStorage.refresh) : 5;
}
function onStartup() {
  console.debug('background.onStartup...');

  try {
    chrome.browserAction.setIcon({path: favicon(localStorage['api_endpoint'])});
  } catch (e) {
  }

  chrome.storage.local.get('changes', function(items) {
      updateIcon(items.changes);
    });
  fetchChanges();
  chrome.alarms.create('refresh', {periodInMinutes: getAlarmRefreshMinute()});
  chrome.browserAction.setBadgeBackgroundColor({color: '#000'});
}

function onNavigate(details) {
  console.debug('onNavigate', details.url);
  try {
    var update_id = parseInt(details.url.match(/#\/c\/(\d+)/)[1]);
    fetchChanges(update_id);
  } catch (e) {
    console.warn('Failed to parse id for', details.url);
  }
}

chrome.alarms.onAlarm.addListener(onAlarm);
chrome.runtime.onStartup.addListener(onStartup);
chrome.runtime.onInstalled.addListener(onStartup);
chrome.runtime.onSuspend.addListener(function() {
    chrome.browserAction.setBadgeBackgroundColor({color: '#888'});
  });
chrome.runtime.onSuspendCanceled.addListener(function() {
    chrome.browserAction.setBadgeBackgroundColor({color: '#F0F'});
  });
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) {
      var storageChange = changes[key];
      console.debug('Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
          key,
          namespace,
          storageChange.oldValue,
          storageChange.newValue);
      if (key === 'changes') {
        updateIcon(storageChange.newValue);
      }
    }
  });
chrome.webNavigation.onReferenceFragmentUpdated.addListener(onNavigate, {
    url: [
        {hostSuffix: localStorage['api_endpoint'].split('://').pop()}
    ]
  });
chrome.webNavigation.onCommitted.addListener(onNavigate, {
    url: [
        {hostSuffix: localStorage['api_endpoint'].split('://').pop()}
    ]
  });

},{}]},{},[1]);
