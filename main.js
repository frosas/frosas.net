(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-25757791-4', 'auto');
ga('send', 'pageview');

(function() {
    var trackExternalLink = function(url) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'External link',
            eventAction: 'Click',
            eventLabel: url,
            transport: 'beacon'
        });
    };
    
    document.addEventListener('click', function(event) {
        trackExternalLink(event.target.href);
    });
})();

(function() {
    var preloadImage = function(url, callback) {
        var image = new Image;
        image.src = url;
        image.onload = function() { callback(); };
        image.onerror = function(error) { callback(error); }
    };
    
    var fetch = function(url, callback) {
        var request = new XMLHttpRequest;
        request.onload = request.onerror = request.onabort = function() { callback(this); };
        request.open('GET', url, true);
        request.send();
    };
    
    var getUnsplashImage = function(callback) {
        console.log('[Unsplash] Selecting image...');
        var url = 'https://api.unsplash.com/photos/random?' +
            'client_id=b75898bd3b9fe8ac5eca258e5ee3f8d6c7bd9de35b0e46ee5136c6b8a32b7149&' +
            'featured=1&' +
            'w=' + innerWidth + '&' +
            'h=' + innerHeight + '&' +
            Date.now(); // Needed to be truly random
        fetch(url, function(request) {
            try { var image = JSON.parse(request.responseText); }
            catch (error) { return callback(error); }
            callback(null, {
                url: image.urls.custom + '&fit=min',
                color: image.color,
                user: image.user
            });
        });
    };
    
    // Preload the image so that the opacity transition of the background
    // element doesn't start before it is loaded
    var getPreloadedUnsplashImage = function(callback) {
        getUnsplashImage(function(error, image) {
            if (error) return callback(error);
            console.log('[Unsplash] Loading image...');
            preloadImage(image.url, function(error) {
                callback(error, image);
            });
        });
    };
    
    /**
     * @param {number} attempts Total amount of attempts
     * @param {Function} callback Node-style function to retry
     * @return {Function} A function that will execute `callback` up to `attempts`
     *     times in case of error.
     */
    var retryify = function(attempts, callback) {
        // TODO Handle synchronous errors
        return function() { // The "retryifee"
            var localAttempts = attempts;
            var localArgs = [].slice.call(arguments);
            var localCallback = localArgs.pop();
            (function retry() {
                if (!localAttempts--) return localCallback(new Error('No attempts remaining, aborting.'));
                callback.apply(null, localArgs.concat(function(error) {
                    if (error) {
                        console.error(error);
                        return retry.apply(null, arguments);
                    }
                    localCallback.apply(null, arguments);
                }));
            })();
        };
    };
    
    var themeColorEl = document.createElement('meta');
    themeColorEl.name = 'theme-color';
    themeColorEl.content = getComputedStyle(document.body).getPropertyValue('background-color');
    document.head.appendChild(themeColorEl);
    
    var element = document.createElement('div');
    element.className = 'background';
    document.body.appendChild(element);
    retryify(3 /* attempts */, getPreloadedUnsplashImage)(function(error, image) {
        if (error) throw error;
        
        console.log('[Unsplash] Image loaded');
        
        themeColorEl.content = image.color;
        
        element.style.backgroundImage = 'url(' + image.url + ')';
        element.style.backgroundPosition = 'center';
        element.style.backgroundSize = 'cover';
        element.style.opacity = '1';
        
        var creditsEl = document.createElement('div');
        creditsEl.classList.add('credits');
        creditsEl.innerHTML = document.querySelector('#credits-template').textContent;
        var authorEl = creditsEl.querySelector('.author');
        authorEl.textContent = image.user.name;
        authorEl.href = image.user.links.html;
        document.body.appendChild(creditsEl);
    });
})();
