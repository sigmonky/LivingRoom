//
// Declare namespace
Jabber = {};

//
//Models
//=======
// This is tool from [JavascriptMVC](http://javascriptmvc.com/) framework.
// It used to create binded to `this` callbacks, when _.bind() can not do this.
Jabber.JsmvcCallback = {
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



//
//Main class
//==========
//
Jabber.Xmpp = function(options) {
	if (!options) options = {}; 
    if (this.defaults) options = _.extend(this.defaults, options);
    this.options = options;
    this.initialize();
};


//Xmpp class implementation
//-------------------------
 
_.extend(Jabber.Xmpp.prototype, Jabber.JsmvcCallback, Backbone.Events, {
//	Default options can be overriden in constructor:
//	
//	`chat = new Jabber.Xmpp({'jid': 'me@jabber.org})`
	defaults: {
		jid: 'isaacueca@logoslogic.com',
		password: 'cigano',
		bosh_service: '/http-bind',
		view_el_id: 'online-block'
	},
	initialize: function(){
		
		var BOSH_SERVICE = '/http-bind';
		this.connection = new Strophe.Connection(BOSH_SERVICE);
		
		// Strophe.log = function (lvl, msg) { log(msg); };
		this.connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, this.onConnect);
		
		this.connection.rawInput = function (data) {
				log('RECV: ' + data);
			};
		
			this.connection.rawOutput = function (data) {
				log('SENT: ' + data);
			};
		
		// send disco#info to jabber.org
		var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()
		
		this.connection.send(iq);
		
		this.bind('connected', this.onConnect);
		
		this.joinRoom(RoomJid)
		
		
// 		this.connection = new Strophe.Connection(this.options.bosh_service);
// 		// this.roster = new Jabber.Roster();
// 		// this.chatlog = new Jabber.ChatLog();
// 		// this.view = new Jabber.ChatView({
// 		// 	el: $('#'+this.options.view_el_id)
// 		// });
// 		// this._welcomeSent = false;
// //	    this.connection.rawInput = function (data) { console.log('RECV: ' + data); };
// //	    this.connection.rawOutput = function (data) { console.log('SEND: ' + data); };
// //		listen events
// 		this.bind('connected', this.onConnect);
// 		if (this.options.autoConnect){
// 			this.connect();
// 		}
// 		this.chatlog.bind('add', this.callback('onMessageAdd'));
// 		this.view.bind('send:message', this.callback('sendMessage'));
	},
	
	onMessage: function(msg){
		console.log('onmessage');
	},
	
	
	onConnect: function(){
		console.log('onConnect ')
	
	},
	
	joinRoom: function(roomJid){
		var roomJid = roomJid;
		var nickname = 'guest_'+Math.floor(Math.random()*1111001);
		console.log('JabberClient.conn =' +JabberClient.conn);
		this.connection.muc.join(roomJid, nickname, this.roomMessageHandler, this.roomPresenceHandler);
	},
	
	roomPresenceHandler : function(obj){
		console.log('room presence handler '+obj)
	},
	
	roomMessageHandler : function(obj){
		console.log('room roomMessageHandler '+obj)
	},
	
	send_muc_message: function (room, body) {
		this.connection.muc.message(room, 'nickxx', body);
	},
	
	connect: function(){
		this.connection.connect(this.options.jid, this.options.password, this.callback('onConnectChange'));
		this.trigger('ui:connect');
	},
	
	onConnectChange: function(status_code, error){
		for (st in Strophe.Status) {
			if (status_code === Strophe.Status[st]) {
//				console.log('status: ' + st);
			}
		}
		if (status_code === Strophe.Status.CONNECTED) {
			this.trigger('connected');
		}
	},
	
	onConnect: function(){
		console.log('onConnect ')
		
		// request roster
		var roster_iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
		this.connection.sendIQ(roster_iq, this.callback('onRoster'));
		this.trigger('ui:roster');
		// add handlers
		this.connection.addHandler(this.callback('onContactPresence'), null, 'presence');
		this.connection.addHandler(this.callback('onMessage'), null, 'message', 'chat');
	},
	
	onRoster: function(roster){
		this.connection.send($pres());
		this.trigger('ui:ready');
		this.view.setStatus(Jabber.viewstates.online);
		
		var items = Jabber.Roster.serializeRoster(roster);
		
		for (var i=0; i<items.length; i++) {
			this.roster.add(items[i]);
		}
		return true;
	},
	
	onContactPresence: function(presence){
		console.log('onContactPresence ')
		
		// var from = Strophe.getBareJidFromJid($(presence).attr('from')),
		// 	contact = this.roster.detect(function(c){return c.get('bare_jid') === from;});
		// if (contact) {
		// 	contact.updatePrecense(presence);
		// }
		//         if(this.options.autoChat){
		//         	_.delay(function(self){
		//         		self.sendWelcome();
		//         	}, '2000', this);
		//         }
		// return true;
	},
//	Public method, use it directly if you set `{autoChat: false}`
	sendWelcome: function(){
    	// if (!this._welcomeSent) {
    	// 	var userinfo = this.getUserinfo();
    	// 	this.roster.freezeManager();
    	// 	this._welcomeSent = true;
    	// 	this.sendMessage({
    	// 		text: userinfo,
    	// 		from: this.options.jid,
    	// 		to: this.roster.manager.get('jid'),
    	// 		hidden: true,
    	// 		dt: new Date()
    	// 	});
    	// }
	},
//	`sendMessage` used for send all messages 
	sendMessage: function(message){
		if (!this._welcomeSent){
			this.sendWelcome();
		}
		if (typeof(message) === 'string'){
			var msg = new Jabber.Message({
				text: message,
				from: this.options.jid,
				to: this.roster.manager.get('jid'),
				incoming: false,
				dt: new Date()
			});
		} else {
			var msg = new Jabber.Message(message);
		}
		msg.send(this.connection);
		if (!msg.get('hidden')){
			this.chatlog.add(msg);
		} 
	},
//	Prepare and render userinfo
	getUserinfo: function(){
		return Jabber.welcome_template(this.view.getUserinfo());
	},
//	Handler for incoming messages
	onMessage: function(message){
		console.log('onMessage ')
		
		// var msg = new Jabber.Message({
		// 	text: $(message).find('body').text(),
		// 	from: $(message).attr('from'),
		// 	to: $(message).attr('to'),
		// 	incoming: true,
		// 	dt: new Date()
		// });
		// this.chatlog.add(msg);
		// return true;
	},
//	Only trigger view event
	onMessageAdd: function(message){
		this.view.trigger('add:message', message);
	}
});