const cors_proxy = require('cors-anywhere');

const host = 'localhost';
const port = 8010;

cors_proxy.createServer({
    originWhitelist: ['http://localhost:3000', 'https://gorgeous-croissant-5c8b72.netlify.app'], // Allow specific origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});
