var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static(__dirname + '/public'));

var answer = 'None';
var question = 'None';

var _Global={};
_Global.Dynamic=[{}];//team name



app.get('/submit', function (req, res) {
  question = req.query.text;
  _Global.Dynamic[0].id="hi";
  _Global.Dynamic[0].No=1;
  console.log(_Global.Dynamic[0].No +" "+_Global.Dynamic[0].id);
  res.send(question);
});

app.get('/res', function (req, res) {
  answer = req.query.text;
});

app.get('/answer', function (req, res) {
  var tmp = answer;
  answer = 'none';
  res.send(tmp);
});

app.get('/question', function (req, res) {
  var tmp = question;
  question = 'none';
  res.send(tmp);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

