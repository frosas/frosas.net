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
    console.log('Selecting background...');
    var url = 'https://api.unsplash.com/photos/random?featured&client_id=b75898bd3b9fe8ac5eca258e5ee3f8d6c7bd9de35b0e46ee5136c6b8a32b7149';
    $.ajax(url).then(function(image) {
        console.log('Loading background...');
        preloadImage(image.urls.regular, function(url) {
            console.log('Background loaded');
            var element = document.querySelector('.background');
            element.style.backgroundImage = 'url(' + url + ')';
            element.style.backgroundPosition = 'center';
            element.style.backgroundSize = 'cover';
            element.style.opacity = '1';
        });
    });
    
    var preloadImage = function(url, callback) {
        var image = new Image;
        image.src = url;
        image.onload = function() { callback(url); };
    };
})();
