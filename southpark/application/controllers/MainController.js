/*!
 * controllers.js
 * Copyright(c) 2011 Justin Slattery <justin.slattery@fzysqr.com> 
 * MIT Licensed
 */

/*
 * Sets up master view for '/' page.
 *
 *  - Store passed hash value
 *  - Create app level model and view
 *  - Initialize socket.io connection back to server
 *  - Define socket.io message routing
 */
MainController = {
    init: function (options) {
	
		var view;
		
		var StropheConfig = {

		// Settings
			boshUrl: 'http://www.logoslogic.com/http-bind',

		// Implemented event handlers
			subscriptionRequested: JabberClient.subscription_requested,
			chatReceived: JabberClient.on_chat_message,
			rosterChanged: JabberClient.update_roster,

		// Not implemented in UI
			handleMucMessage: JabberClient.handle_muc_message,
			chatStateReceived: JabberClient.chat_state_received
		};

		/*Start XMPP Connection */

		var connection = null;
	 	var startTime = null;
	 	var BOSH_SERVICE = '/http-bind';

		connection = new Strophe.Connection(BOSH_SERVICE);

		// Strophe.log = function (lvl, msg) { log(msg); };
		connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);

	    // set up handler
		connection.addHandler(onResult, null, 'iq',	'result', 'disco-1', null);

		connection.rawInput = function (data) {
			Debuggerlog('RECV: ' + data);
		};

		connection.rawOutput = function (data) {
			DebuggerLog('SENT: ' + data);
		};

		// send disco#info to jabber.org
		var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()

		connection.send(iq);

		/* All Fans View Start up */
        this.model = new models.ChatRoomModel();
		var remoteJid = '';
        var name = '';
		
        this.view = new ChatView({model: this.model, remoteJid: remoteJid, el: $('.roomView'), name: name});

		$(function () {
			JabberClient.init(connection);
		});
        // var mySocket, hashpassword, user, view, trying, connected;
        // 
        //  this.socket = new io.Socket(null, {port: options.port
        //  //    , transports: ['websocket', 'flashsocket', 'xhr-multipart', 'htmlfile']
        //      , rememberTransport: false
        //      , tryTransportsOnConnectTimeout: false 
        //  });
        // 
        //  mySocket = this.socket;
        // 
        //  hashpassword = this.hashpassword = options.hashpassword
        //  user = this.user = options.userName
        //  log('hash is ' + options.hashpassword);
        //  log('user is ' + options.userName);
        // 
        //  //Records the client version to support auto-updates
        //  version = this.version = options.version;
        // 
        // 

        // 
        // 
        //  this.socket.on('connect', function () { 
        //      mySocket.send({
        //          event: 'clientauthrequest'
        //          , user: user
        //          , hashpassword: hashpassword
        //      });
        // 
        //      log('Connected! Oh hai!');
        //      connected = true;
        //      view.setConnected(true);
        //  }); 
        // 
        //  nodeChatController = this;
        //  this.socket.on('message', function (msg) { 
        //      nodeChatController.msgReceived(msg); 
        //  });
        // 
        //  function tryconnect() {
        //      if (!connected) {
        //          log('Trying to reconnect...');
        //          mySocket.connect();
        //          clearTimeout(trying);
        //          trying = setTimeout(tryconnect, 30000);
        //      }
        //  }
        // 
        //  //Try and reconnect if we get disconnected
        //  this.socket.on('disconnect', function () {
        //      log('Disconnected from nodechat. Oh noes!');
        //      connected = false;
        //      view.setConnected(false);
        //      trying = setTimeout(tryconnect, 500);
        //  });
        //  
        //  this.socket.connect();

        this.view.render();

        return this;
    }, 

	msgReceived: function (message) {
        // switch (message.event) {
        //     case 'chat':
        //         //log('message received: ' + message.data );
        //         var newChatEntry = new models.ChatEntry();
        //         newChatEntry.mport(message.data);
        // 
        //         //Check if we are reloading/connecting and flag the chat accordingly
        //         // if (message.reload) {
        //         //     newChatEntry.set({'reload': true});
        //         // }
        // 
        //         this.model.chats.add(newChatEntry);
        //         break;
        // 
        //     case 'user:join':
        //         var user = new models.UserModel();
        //         user.mport(message.data);
        // 
        //         //In case of refresh/socket/whatever bugs, only add a user once
        //         if(!this.model.users.some(function (u) { 
        //             return u.get('name').toLowerCase() == user.get('name').toLowerCase(); 
        //         })) {
        //             this.model.users.add(user);
        //         }
        //         break;
        // 
        //     case 'user:leave':
        //         var sUser = new models.UserModel();
        //         sUser.mport(message.data);
        // 
        //         //Because we don't have the actual model, find anything with the same name and remove it
        //         var user = this.model.users.find(function (u) { 
        //             return u.get('name').toLowerCase() == sUser.get('name').toLowerCase(); 
        //         });
        // 
        //         this.model.users.remove(user);
        //         this.view.displayUserLeaveMessage(sUser);
        //         break;
        // 
        //     case 'disconnect':
        //         window.location = '/disconnect';
        //         break;
        // 
        // }
    }
};
