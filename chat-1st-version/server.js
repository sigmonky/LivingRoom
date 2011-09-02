/**
 * @author Nils Dehl <mail@nils-dehl.de>
 */
var http = require('http'),
		sys  = require('sys'),
		fs   = require('fs'),
		io   = require('socket.io');
var Connect = require('connect');

var server = Connect.createServer();

server.use(Connect.logger());
server.use(Connect.static(__dirname));

var socket = io.listen(server);

socket.on('connection', function(client) {

	var user;

	client.on('message', function(message) {
		if (!user) {
			user = message;
			client.send({ message: 'Welcome, ' + user.nickname + '!', nickname: 'server', gravatar: '' });
			return;
		}
		var response = {
			'nickname': user.nickname,
			'gravatar': user.gravatar,
			'message': message.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
		};
		socket.broadcast(response);
	});

});

server.listen(4000);