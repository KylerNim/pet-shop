let fs = require('fs');
let http = require('http');
let port = process.env.PORT || 8000;

fs.readFile('./../pets.json', 'utf8', (error, data) => {
    if (error) {
        console.error('kick rocks');
    }

    let json = JSON.parse(data);
    
    let server = http.createServer(function(req, res) {
        console.log('processing request...')
        handler(json, req, res);
    });
    
    server.listen(port, function() {
        console.log('listening on port', port);
    });
})

function handler(json, req, res) {
    const error404 = function() {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'plain/text');
        res.end('Ye, Nah');
    }
    if (req.method === 'GET') {
        let petRegExp = /^\/pets\/([0-9]+)$/;
        let digits = req.url.match(petRegExp);
        if (req.url === '/pets') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(json));
            return;
        } else if (digits) {
            let index = parseInt(digits[1]);
            if (json[index]) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(json[index]));
                return;
            } else {
                error404();
                return;
            }
        }
    } else if (req.method === 'POST' && req.url === '/pets') {
        let body = '';
        req.on('data', (chunk)=>{
            body += chunk.toString();
        });
        req.on('end', ()=>{
            let parsedBody = JSON.parse(body);
            if (parsedBody.age && parsedBody.kind && parsedBody.name && typeof parsedBody.age === 'number') {
                fs.writeFile('./../pets.json', JSON.stringify(json.concat(parsedBody)), (error)=> {
                    if (error) {
                        console.error('OH SHIT, WE CANT WRITE, OH MY GOD, PLEASE');
                        res.end();
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(parsedBody));
                        return;
                    }
                });
            } else {
                error404();
            }
        });
    } else {
        error404();
    }
}
