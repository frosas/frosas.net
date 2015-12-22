(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-25757791-4', 'auto');
ga('send', 'pageview');

(function() {
    var trackExternalLink = function(a) {
        ga('send', {
            hitType: 'event',
            eventCategory: 'External link',
            eventAction: 'Click',
            eventLabel: a.href,
            transport: 'beacon'
        });
    };
    
    document.body.addEventListener('click', function(event) {
        trackExternalLink(event.target);
    });
})();

(function() {
    var preloadImage = function(url, callback) {
        var image = new Image;
        image.src = url;
        image.onload = function() { callback(); };
        image.onerror = function(error) { callback(error); }
    };
    
    var getUnsplashImage = function(attempts, callback) {
        if (!attempts) return console.log('[Unsplash] Aborting image load, no attempts remaining.');
        console.log('[Unsplash] Selecting image...');
        var url = 'https://api.unsplash.com/photos/random?' +
            'client_id=b75898bd3b9fe8ac5eca258e5ee3f8d6c7bd9de35b0e46ee5136c6b8a32b7149&' +
            'featured=1&' +
            'w=' + window.screen.width + '&' +
            'h=' + window.screen.height + '&' +
            Date.now(); // Needed to be truly random
        $.ajax(url).then(
            function(image) {
                // Preload the image so that the opacity transition of the background
                // element doesn't start before it is loaded
                console.log('[Unsplash] Loading image...');
                var url = image.urls.custom + '&fit=min';
                preloadImage(url, function(error) {
                    if (error) {
                        console.log(error);
                        getUnsplashImage(attempts - 1, callback);
                        return;
                    }
                    console.log('[Unsplash] Image loaded');
                    callback({url: url, color: image.color});
                });
            },
            function(error) {
                console.log(error);
                getUnsplashImage(attempts - 1, callback);
            }
        );
    };
    
    var themeColorEl = document.querySelector('meta[name=theme-color]');
    
    (function updateBackgroundPeriodically() {
        // TODO Remove previous background once the transition finishes
        var element = document.createElement('div');
        element.className = 'background';
        document.body.appendChild(element);
        getUnsplashImage(3 /* attempts */, function(image) {
            themeColorEl.content = image.color;
            element.style.backgroundImage = 'url(' + image.url + ')';
            element.style.backgroundPosition = 'center';
            element.style.backgroundSize = 'cover';
            element.style.opacity = '1';
            // TODO Enable it back once my requests rate limit is raised
            // setTimeout(updateBackgroundPeriodically, 10000);
        });
    })();
})();
