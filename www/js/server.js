var express = require('express');
var app = express();
var notesArray = [{
    date: '20150531',
    name: 'Astrid',
    text: 'Vanavond werken'
}, {
    date: '20150531',
    name: 'Maaike',
    text: 'Trainen'
}, {
    date: '20150601',
    name: 'Inge',
    text: 'Ben weg'
}, {
    date: '20150601',
    name: 'Maaike',
    text: 'Werken'
}, {
    date: '20150601',
    name: 'Theo',
    text: 'Thuis'
}];

app.get('/out', function (req, res) {
    res.send('Hello World!');
});

app.get('/*', function(req, res){
    var obj = {};
    obj.title = 'title';
    obj.data = 'data';

    console.log('params: ' + JSON.stringify(req.params));
    console.log('body: ' + JSON.stringify(req.body));
    console.log('query: ' + JSON.stringify(req.query));
    console.log('callback: ' + JSON.stringify(req.query.callback));

    res.header('Content-type','application/json');
    res.header('Charset','utf8');
//res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
    res.jsonp( JSON.stringify(notesArray) );
//res.jsonp( notesArray );
});

var server = app.listen(1337, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});



