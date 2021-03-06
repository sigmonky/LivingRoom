/* 
 * LivingRoomAPI Component
 */
Ext.namespace('LIVINGROOM.xmpp');

LIVINGROOM.xmpp.FacebookClient = Ext.extend(Ext.util.Observable, {

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
		LIVINGROOM.xmpp.FacebookClient.superclass.constructor.call(this);
		
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
		console.log('this.register = ' +this.register);
		
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
	
	
	handleMessageIn: function(message, me) {

	 	//Let's take all the presence informations
	 	var from = message.getFrom();
		var message = message.getBody();
		
		//Check if the message has some content inside
		if(message != ''){

			/* Let's call the controller method able to add the message
			 * to a chat session */
			Ext.dispatch({
			    controller: 'Roster',
			    action: 'addMessageToChatSession',
				from: from,
				message: message
			});

		}
	
	},
	
	handlePresence: function(presence, me) {

			//Let's take the store that will contains all the roster users
			var roster = Ext.StoreMgr.get('Roster');
		
			//Let's take the store that will contains all the online users
			var onlineUsers = Ext.StoreMgr.get('OnlineUsers');

			//Let's take all the presence informations
			var from = presence.getFrom();
			var type = presence.getType();
			var show = presence.getShow();
			var status = presence.getStatus();
		
			//Let's take all teh user informations from the Roster
			var user = roster.getById(from);
		
			if(type == null) {
	
				//Adding the user to the Online Users store
				onlineUsers.add(user);
		
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
		
				//Let's call the function that will take the user vCard
				me.getVCard(from);
		
			}else if(type == 'unavailable'){
			
				//Viene eliminato l'utente che ha effettuato la disconnessione
				onlineUsers.remove(user);
			
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
				
				if(bind != undefined){
				
					//Let's take the jid value
					me.myJID = doc.getElementsByTagName('jid')[0].textContent;
					
				}
				
				break;
			
			//We have got a groupchat message
			case 'groupchat':

				//Let's create the xml document
				doc = createXMLDoc(packet.xml());
		
				//Let's take the message body
				body = doc.getElementsByTagName('body')[0].textContent;
				
				/* Let's call the controller method able to add the message
				 * to the public chat room */
				Ext.dispatch({
				    controller: 'Roster',
				    action: 'addMessageToChatRoom',
					from: from,
					message: body
				});
			
				break;
			
		}
		
	},

	setStatus: function(status){
	
		//Viene creato l'oggetto presenza addetto a contenere il nuovo stato
		var presence = new JSJaCPresence();

		//Viene impostato il nuovo stato specificato
		presence.setStatus(status);

		//Viene inviato al server jabber notifica del nuovo stato
		this.jabberConnection.send(presence);

	},
	
	handleIq: function(iq, me){

		//Let's check if this component has been created to allow user to chat inside a public Room
		
			//Let's take the store that will contains all the roster users
			var store = Ext.StoreMgr.get('OnlineUsers');
		
			//Let's take all the iq informations
			var from = iq.getFrom();

			//Let's take the current user
			var user = store.getById(from);
		
			//Let's create the xml document
			var doc = createXMLDoc(iq.xml());

			//Let's take the vCard element
			var vCard = doc.getElementsByTagName('vCard')[0];

			//Let's take the PHOTO element
			var photo = vCard.getElementsByTagName('PHOTO')[0];

			//Let's take the image mime type element
			var type = photo.getElementsByTagName('TYPE')[0].textContent;

			//Let's take the binval element containing the photo in base64 format
			var binval = photo.getElementsByTagName('BINVAL')[0].textContent;
			
		//	console.log('photo is '+binval);
			
			
			//Saving the photo mime type
			user.set('photoType', type);
		
			//Saving the photo base64 data
			user.set('photoBase64', binval);
		

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

		//It's fired the event associated to the connection successfull estabilished
		me.fireEvent('connected', me.myJID);
			//Let's call the function able to get the Roaster
		me.getRoster();
		
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
			me.joinPublicRoom();
			
		}else{
			
			//Let's show an error able to inform that the server doesn't support MUC
			Ext.Msg.alert('MUC unsupported', 'The server you are trying to connect doesn\' support MUC feature');
			
		}

	},
	

	joinPublicRoom: function(){
		
		//Let's save tht full Room JID
		this.roomJid = this.publicRoomName + "@" + this.conferenceSubdomain + '.' + this.domain;
		console.log('roomJid = ' +this.roomJid);
		//Let's create the presence packet
		var oPresence = new JSJaCPresence();
		
		//Set the packet origin
		oPresence.setFrom(new JSJaCJID(this.myJID));
		
		//Set the packet recipient
		oPresence.setTo(new JSJaCJID(this.roomJid  + '/' + this.nickname));
		
		//Set the precence type
		//oPresence.setShow('available');
		
		console.log(oPresence.xml());
		
		//Let's finally send the packet
		this.jabberConnection.send(oPresence, this.joinRoomComplete, this);
		
	},
	
	joinRoomComplete: function(iq, me){
		
		console.log(iq.xml());
		
	},
	
	getRoster: function(){
		console.log('getRoster');
		//Let's make a request to get the roaster back
		var iq = new JSJaCIQ();
		iq.setIQ(null,'get','roster_1');
		iq.setQuery('jabber:iq:roster');
		this.jabberConnection.send(iq, this.getRoasterComplete, this); // cascading information retrieval
		
	},
	
	getRoasterComplete: function(iq, me){
		console.log('getRoasterComplete iq' +iq.xml())
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