function queryChangeList(q) {
    var api_endpoint = localStorage["api_endpoint"];
    var uname = localStorage["uname"];
    var http_password = localStorage["http_password"];
    chrome.webRequest.onAuthRequired.addListener(function (details) {
        return {
            authCredentials: {
                username: uname,
                password: http_password
            }
        };
    },
    {urls: ["<all_urls>"]},
    ['blocking']);
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", api_endpoint + '/changes/?q=' + q);
        xhr.send();
        // call to reject() is ignored once resolve() has been invoked
        xhr.onload = function() {
            try {
                resolve(JSON.parse(xhr.responseText.substr(5)));
            } catch (e) {
                reject(new TypeError(e.message));
            }
        }
        xhr.onloadend = function() {
            reject(new Error("Network error"));
        }
    });
}
