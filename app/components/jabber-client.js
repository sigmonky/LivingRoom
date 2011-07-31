/* 
 * LivingRoomAPI Component
 */
Ext.namespace('LIVINGROOM.xmpp');

LIVINGROOM.xmpp.Client = Ext.extend(Ext.util.Observable, {

	jabberConnection: undefined,

	httpbase: '',

	timerval: 2000,

	domain: '',

	username: '',
	
	nickname: '',
	
	resource: '',

	pass: '',

	port: 5222,

	register: false,
	
	publicRoom: false,
	
	publicRoomName: '',
	
	roomRoster: undefined,
	
	conferenceSubdomain: '',
	
	authtype: 'sasl',
	
	facebookApp: undefined,

	constructor: function(config){
	
		config = config || {};
        this.initialConfig = config;
        Ext.apply(this, config);

        this.addEvents(
	
            'connected',

			'getrostercomplete',

            'messageReceive',

			'unauthorized'
        );

		//Let's call the superclass constructor
		LIVINGROOM.xmpp.Client.superclass.constructor.call(this);
		
	},

	connect: function(){

		oArgs = {
			httpbase: this.httpbase,
			timerval: this.timerval,
			scope: this
		};
		
		this.jabberConnection = new JSJaCHttpBindingConnection(oArgs);

		this.initConnection(this.jabberConnection);

		oArgs = new Object();
		oArgs.domain = this.domain;
		oArgs.username = this.username;
		oArgs.resource = this.resource;
		oArgs.pass = this.pass;
		oArgs.register = this.register;
		oArgs.port = this.port;
		oArgs.authtype = this.authtype;
		oArgs.facebookApp = this.facebookApp;

		this.jabberConnection.connect(oArgs);
		
		console.log('this.domain = ' +this.domain);
		//console.log('this.register = ' +this.register);
	},
	
	initConnection: function(jabberConnection){
	
		jabberConnection.registerHandler('iq', this.handleIq);
		jabberConnection.registerHandler('message_in', this.handleMessageIn);
		jabberConnection.registerHandler('presence', this.handlePresence);
		jabberConnection.registerHandler('onConnect', this.handleConnected);
		jabberConnection.registerHandler('packet_in', this.handlePacketIn);
		jabberConnection.registerHandler('onerror', this.handleError);
		jabberConnection.registerHandler('status_changed', this.handleStatusChanged);
		
	},

	disconnect: function(){

		//Let's define a precence packet
		var p = new JSJaCPresence();
		
		//Let's set the presence type
		p.setType("unavailable");

		//Let's check if this component is talking with a blublic chat room
		if(this.publicRoom){

			//Set the message from with my JID
			p.setFrom(this.myJID);

			//Set the room jid
			p.setTo(this.roomJid + '/' + this.nickname);

		}
		
		//Let's finally send the presence packety
		this.jabberConnection.send(p);
		
		//Disconnect the component from the remote server
		this.jabberConnection.disconnect();

	},

	sendMessage: function(recipient, message){
		
		//Create a new message
		var p = new JSJaCMessage();
		
		//Set the recipient
		p.setTo(new JSJaCJID(recipient));
		
		//Set the message to send
		p.setBody(message);
		
		//Finally send the message
		this.jabberConnection.send(p);
		
	},
	
	sendRoomMessage: function(message){
	
	
		console.log('sendRoomMessage '+message);
		
		console.log('sendRoomMessage this.myJID'+this.myJID);
		
		console.log('sendRoomMessage this.roomJid '+this.roomJid);
		
		//Create a new data packet
		var p = new JSJaCPacket('message');
		
		//Set the message from with my JID
		p.setFrom(this.myJID);
		
		//Set the room jid
		p.setTo(this.roomJid);
		
		//Set the message type
		p.setType('groupchat');
		
		p.appendNode(
			p.buildNode('body', message)
		);
		
		//Finally send the message
		this.jabberConnection.send(p);
		
	},
	
	sendPresence: function(presence){
	
		var oPresence = new JSJaCPresence();
		//oPresence.setShow(presence);
		this.jabberConnection.send(oPresence);
		
	},
	
	getVCard: function(jid){
		
		console.log('getVCard '+jid);
		
		var p = new JSJaCPacket('iq');
		p.setID('vc2');
		p.setType('get');
		p.setTo(jid);
		p.appendNode(
			p.buildNode('vCard', {'xmlns': 'vcard-temp', 'version': '2.0'})
		);

		//Let's send the packet able to retrive the user vCard
	  	this.jabberConnection.send(p);

	},
	
	setVCard: function(){
		
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		var facebook_id = obj.get('id');
			
	//	console.log('facebook_id = '+facebook_id);	
		var vCardEl = document.createElement('NICKNAME');
		var text = document.createTextNode(facebook_id);
		vCardEl.appendChild(text);
		
		var v = new JSJaCVcard();
		v.setID('vc2');
		v.setType('set');
		v.setVcard();
		v.setNickName(facebook_id);
		
		//Let's send the packet able to retrive the user vCard
	  	this.jabberConnection.send(v);

	},
	
	
	handleMessageIn: function(message, me) {

	 	//Let's take all the presence informations
	 	var from = message.getFrom();
		var message = message.getBody();
		
		console.log('handleMessageIn = '+ from);
		
		//* Fetch Store with User Active Conversation. If empty show popup asking what the user should do */
		
		
		//Check if the message has some content inside
		if(message != ''){

			/* Let's call the controller method able to add the message
			 * to a chat session */
			Ext.dispatch({
			    controller: 'Roster',
			    action: 'addMessageToOneToOneChatSession',
				from: from,
				message: message
			});
		}
	},
	
	leaveRoom: function(){
		
		var p = new JSJaCPresence();
		
		//Let's set the presence type
		p.setType("unavailable");

		//Let's check if this component is talking with a blublic chat room
		if(this.publicRoom){

			//Set the message from with my JID
			p.setFrom(this.myJID);

			//Set the room jid
			p.setTo(this.roomJid + '/' + this.nickname);

		}
		
		//Let's finally send the presence packety
		this.jabberConnection.send(p);

	},
	
	handlePresence: function(presence, me) {

			var roster = Ext.StoreMgr.get(me.publicRoom);
			
			console.log('handlePresence this.publicRoom'+me.publicRoom)
			
			//console.log('room handlePresence presense = ' +presence);
			//console.log('room handlePresence from' +from);
			
			//Let's take all the presence informations
			var from = presence.getFrom();
			var type = presence.getType();
			var show = presence.getShow();
		
			//console.log('handlePresence getStatus ' +status)
			// 
			var doc = createXMLDoc(presence.xml());
		
			console.log('handlePresence this.publicRoom type = '+type );
		
			var status = '';
			var reason = '';
			
			/* If user has been kicked / banned */
			var isStatus = doc.getElementsByTagName('status')[0];
			if (isStatus != null){
				status = doc.getElementsByTagName('status')[0].getAttribute('code');
				reason = doc.getElementsByTagName('reason')[0].textContent;
			
				console.log('handlePresence reason = '+reason);
			}
		
		
			var nickname = from.split('/')[1];
			
			if(type == null) {
				console.log('type is null');
		
				//Adding the user to the Online Users store
				var item = Ext.ModelMgr.create({
				    jid: from,
					nickname: nickname,
					facebook_id: '',
					profile_thumb_url: '',
				}, 'RoomRosterItem');
				
				roster.add(item);
				
				
		/*		Ext.dispatch({
				    controller: 'Roster',
				    action: 'addRoomAnnouncement',
					message: nickname+ ' has joined the room.'
				}); */
				
				console.log('handlePresence roster add = ' +nickname);
				console.log('handlePresence roster add = ' +from);
				
				
				//Adding the user to the store
			
			//	roster.sync();
				//Approve Subscription Request
				var aPresence = new JSJaCPresence();
				aPresence.setTo(from);
				aPresence.setType('subscribed');
				me.jabberConnection.send(aPresence);

				//Subscribe to gateway contact's presence
				var bPresence = new JSJaCPresence();
				bPresence.setTo(from);
				bPresence.setType('subscribe');
				me.jabberConnection.send(bPresence);
		
				me.getVCard(from);
		
			}else if(type == 'unavailable'){
				
				user = roster.getById(from);
				roster.remove(user);
				var message = '';
				if (status == '307'){
					if (reason != ''){
						message = nickname+ ' has been kicked from the room. ('+reason+')';
					}
					else{
						message: nickname+ ' has been kicked from the room.'
					}
					Ext.dispatch({
				    	controller: 'Roster',
				    	action: 'addRoomAnnouncement',
						message: message
					});
				}else if(status == "403"){
					Ext.dispatch({
				    	controller: 'Roster',
				    	action: 'addRoomAnnouncement',
						message: nickname+ ' has been banned from the room.'
					});
				}else{
					Ext.dispatch({
				    	controller: 'Roster',
				    	action: 'addRoomAnnouncement',
						message: nickname+ ' has left the room.'
					});
				
				}
				
			}
			
			
	 
	},

	handlePacketIn: function(packet, me){
		
		/* Declaration of an xml document and body variable
		 * (created when I really need it) */
		var doc, body;

		//Let's take the packet type
		var type = packet.getType();

		//Get the message from
		var from = packet.getFrom();
				
		//Checking the packet type
		switch(type){
			
			case 'result':

				//Let's create the xml document
				doc = createXMLDoc(packet.xml());
				
				//Let's take the bind node
				var bind = doc.getElementsByTagName('bind')[0];
				console.log('result = message body = '+bind)
				
				if(bind != undefined){
					//Let's take the jid value
					me.myJID = doc.getElementsByTagName('jid')[0].textContent;
					console.log('me.myJID = '+me.myJID);
				}
				
				break;
			
			//We have got a groupchat message
			case 'groupchat':
				
				console.log('handlePacketIn user from = '+from);
				
				//Let's create the xml document
				doc = createXMLDoc(packet.xml());
				//Let's take the message body
				body = doc.getElementsByTagName('body')[0].textContent;
				
				var nickname = from.split('/')[1];
				
			//	var roster = Ext.StoreMgr.get('RoomRoster');
			//	var user = roster.getById(from);


			//	console.log('handlePacketIn user from = '+from);

			//	console.log('handlePacketIn user = '+user);
				
			//	var total = roster.getCount();
			//	console.log('roster total = '+total);

				/* Let's call the controller method able to add the message
				 * to the public chat room */
				Ext.dispatch({
				    controller: 'Roster',
				    action: 'addMessageToChatRoom',
					from: from,
					message: body,
					nickname: nickname
				});
			
				break;
		}
		
	},

	setStatus: function(status){
	
		var presence = new JSJaCPresence();

		presence.setStatus(status);
		
		presence.setShow('away');
		
		/** 
		* away -- The entity or resource is temporarily away.
	    * chat -- The entity or resource is actively interested in chatting.
	    * dnd -- The entity or resource is busy (dnd = "Do Not Disturb").
	    * xa -- The entity or resource is away for an extended period (xa = "eXtended Away").
	    */
	
		this.jabberConnection.send(presence);

	},
	
	handleIq: function(iq, me){

			var iqID = iq.getID();
			
			//Let's take the store that will contains all the roster users
			var store = Ext.StoreMgr.get(me.publicRoom);
		
			//Let's take all the iq informations
			var from = iq.getFrom();

			console.log('Room - handleIq = ' +from)

			//Let's take the current user
			
			var nickname = from.split('/')[1];
			var user = store.getById(from);
		
			//Let's create the xml document
			var doc = createXMLDoc(iq.xml());

			//Let's take the vCard element
			var vCard = doc.getElementsByTagName('vCard')[0];

			//console.log('user nickname 3- ' + vCard.getElementsByTagName('NICKNAME')[0].childNodes[0].nodeValue);
			
			var facebook_id  = vCard.getElementsByTagName('NICKNAME')[0].childNodes[0].nodeValue;
			console.log('Room - handleIq  facebook_id = ' +facebook_id)
		
			//user.set('jid', from);
			if (facebook_id != null){
				var photo_url = "https://graph.facebook.com/"+facebook_id+"/picture";
				user.set('facebook_id', facebook_id);
				user.set('profile_thumb_url', photo_url);
				
			}else{
				var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
				user.set('profile_thumb_url', photo_url);
				
			}
		//	user.set('nickname', nickname);


	},
	
    handleError: function(e, me) {

		//Let's take the error node name
		var error = e.firstChild.tagName;
		
		//Let's check the error type
		switch(error){
			
			/* The user is not authorize to login so it's not correcly registered
			 * inside the jabber server that handle the public chat room */
			case 'not-authorized':
			
				//Let's fire the event associated to the unauthorized server reply
				me.fireEvent('unauthorized', me);

				break;
		}
		
		
		//console.log(error);
		
		me.fireEvent('unavailable', me);
		
	  	if(me.jabberConnection.connected())
			me.jabberConnection.disconnect();
	},
	
	handleStatusChanged: function(status, me) {
	  
		//oDbg.log("status changed: "+status);
		//alert(status);
	
	},
	
	handleConnected: function(me) {
		
		
		me.setVCard();
		me.getVCard(me.myJID);
	
		//It's fired the event associated to the connection successfull estabilished
		me.fireEvent('connected', me.myJID);
		
			
			//Let's call the function able to get the Disco Info
	//	me.getDiscoInfo();
		
	},
	
	getDiscoInfo: function(){
		
		var iq = new JSJaCIQ();
	    iq.setIQ(this.conferenceSubdomain + '.' + this.domain,'get','disco_info');
	    iq.setQuery("http://jabber.org/protocol/disco#info");
		this.jabberConnection.send(iq, this.getDiscoInfoComplete, this);
	},
	
	getDiscoInfoComplete: function(iq, me){
		
		if (!iq || iq.getType() != 'result')
		    return;
		
		//Let's create the xml document
		var doc = createXMLDoc(iq.xml());

		//Let's take the query element
		var query = doc.getElementsByTagName('query')[0];
		
		//Let's take the identity element
		var identity = doc.getElementsByTagName('identity')[0];

		//Let's check if the server supports MUC
		if(identity.getAttribute('category') == 'conference'){
			
			//Let's call the function able to join the public room
	//		me.joinPublicRoom();
			
		}else{
			
			//Let's show an error able to inform that the server doesn't support MUC
			Ext.Msg.alert('MUC unsupported', 'The server you are trying to connect doesn\' support MUC feature');
			
		}

	},
	
	getPublicRoomName: function(){
		return this.publicRoom;
	},
	
	joinPublicRoom: function(publicRoomName){
			
/*		if (Ext.StoreMgr.get(this.roomRoster) != undefined){
			Ext.StoreMgr.get(this.roomRoster).removeAll();
		}
		
		if (Ext.StoreMgr.get(this.roomRoster+'message') != undefined){
			Ext.StoreMgr.get(this.roomRoster+'message').removeAll();
		} */
		
		this.publicRoom = publicRoomName;
		console.log('this.publicRoom  =' +this.publicRoom );
		
		Ext.regStore(this.publicRoom, {
			model: 'RoomRosterItem',
			autoLoad: true,
			proxy: {
				type: 'memory',
				  	reader: {
				    	type: 'json'
				   	}
				}
		});

		
		
		//this.roomRoster = Ext.StoreMgr.get(this.publicRoom);
		
		console.log('publicRoomName '+publicRoomName);
		
		//Let's save tht full Room JID
		this.roomJid = this.publicRoom + "@" + this.conferenceSubdomain + '.' + this.domain;
		console.log('roomJid = ' +this.roomJid);
		
		//Let's create the presence packet
		var oPresence = new JSJaCPresence();
		
		//Set the packet origin
		oPresence.setFrom(new JSJaCJID(this.myJID));
		
		//Set the packet recipient
		oPresence.setTo(new JSJaCJID(this.roomJid  + '/' + this.nickname));
		
		//Set the precence type
		//oPresence.setShow('available');
		
		//console.log(oPresence.xml());
		
		//Let's finally send the packet
		this.jabberConnection.send(oPresence, this.joinRoomComplete, this);
		
	},
	
	joinRoomComplete: function(iq, me){
		
	//	console.log('joinRoomComplete = '+iq.xml());
	
		/* Get my Facebook User ID */
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		var fb_id = obj.get('id');
		
		console.log('joinRoomComplete myJID is ' + me.myJID);
		console.log('joinRoomComplete fb_id is ' + fb_id);
		console.log('joinRoomComplete me.nickname ' + me.nickname);
		console.log('joinRoomComplete me.roomJid ' + me.roomJid);


		if (fb_id != null){
			var photo_url = "https://graph.facebook.com/"+fb_id+"/picture";
		}else{
			var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
		}

		var item = Ext.ModelMgr.create({
		    jid: me.roomJid+'/'+me.nickname,
			nickname: me.nickname,
			facebook_id: fb_id,
			profile_thumb_url: photo_url,
		}, 'RoomRosterItem');

		console.log('joinRoomComplete room handlePresence roster add user jid ='+me.roomJid+'/'+me.nickname );
		
		console.log('joinRoomComplete='+me.publicRoom)
		
		var store = Ext.StoreMgr.get(me.publicRoom);
		
		//Adding the user to the store
		store.add(item);
		store.sync();
	},
	
	getRoster: function(){
		//console.log('getRoster');
		//Let's make a request to get the roaster back
		var iq = new JSJaCIQ();
		iq.setIQ(null,'get','roster_1');
		iq.setQuery('jabber:iq:roster');
		this.jabberConnection.send(iq, this.getRoasterComplete, this); // cascading information retrieval
	},
	
	getRoasterComplete: function(iq, me){
		//console.log('getRoasterComplete');
		
		if (!iq || iq.getType() != 'result') {
			if (iq)
				Debug.log("Error fetching roster:\n"+iq.xml(),1);
			else
				Debug.log("Error fetching roster",1);
				return;
		}
		
		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('Roster');
		
		//Let's create the xml document
		var doc = createXMLDoc(iq.xml());
		
		//Let's take the query element
		var query = doc.getElementsByTagName('query')[0];
		
		//Let's take all the items
		Ext.each(query.childNodes, function(node){

			var item = Ext.ModelMgr.create({
			    jid: node.getAttribute('jid'),
				name: node.getAttribute('name'),
				subscription: node.getAttribute('subscription')
			}, 'RosterItem');
			
			
			//Adding the user to the store
			store.add(item);
			
		});
		
		/* Send the presence packet that will allow me to retrive all
		 * the users that are online */
		me.sendPresence('available');
		
		//Let's call the controller method able to show the user Roster
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'showOnlineUsers'
		});

	}


});