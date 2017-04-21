/**
 * Created by Amirka on 21.04.2017.
 */

router.endUse((_req, _res, next) => {
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
    var req = (isHTTPS ? https : http).request(requestOptions, (res) => {
        //console.log('res.headers', res.headers);
        res.setEncoding('utf8');
        res.on('data', (chunk) => _res.write(chunk));
        res.on('end', () =>  _res.end());
    });
    req.on('error', (e) => {
        
        _res.abort();
    });

    req.write(postData);
    req.end();

});