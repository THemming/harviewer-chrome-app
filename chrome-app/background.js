chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('harviewer/index.html', {
        bounds: {
            width: 1200,
            height: 700
        }
    });
});
