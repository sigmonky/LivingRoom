"use strict";

var JabberClient = {};

//
//Models
//=======
// This is tool from [JavascriptMVC](http://javascriptmvc.com/) framework.
// It used to create binded to `this` callbacks, when _.bind() can not do this.
JabberClient.JsmvcCallback = {
	callback: function( funcs ) {
		var makeArray = $.makeArray,
		isFunction = $.isFunction,
		isArray = $.isArray,
		extend = $.extend,
		concatArgs = function(arr, args){
			return arr.concat(makeArray(args));
		};
		
		// args that should be curried
		var args = makeArray(arguments),
		self;
		
		funcs = args.shift();
		
		if (!$.isArray(funcs) ) {
			funcs = [funcs];
		}
		
		self = this;
		for( var i =0; i< funcs.length;i++ ) {
			if(typeof funcs[i] == "string" && !isFunction(this[funcs[i]])){
				throw ("class.js  does not have a "+funcs[i]+" method!");
			}
		}
		return function class_cb() {
			var cur = concatArgs(args, arguments),
			isString, 
			length = funcs.length,
			f = 0,
			func;
			
			for (; f < length; f++ ) {
				func = funcs[f];
				if (!func ) {
					continue;
				}
				
				isString = typeof func == "string";
				if ( isString && self._set_called ) {
					self.called = func;
				}
				cur = (isString ? self[func] : func).apply(self, cur || []);
				if ( f < length - 1 ) {
					cur = !isArray(cur) || cur._use_call ? [cur] : cur;
				}
			}
			return cur;
		};
	}
};



JabberClient.Xmpp = function(options) {
	if (!options) options = {}; 
    if (this.defaults) options = _.extend(this.defaults, options);
    this.options = options;
    this.initialize();
};

_.extend(JabberClient.Xmpp, JabberClient.JsmvcCallback, Backbone.Events, {

	onMessage: function(msg){
		console.log('onmessage');
	},
	
	initialize: function () {
		
		var startTime = null;
	 	var BOSH_SERVICE = '/http-bind';

		this.conn = new Strophe.Connection(BOSH_SERVICE);
		
		// Strophe.log = function (lvl, msg) { log(msg); };
		this.conn.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);

		this.conn.rawInput = function (data) {
				log('RECV: ' + data);
			};
		
			this.conn.rawOutput = function (data) {
				log('SENT: ' + data);
			};
		
		// send disco#info to jabber.org
		var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()
		
		this.conn.send(iq);
		
		this.bind('connected', this.onConnect);
		
		var account;
		//this.chatViews = new Array();
		console.log('JabberClient init chatViews'+this.chatViews);

		this.joinRoom(RoomJid)

		this.conn.addHandler(this.handle_muc_message, null, 'message', 'groupchat', null,  null); 

		console.log('JabberClient init this.connec ='+this.conn);

		// various elems we want convenient access to
		// this.$roster = $('#roster');
		// this.$chats = $('#chats');

		// debug traffic toggle
		this.show_traffic = false;
	},
	
	onConnect: function(){
		console.log('onConnect ')

	},
	
	joinRoom: function(roomJid){
		var roomJid = roomJid;
		var nickname = 'guest_'+Math.floor(Math.random()*1111001);
		console.log('JabberClient.conn =' +JabberClient.conn);
		this.conn.muc.join(roomJid, nickname, JabberClient.roomMessageHandler, JabberClient.roomPresenceHandler);
	},

	roomPresenceHandler : function(obj){
		console.log('room presence handler '+obj)
	},

	roomMessageHandler : function(obj){
		console.log('room roomMessageHandler '+obj)
	},

	send_muc_message: function (room, body) {
		this.conn.muc.message(room, 'nickxx', body);
	},
	
	handle_muc_message: function (message) {
		console.log('handle_muc_message body' +message.body);
		console.log('handle_muc_message room' +message.room);
		console.log('handle_muc_message nickname' +message.nickname);
	
		// var chat_div;
		// 	
		// chat_div = JabberClient.get_or_create_muc(message.room);
		// 	
		// if (message.body) {
		// 	chat_div.children('ul').append(ICH.chat_message({
		// 		message: message.body,
		// 		name: Strophe.getNodeFromJid(message.room)
		// 	}));
		// 
		// 	//JabberClient.scroll_chat(message.room);
		// }

		return true;
	},
	
});