var FIND = /cl\/(\d+)/ig;
var ROOT_URL;
var isFindReplaceRunning = false;

function findReplace(node) {
  isFindReplaceRunning = true;
  findAndReplaceDOMText(node, {
    preset: 'prose',
    find: FIND,
    replace: function(portion, match) {
      var a = document.createElement('a');
      a.setAttribute('href', ROOT_URL + '/#/c/' + match[1]);
      a.innerHTML = match[0];
      return a;
    },
    filterElements: function(element) {
      return !(/a/i.test(element.nodeName));
    }
  });
  isFindReplaceRunning = false;
}

chrome.runtime.sendMessage({method: "getRootUrl"}, function(response) {
  ROOT_URL = response.data;
  REPLACE = '<a href=\'' + response.data + '/#/c/$1\'>cl/$1</a>';
  findReplace(document.body);
  document.body.addEventListener('DOMNodeInserted', function(event) {
    if (isFindReplaceRunning) {
      return;
    }
    findReplace(event.relatedNode);
  }, false);
});
