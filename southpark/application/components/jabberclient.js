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
		this.connection = new Strophe.Connection(this.options.bosh_service);

	//	this._welcomeSent = false;
//	    this.connection.rawInput = function (data) { console.log('RECV: ' + data); };
//	    this.connection.rawOutput = function (data) { console.log('SEND: ' + data); };
//		listen events
		this.bind('connected', this.onConnect);
		this.connect();
	},
	connect: function(){
		console.log('connect ');
		
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
		console.log('on onConnect');
		
		// request roster
		var roster_iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
		this.connection.sendIQ(roster_iq, this.callback('onRoster'));
		this.trigger('ui:roster');
		// add handlers
		
		    this.connection.send(
		        $pres({
		            to: 'southpark3@conference.logoslogic.com' + "/" + 'testando'
		        }).c('x', {xmlns: "http://jabber.org/protocol/muc"}));

		this.connection.addHandler(this.callback('onContactPresence'), null, 'presence');
		this.connection.addHandler(this.callback('onMessage'), null, 'message', 'chat');
		this.connection.addHandler(this.callback('onMessage'), null, 'message', 'groupchat');
		
	},
	onRoster: function(roster){
		this.connection.send($pres());
		this.trigger('ui:ready');

		return true;
	},
	onContactPresence: function(presence){
		var from = Strophe.getBareJidFromJid($(presence).attr('from')),
			contact = this.roster.detect(function(c){return c.get('bare_jid') === from;});
		if (contact) {
			contact.updatePrecense(presence);
		}
        if(this.options.autoChat){
        	_.delay(function(self){
        		self.sendWelcome();
        	}, '2000', this);
        }
		return true;
	},
//	Public method, use it directly if you set `{autoChat: false}`
	sendWelcome: function(){

	},
//	`sendMessage` used for send all messages 
	sendMessage: function(message){

	},
//	Prepare and render userinfo
	getUserinfo: function(){
	},
//	Handler for incoming messages
	onMessage: function(message){
		console.log('on message'+message);

	},
//	Only trigger view event
	onMessageAdd: function(message){
	}
});