
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var item = require('./routes/item');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/items', item.list);
app.post('/items', item.create);
app.put('/items/:id', item.update);
//app.put('/items/:id/reposition/:new_position', item.move);
app.delete('/items/:id', item.deleteItem);

http.createServer(app).listen(app.get('port'), function(){
 	
});
