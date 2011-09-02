/**
 * Chat Controller
 *
 * @author Nils Dehl <mail@nils-dehl.de>
 */
Ext.regController('Chat', {
	/**
	 * Index action
	 *
	 * @return {void}
	 */
	
	index: function() {
	//	if (!this.socket) {
	///		this.initSocketConnection();
	//	}


		this.showChat();
	},

	/**
	 * init the socket connection to the node.js server
	 * using user settings
	 *
	 */
	initSocketConnection: function() {
		chatStore = new App.Store.Chat();
		this.configStore = Ext.StoreMgr.get('ConfigStore');
		var settings = this.configStore.getAt(0);

		this.socket = new App.util.Socketio(settings.get('server'), {port: 4000});
		this.socket.connect();

		// Event Listener
		this.socket.on(
			'connect',
			this.registerUser,
			this
		);

		this.socket.on(
			'message',
			this.addMessageToChatStore,
			this
		);

		App.on(
			'newMsg',
			this.sendMessageToServer,
			this
		);
	},

	sendMessageToServer: function(msg){
		this.socket.send(msg);
	},

	addMessageToChatStore: function(message) {
		this.chatStore.add(message);
	},

	registerUser: function() {
		var settings = this.configStore.getAt(0);
		var user = {
			username: settings.get('username'),
			facebookphoto: settings.get('facebookphoto')
		};
		this.socket.send(user);
	},
	
	InitConnection: function(options){
		chatStore = new App.Store.Chat();
		rosterStr = new App.Store.Roster();
		console.log('InitConnection');
		App.util.Strophe.connection = new Strophe.Connection(
	        'http://www.afrogjumps.com/http-bind');
			username = options.username+"@afrogjumps.com";
			App.util.Strophe.username = username;
			App.util.Strophe.nickname = options.username+'_'+Math.floor(Math.random()*101);
			App.util.Strophe.room = "mtvn3@conference.afrogjumps.com";
			

				
		    App.util.Strophe.connection.connect(
		        username, options.password,
		        function (status) {
		            if (status === Strophe.Status.CONNECTED) {
		                Ext.dispatch({
							controller: 'Chat',
							action    : 'connected'
						});
		            } else if (status === Strophe.Status.DISCONNECTED) {
		                Ext.dispatch({
							controller: 'Chat',
							action    : 'disconnected'
						});
		            }
		        });
		//this.connection_.connect();
		//console.log("connection started");
		//this.connect(options.url, options.username, options.password);
	},
	
	disconnected: function(){
		console.log('disconnected');
	},
	
	sendMessageToRoom: function(options){
		console.log('sendMessage to Room = ' +App.util.Strophe.room);
		App.util.Strophe.connection.send(
                $msg({
                    to: App.util.Strophe.room,
                    type: "groupchat"}).c('body').t(options.message));
	},
	
	connected: function(){
		console.log('controller chat connected');
		console.log('connection_ MUC' + App.util.Strophe.NS_MUC);
		console.log('connection_ room' + App.util.Strophe.room);
		console.log('connection_ nickname' + App.util.Strophe.nickname);
		
		var adminUsr = Ext.ModelMgr.create({username: "Admin"}, 'Roster');
		var myself = Ext.ModelMgr.create({username: App.util.Strophe.nickname}, 'Roster');
		
		rosterStr.add(adminUsr);
		rosterStr.add(myself);
		
		console.log('roaster str is ' + rosterStr);
		
		App.util.Strophe.joined = false;
	    App.util.Strophe.participants = {};
		
	    App.util.Strophe.connection.send($pres().c('priority').t('-1'));
	   	App.util.Strophe.connection.addHandler(App.util.Strophe.on_presence, null,"presence");
	    App.util.Strophe.connection.addHandler(App.util.Strophe.on_public_message, null,"message", "groupchat");
	    App.util.Strophe.connection.addHandler(App.util.Strophe.on_private_message,null, "message", "chat");
		App.util.Strophe.setVcard();

    	
		App.util.Strophe.connection.send(
	        $pres({
	            to: App.util.Strophe.room + "/" + App.util.Strophe.nickname
	        }).c('x', {xmlns: App.util.Strophe.NS_MUC}));

	},

	
	user_joined: function(options){
		console.log('user_joined = '+options.aUser);
		//connection_.add_message("<div class='notice'>*** Room joined.</div>")
		var msg = Ext.ModelMgr.create({user: 'admin', message: options.aUser+ ' joined'}, 'ChatMessage');
		

		var usr = Ext.ModelMgr.create({username: options.aUser}, 'Roster');
		rosterStr.add(usr);
		console.log('rosterStr = ' +rosterStr);
	    chatStore.add(msg);
	
	},
	
	user_left: function(){
		console.log('user_left');
	},
	
	room_joined: function(){
		console.log('room_joined');
		App.util.Strophe.joined = true;
		console.log('connection_.joined = ' +App.util.Strophe.joined);
		
		//connection_.add_message("<div class='notice'>*** Room joined.</div>")
		var msg = Ext.ModelMgr.create({user: 'admin', message: 'Room Joined'}, 'ChatMessage');
		//console.log('chat Store' +chatStore);
	    chatStore.add(msg);
	},

	/**
	 * Show chat view
	 */
	showChat: function() {
		
		if (!this.viewChat) {

			this.viewChat = this.render({
				xtype: 'App.View.GroupChat'
			});

			this.viewChat.query('#settingsButton')[0].on(
				'tap',
				this.showConfig,
				this
			);
		}
		
		this.application.viewport.setActiveItem(
			this.viewChat,
			{
				type: 'slide',
				direction: 'left'
			}
		);

	},

	/**
	 * Show config View
	 */
	showConfig: function() {
		Ext.dispatch({
			controller: 'Viewport',
			action    : 'showConfig'
		});
	}
});