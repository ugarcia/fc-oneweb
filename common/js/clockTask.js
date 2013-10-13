
self.onmessage = function(event) {
    setInterval(function() { self.postMessage(new Date()) }, '1000');
};
