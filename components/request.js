/**
 * Created by Amirka on 21.04.2017.
 */

module.exports = (_req, callback) => {
    var protocol = _req.protocol || ENV.protocol || 'http';
    var isHTTPS = protocol === 'https';
    var post = _req.post;
    var postData = isObject(post) ? JSON.stringify(post) : post;

    var requestOptions = {
        host: _req.hostname || 'localhost',
        port: _req.port || ENV.port || (isHTTPS ? 443 : 80),
        path: _req.path,
        method: _req.method,
        headers: [ _req.headers ].merge({
            'Content-Type': 'application/json; charset=utf-8',
            'Content-Length': Buffer.byteLength(postData)
        })
    };
    var output = [];
    var req = (isHTTPS ? https : http).request(requestOptions, (res) => {
        //console.log('res.headers', res.headers);
        res.setEncoding('utf8');
        res.on('data', (chunk) => output.push(chunk));
        res.on('end', () =>  callback(true, output.join('')));
    });
    req.on('error',(e) => {
        callback(false, '');
    });

    req.write(postData);
    req.end();

};