chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('harviewer/index.html', {
        bounds: {
            width: 800,
            height: 600
        }
    });
});
