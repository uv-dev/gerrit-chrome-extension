var BASE_URL = localStorage["api_endpoint"];

function makeDD(change) {
    var dd = document.createElement('dd');
    dd.title = JSON.stringify(change, null, "  ");
    dd.textContent = change.subject;
    if (change.read)
        dd.className = "read";
    return dd;
}

function initUI(items) {
    var list = document.getElementById('list');
    list.innerHTML = "";
    for (var i = 0; i < items.changes.length; i++) {
        var change = items.changes[i];
        if (change.reviewed)
            continue;

        try {
            change.read = new Date(items.timestamps[change._number]) >= new Date(change.updated);
        } catch (e) {
        }

        var dt = document.createElement('dt');
        var a = document.createElement('a');
        a.href = "#";
        a.addEventListener('click', function(e) {
            chrome.tabs.update(null, {
                url: BASE_URL + "/" + this.textContent
            })
        })

        a.textContent = change._number;
        dt.appendChild(a);
        list.appendChild(dt);

        list.appendChild(makeDD(change));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(["changes", "timestamps"], initUI);
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.changes && changes.timestamps) {
        initUI({
            "changes": changes.changes.newValue,
            "timestamps": changes.timestamps.newValue
        });
    } else {
        chrome.storage.local.get(["changes", "timestamps"], initUI);
    }
});
