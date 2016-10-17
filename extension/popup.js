function getDelta(change) {
  var td = document.createElement('td');
  var ins = change.insertions ? change.insertions : 0;
  var del = change.deletions ? change.deletions : 0;
  td.textContent = '+' + ins + ',-' + del;
  return td;
}

function getCodeReview(change) {
  var review = change.labels['Code-Review'];
  var cr = review.rejected ? -2
    : review.disliked ? -1
    : review.recommended ? 1
    : review.approved ? 2
    : 0;
  var td = document.createElement('td');
  td.textContent = cr == 2 ? '+2'
    : cr == 1 ? '+1'
    : cr == 0 ? ''
    : cr == -1 ? '-1'
    : '-2';
  td.style['color'] = cr > 0 ? 'green'
    : cr < 0 ? 'red'
    : '';
  return td;
}

function getVerified(change) {
  var verified = change.labels.Verified.approved ? 1
    : change.labels.Verified.rejeced ? -1
    : false;
  var td = document.createElement(td);
  td.textContent = verified > 0 ? '+1'
    : verified < 0 ? '-1'
    : '';
  td.style['color'] = verified > 0 ? 'green'
    : verified < 0 ? 'red'
    : '';
  return td;
}

function initUI(items) {
  var list = document.getElementById('list_body');
  list.innerHTML = '';
  for (var i = 0; i < items.changes.length; i++) {
    var change = items.changes[i];
    if (change.reviewed)
        continue;

    try {
      change.read = new Date(items.timestamps[change._number]) >= new Date(change.updated);
    } catch (e) {
    }

    var tr = document.createElement('tr');
    var link = document.createElement('td');
    var message = document.createElement('td');

    var a = document.createElement('a');
    a.href = '#';
	var BASE_URL = localStorage['api_endpoint'];
    a.addEventListener('click', function(e) {
      chrome.tabs.update(null, {
          url: BASE_URL + '/' + this.textContent
      });
    });

    a.textContent = change._number;
    link.appendChild(a);

    message.textContent = change.subject;

    tr.appendChild(link);
    tr.appendChild(message);
    tr.appendChild(getDelta(change));
    tr.appendChild(getCodeReview(change));
    tr.appendChild(getVerified(change));

    if (change.read) {
      tr.className = 'read';
    }

    // TODO Use change.labels.Verified and change.labels.Code-Review here
    // See https://gerrit.magicleap.com/Documentation/rest-api-changes.html#list-changes
    list.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['changes', 'timestamps'], initUI);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.changes && changes.timestamps) {
    initUI({
        'changes': changes.changes.newValue,
        'timestamps': changes.timestamps.newValue
    });
  } else {
    chrome.storage.local.get(['changes', 'timestamps'], initUI);
  }
});
