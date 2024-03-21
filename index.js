var http = require('http');
var fs = require('fs');
var path = require('path');

const rootdir = "./data/";
http.createServer(function (request, response) {
    var url = request.url.split('?')[0];
    console.log('GET ' + url);

    var filePath = rootdir + url;
    if (url == "/")
        filePath = rootdir+'index.html';

    //console.log('filePath == rootdir: ' + filePath + " == " + rootdir);

    var extname = path.extname(filePath);
    var contentType = 'application/octet-stream';
    switch (extname) {
        case '.html':
            contentType = 'text/html';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                console.log(url + " NOT FOUND");
                fs.readFile(rootdir+'/404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Got error '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);
console.log('Server running at http://0.0.0.0:8125/');
