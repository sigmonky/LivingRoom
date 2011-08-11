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
	
	roomsArray: [],
	
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
		
		jabberConnection.registerHandler('message', this.message);
	    
		jabberConnection.registerHandler('iq', 'query', NS_ROSTER, this.iqRoster);
	    jabberConnection.registerHandler('iq', 'query', NS_DISCO_ITEMS, this.iqDiscoItems);
	    jabberConnection.registerHandler('iq', 'query', NS_REGISTER, this.iqRegister);
	},
	message: function(aJSJaCPacket){
    	console.log('on message' +aJSJaCPacket);
	},	
	iqRoster: function(iq){
    	console.log('iq roster' +iq);
	},
	iqDiscoItems: function(iq){
    	console.log('iq iqDiscoItems' +iq);
	},
	iqRegister: function(iq){
    	console.log('iq iqRegister' +iq);
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
		console.log('sendMessage to' +recipient);
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
		var token = getFacebookTokenFromUrl();
			if (token != ""){

				var facebookStore = Ext.StoreMgr.get('FacebookUser');

				if (facebookStore != null){
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
			}
		}
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
	
	subscribeToPresence: function(from){
		console.log('subscribeToPresence =' +from);
		var aPresence = new JSJaCPresence();
		aPresence.setTo(from);
		aPresence.setType('subscribed');
		this.jabberConnection.send(aPresence);

		//Subscribe to gateway contact's presence
		var bPresence = new JSJaCPresence();
		bPresence.setTo(from);
		bPresence.setType('subscribe');
		this.jabberConnection.send(bPresence);
		
	},
	
	addRosterItem: function(buddy){
    	var iq = new JSJaCIQ();
    	iq.setFrom(this.myJid);
    	iq.setType('set');
    	iq.setID('roster_set');
    	var query = iq.setQuery(NS_ROSTER);
 		//   var group = iq.buildNode('group', {}, buddy.group);
    	var item = iq.buildNode('item', {
      		jid: buddy.jid,
      		name: buddy.name
    	});

   // 	item.appendChild(group);
    	query.appendChild(item);
    	this.jabberConnection.send(iq);
  },

  addBuddy: function(buddy){
	console.log('addBuddy jid = '+buddy.jid);
	
	console.log('addBuddy jid = '+buddy.jid);
    	this.addRosterItem(buddy);
    	this.subscribe(buddy.jid);
    	return buddy.jid;
  },
	
	subscribe: function(jid){
    this.__subscription(jid, 'subscribe');
  },

  unsubscribe: function(jid){
    this.__subscription(jid, 'unsubscribe');
  },

  allowSubscription: function(jid){
    this.__subscription(jid, 'subscribed');
  },

  denySubscription: function(buddy){
    this.__subscription(jid, 'unsubscribed');
  },
	/**
   * Sends a subscription packet of a specified type
   * @param {JSJaCJID} buddy
   * @param {String} subType
   */
  __subscription: function(jid, subType){
    var presence = new JSJaCPacket('presence');
    presence.setTo(jid);
    presence.setType(subType);
    this.jabberConnection.send(presence);
    return false;
  },
	
	handlePresence: function(presence, me) {

			
			console.log('handlePresence presense = ' +presence);
			
			//Let's take all the presence informations
			var from = presence.getFrom();
			var type = presence.getType();
			var show = presence.getShow();
			var status = presence.getStatus();
			
			console.log('handlePresence maindomain from '+from);
			console.log('handlePresence maindomain from indexof '+from.indexOf("@"));
			
			var mainDomain = from.substring(from.indexOf("@")+1, from.indexOf("."));
			
			console.log('handlePresence maindomain '+mainDomain);
			console.log('handlePresence from' +from);
			console.log('handlePresence type' +type);
			console.log('handlePresence status' +status);
			
			var roster = Ext.StoreMgr.get('Roster');

			//Let's take the store that will contains all the online users
			var onlineUsers = Ext.StoreMgr.get('OnlineUsers');
			
			if (type == 'subscribe'){
				
				me.allowSubscription(from.toString());
				
				
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
				
				return
			}
			
			
			if (mainDomain == 'conference'){
				var roomJid = from.substring(0,from.indexOf('@'));
				var roomSt = roomJid+'_room';
				console.log('room handlePresence roomJid' +roomJid);
				var roster = Ext.StoreMgr.get(roomSt);
			}else{

			}
		
			//console.log('handlePresence getStatus ' +status)
			// 
			var doc = createXMLDoc(presence.xml());
		
			console.log('handlePresence type = '+type );
		
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
		
				if (mainDomain == 'conference'){
		
					//Adding the user to the Online Users store
					var item = Ext.ModelMgr.create({
				    	jid: from,
						nickname: nickname,
						facebook_id: '',
						profile_thumb_url: '',
						}, 'RoomRosterItem');
				
						roster.add(item);
						
						console.log('handlePresence roster add = ' +nickname);
						console.log('handlePresence roster add = ' +from);
				
				}else{
					
					// console.log('handlePresence onlineUsers add = ' +from);
					// console.log('handlePresence onlineUsers add = ' +from.substring(0, from.indexOf('/')));
					
					var user = roster.getById(from.substring(0, from.indexOf('/')));
					
					console.log('handlePresence onlineUsers add user= ' +user);
					
					//user.set('isLive', true);
					//user.thumb('thumb', 'c');
					
				///	var friendsStore = Ext.StoreMgr.get('FriendListStore');
				//	friendsStore.add(user)
					onlineUsers.add(user);
					onlineUsers.sync();
					
				}
				
		/*		Ext.dispatch({
				    controller: 'Roster',
				    action: 'addRoomAnnouncement',
					message: nickname+ ' has joined the room.'
				}); */
				
				
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
				if (mainDomain != 'conference'){
					onlineUsers.remove(user);
				}
				
				//user = roster.getById(from);
				var user = roster.getById(from.substring(0, from.indexOf('/')));
				
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
		console.log('handlePacketIn = '+packet);
		
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
			console.log('handle iq ='+iq.xml());
			//Let's take the store that will contains all the roster users
			
			//Let's take all the iq informations
			var from = iq.getFrom();

			console.log('handleIq from = '+from);

			var room = from.substring(0,from.indexOf('@'))+'_room';
			console.log('handleIq room = '+room);
			
			var store = Ext.StoreMgr.get(room);

			console.log('handleIq store = ' +store)

			//Let's take the current user
			
			var nickname = from.split('/')[1];
			var user = store.getById(from);
		
			//Let's create the xml document
			var doc = createXMLDoc(iq.xml());

			//Let's take the vCard element
			var vCard = doc.getElementsByTagName('vCard')[0];

			//console.log('user nickname 3- ' + vCard.getElementsByTagName('NICKNAME')[0].childNodes[0].nodeValue);
			console.log('Room - handleIq  vCard = ' +vCard);
			if(vCard != undefined){
				var facebook_id  = vCard.getElementsByTagName('NICKNAME')[0].childNodes[0].nodeValue;
				console.log('Room - handleIq  facebook_id = ' +facebook_id)
				if (facebook_id != ''){
					var photo_url = "https://graph.facebook.com/"+facebook_id+"/picture";
					user.set('facebook_id', facebook_id);
					user.set('profile_thumb_url', photo_url);
				}
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
		console.log('handleConnected');
		
		me.setVCard();
		me.getVCard(me.myJID);
		//It's fired the event associated to the connection successfull estabilished
		me.fireEvent('connected', me.myJID);
		me.getRoster();
			//Let's call the function able to get the Disco Info
		me.getDiscoInfo();
		
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
	

	joinPublicRoom: function(publicRoomName){
			
/*		if (Ext.StoreMgr.get(this.roomRoster) != undefined){
			Ext.StoreMgr.get(this.roomRoster).removeAll();
		}
		
		if (Ext.StoreMgr.get(this.roomRoster+'message') != undefined){
			Ext.StoreMgr.get(this.roomRoster+'message').removeAll();
		} */
		
		console.log('join public room  '+this.roomsArray.length);
		
		var publicRoomStr = publicRoomName+'_room';
		
		if (this.roomsArray.length == 0){
			this.roomsArray.push(publicRoomStr);
			Ext.regStore(publicRoomStr, {
				model: 'RoomRosterItem',
				autoLoad: true,
				proxy: {
					type: 'memory',
					  	reader: {
					    	type: 'json'
					   	}
					}
			});
			console.log('publicRoomName '+publicRoomName);
			this.roomJid = publicRoomName + "@" + this.conferenceSubdomain + '.' + this.domain;
			console.log('roomJid = ' +this.roomJid);
			var oPresence = new JSJaCPresence();
			oPresence.setFrom(new JSJaCJID(this.myJID));
			oPresence.setTo(new JSJaCJID(this.roomJid  + '/' + this.nickname));
			this.jabberConnection.send(oPresence, this.joinRoomComplete, this);
			
		}else{
			console.log('publicRoom Store  =' +publicRoomStr );
		
		var alreadyExists = false;
		
		for(var i=0; i< this.roomsArray.length; i++){
			console.log('publicRoomStr');
			if (publicRoomStr == this.roomsArray[i] ){
				alreadyExists = true;
			}
		}
		
		if (alreadyExists == false){
				
				this.roomsArray.push(publicRoomStr);
				Ext.regStore(publicRoomStr, {
					model: 'RoomRosterItem',
					autoLoad: true,
					proxy: {
						type: 'memory',
						  	reader: {
						    	type: 'json'
						   	}
						}
				});
				console.log('publicRoomName '+publicRoomName);
				this.roomJid = publicRoomName + "@" + this.conferenceSubdomain + '.' + this.domain;
				console.log('roomJid = ' +this.roomJid);
				var oPresence = new JSJaCPresence();
				oPresence.setFrom(new JSJaCJID(this.myJID));
				oPresence.setTo(new JSJaCJID(this.roomJid  + '/' + this.nickname));
				this.jabberConnection.send(oPresence, this.joinRoomComplete, this);
		}
		
	}
		
	},
	
	joinRoomComplete: function(iq, me){
		
		console.log('joinRoomComplete = '+iq.xml());
	
		/* Get my Facebook User ID */
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		if (obj != undefined){
			var fb_id = obj.get('id');
		}
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
		
		var roomStore = me.roomJid.substring(0,me.roomJid.indexOf('@'));
		console.log('joinRoomComplete roomStore ='+roomStore)
		
		var store = Ext.StoreMgr.get(roomStore+'_room');
		
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
		console.log('getRoasterComplete');
		
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
			var facebook_id = node.getAttribute('jid').substring(0, node.getAttribute('jid').indexOf('@'));
			
			console.log('getRoasterComplete facebook_id= '+facebook_id);
			console.log('getRoasterComplete  jid ='+node.getAttribute('jid'));
			
			var item = Ext.ModelMgr.create({
			    jid: node.getAttribute('jid'),
			    facebook_id: facebook_id,
				name: node.getAttribute('name'),
				subscription: node.getAttribute('subscription'),
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