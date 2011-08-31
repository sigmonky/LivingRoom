"use strict";

var JabberClient = {};

JabberClient.onMessage = function(msg){
	console.log('onmessage');
}
// set up the object
JabberClient.init = function (connection) {
	var account;
	
	this.chatViews = new Array();
	console.log('JabberClient init chatViews'+this.chatViews);
	
	
	this.conn = connection;
	JabberClient.conn = this.conn;
	JabberClient.joinRoom(RoomJid)
	
	JabberClient.conn.addHandler(JabberClient.onMessage, null, 'message', null, null,  null); 
	
	
	console.log('JabberClient init this.connec ='+this.conn);
	
	// various elems we want convenient access to
	this.$roster = $('#roster');
	this.$chats = $('#chats');

	// debug traffic toggle
	this.show_traffic = false;


	
	// set custom status if we have it
	if (JabberClient.conn.status && JabberClient.conn.status.status) {
		$('#custom_status').html(JabberClient.conn.status.status.statusMessage);
	}

	// disconnect button
	$('#disconnect').click(function () {
		JabberClient.disconnect();
	});

	
	// roster item clicks
	$('#roster').delegate('a', 'click', function () {
		var chat_div, jid, elem, input;
		
		// we'll need this for all of 'em
		// we're using the 'data-' HTML5 attribute
		jid = $(this).parents('.user').attr('data-jid');
		
		if ($(this).hasClass('remove')) {
			JabberClient.conn.roster.unsubscribe(jid);
		}
		
		else if ($(this).hasClass('edit_user')) {
			// grab the name element
			elem = $(this).siblings('.name');
			
			input = $('<input type="text">').val(elem.html()).keypress(function (e) {
				if (e.which === 13) {
					JabberClient.conn.roster.modifyContact(jid, $(this).val());
					$(this).remove();
					elem.show(0);
				}
			}); 
			
			// make the link say save instead of edit
			$(this).html('save').click(function (e) {
				$(this).html('edit');
				elem.show(0);
				// submit the change to the roster
				JabberClient.conn.roster.modifyContact(jid, input.val());
				
				input.remove();
				
				// don't let it bubble up to the delegated handler
				return false;
			});
			
			elem.after(input).hide();
		}
				
		else if ($(this).hasClass('start_chat')) {
			chat_div = JabberClient.get_or_create_chat(jid);
			
			chat_div.children('input').focus();
		}
	});
	
	// chat input handler
	$('.chat_input').live('keypress', function (e) {
		var jid = $(this).parents('.ui-tabs-panel').data('jid');
		
		// look for enter key
		if (e.which === 13) {
			e.preventDefault();
			
			JabberClient.send_chat_message(jid, $(this).val());
			
			// clear the chat box
			$(this).val('');
		}
		else {
			// JabberClient.conn.chat.sendChatState(jid, "composing");
		}
	});
	
	// muc input handler
	$('.muc_input').live('keypress', function (e) {
		var jid = $(this).parents('.ui-tabs-panel').data('jid');
		
		// look for enter key
		if (e.which === 13) {
			e.preventDefault();
			
			JabberClient.send_muc_message(jid, $(this).val());
			
			// clear the chat box
			$(this).val('');
		}
		else {
			//JabberClient.conn.chat.sendChatState(jid, "composing");
		}
	});
};


JabberClient.joinRoom = function(roomJid){
		var roomJid = roomJid;
		
		
		
		var nickname = 'guest_'+Math.floor(Math.random()*1111001);
		
		
		console.log('JabberClient.conn =' +JabberClient.conn);
		JabberClient.conn.muc.join(roomJid, nickname, JabberClient.roomMessageHandler, JabberClient.roomPresenceHandler);
}

JabberClient.roomPresenceHandler = function(obj){
	console.log('room presence handler '+obj)
}

JabberClient.roomMessageHandler = function(obj){
	console.log('room roomMessageHandler '+obj)
}



// tell it to connect
JabberClient.connect = function (account) {
	//var conn = new Strophe.Connection('http://bosh.metajack.im:5280/xmpp-httpbind');
	var conn = new Strophe.Connection(StropheConfig.boshUrl);
	
	// Logging so i can see all the traffic
	conn.xmlInput = function (body) {
		if (JabberClient.show_traffic) {
			//console.log('input', body);
		}
	};

	conn.xmlOutput = function (body) {
		if (JabberClient.show_traffic) {
			//console.log('output', body);
		}
	};
	
	conn.connect(account.jid, account.password, function (status) {
		if (status === Strophe.Status.CONNECTED) {
			JabberClient.handleConnected();
		} else if (status === Strophe.Status.DISCONNECTED) {
			JabberClient.handleDisconnected();
		}
	});

	JabberClient.conn = conn;
};

// tell it to disconnect
JabberClient.disconnect = function () {	
	// $('#disconnect').attr('disabled', 'disabled');
	// 
	// JabberClient.conn.status.goOffline();
	
	JabberClient.conn.disconnect();
};

// handler for when we're connected
JabberClient.handleConnected = function () {
//	$('#disconnect').removeAttr('disabled');
};

// hendler for when we're disconnected
JabberClient.handleDisconnected = function () {
	// clear the connection
	JabberClient.conn = null;
	
	// empty the roster UI
	JabberClient.$roster.empty();
	
	// re open the login dialog
	// $('#login_dialog').dialog('open');
};

// retrieves credentials from localStorage as a convenience while developing
JabberClient.get_credentials = function () {
	// this is clearly not very secure, but it's a way of storing the credentials
	// without having to hardcode anything
	
	// At least it's just on the client.
	// Credentials are not automatically saved for testing this you can, however
	// create a localStorage.jid and a localStorage.password in the browser to avoid
	// having to log in each time.
	// return {
	// 	jid: localStorage.jid, 
	// 	password: localStorage.password
	// };
};

// retrieves a group if it has one or returns a new one by the name you give
JabberClient.get_or_create_group = function (name) {
	var group;
	
	group = this.$roster.children('div.group[title="' + name + '"]');
	
	if (group.length) {
		return group;
	}
	else {
		return this.create_group(name);
	}
	
};

// creates a group
JabberClient.create_group = function (title) {
	var $newGroup;
	
	// get our group template and append to roster
	$newGroup = ICH.group({title: title});		
	$newGroup.appendTo(this.$roster);
	
	return $newGroup;
};
	
		
// this adds the user html to the roster, this is used by update_roster to 
// add the html to the page
JabberClient.add_user = function (jid, status, status_message, name, group_name) {
	var $user, group, ctx;
	
	ctx = {
		status: status,
		name: name || jid,
		status_message: status_message,
		jid: jid
	};
	
	// I can haz user?
	$user = ICH.user(ctx);
	
	group = this.get_or_create_group(group_name || 'ungrouped');
	
	group.children('ul').append($user);
};
	
	
// handler to upadate roster UI when the roster 
JabberClient.update_roster = function (roster) {
	var empty = true;
	
	// empty the current roster
	JabberClient.$roster.empty();

	$.each(roster.contacts, function (jid) {
		var away, status, i, status_message = '';
		
		empty = false;
		
		status = "offline";
		if (this.online()) {
			away = true;
			for (i in this.resources) {
				if (this.resources.hasOwnProperty(i)) {
					if (this.resources[i].show === "online" || this.resources[i].show === "chat") {
						away = false;
					}
					// this needs to be per-resource
					status_message = this.resources[i].status;
				}
			}
			status = away ? "away" : "online";
		}
		
		JabberClient.add_user(jid, status, status_message, this.name, this.groups[0]);
	});

	if (empty) {
		JabberClient.$roster.append("<i>No contacts :(</i>");
	}
};


// get or create a chat window
JabberClient.get_or_create_chat = function (full_jid) {
	var jid, jid_id, chat_div, chat_selector;
	
	jid = Strophe.getBareJidFromJid(full_jid);
	jid_id = JabberClient.jid_to_id(jid);
	chat_selector = '#chat_' + jid_id;
	
	// get our jquery object
	chat_div = $(chat_selector);
	
	// if we don't already have a chat going
	// make one
	if (chat_div.length === 0) {
		this.$chats.tabs('add', chat_selector, jid);
		
		// set our new chat_div
		chat_div = $(chat_selector);
		
		chat_div.data('jid', jid);
		
		// append our template and return our new chat
		chat_div.append(ICH.chat_window({id: jid_id}));
	}

	return chat_div;
};


// get or create a chat window
JabberClient.get_or_create_muc = function (muc_jid) {
	var jid, jid_id, chat_div, chat_selector;
	
//	console.log('get_or_create called', muc_jid);
	
	jid = Strophe.getBareJidFromJid(muc_jid);
	jid_id = JabberClient.jid_to_id(muc_jid);
	
	chat_selector = '#muc_' + jid_id;
	
	//console.log();
	
	// get our jquery object
	chat_div = $(chat_selector);
	
	// if we don't already have a chat going
	// make one
	if (chat_div.length === 0) {
		this.$chats.tabs('add', chat_selector, jid);
		
		// set our new chat_div
		chat_div = $(chat_selector);
		
		chat_div.data('jid', jid);
		
		// append our template and return our new chat
		chat_div.append(ICH.muc_window({id: jid_id}));
	}

	return chat_div;
};


// actually send the chat message
JabberClient.send_chat_message = function (jid, body) {
	// send the message
	this.conn.chat.sendChat(jid, body);
	
	// build the ui
	this.get_or_create_chat(jid).children('ul').append(ICH.chat_message({
		from: "me",
		name: "me",
		message: body
	}));
	
	// scroll down if needed
	JabberClient.scroll_chat(jid);
	
	return true;
};


JabberClient.send_muc_message = function (room, body) {
	JabberClient.conn.muc.message(room, '', body);
	
	// build the ui
	// this.get_or_create_muc(room).children('ul').append(ICH.chat_message({
	// 	from: "me",
	// 	name: "me",
	// 	message: body
	// }));
	// 
	// // scroll down if needed
	// JabberClient.scroll_muc(room);
};


// handle incoming chat messages
JabberClient.on_chat_message = function (message) {
	var chat_div;
	console.log('on_chat_message '+message);
	chat_div = JabberClient.get_or_create_chat(message.full_jid);
	
	if (message.body) {
		var message = new models.ChatEntry({jid:'111', text:message});
		this.chatViews[0].collection.add(message)
		// chat_div.children('ul').append(ICH.chat_message({
		// 	message: message.body,
		// 	name: Strophe.getNodeFromJid(message.full_jid)
		// }));
		// 
		// JabberClient.scroll_chat(message.full_jid);
	}

	return true;
};

// chat state received
JabberClient.chat_state_received = function (chat_state) {
//	console.log('chat state:', chat_state);
};


// subscription requested handler
JabberClient.subscription_requested = function (info) {
	ICH.subscription_request(info).dialog({
		autoOpen: true,
		draggable: false,
		modal: true,
		title: 'Subscription Request',
		buttons: {
			"Approve": function () {
				var name = $('#add_user_name').val();
				
				if (name.length) {
					JabberClient.conn.roster.approveSubscription(info.from, name);
				}
				else {
					JabberClient.conn.roster.approveSubscription(info.from);
				}
				
				$(this).dialog('close');
			},
			"Deny": function () {
				JabberClient.conn.roster.denySubscription(info.from);
				
				$(this).dialog('close');
			}
		}
	});
};

// handle muc message in the UI
JabberClient.handle_muc_message = function (message) {
	console.log('handle_muc_message body' +message.body);
	console.log('handle_muc_message room' +message.room);
	console.log('handle_muc_message nickname' +message.nickname);
	
	var chat_div;
	
	chat_div = JabberClient.get_or_create_muc(message.room);
	
	if (message.body) {
		chat_div.children('ul').append(ICH.chat_message({
			message: message.body,
			name: Strophe.getNodeFromJid(message.room)
		}));
		
		JabberClient.scroll_chat(message.room);
	}

	return true;
};

JabberClient.scroll_muc = function (jid) {
	var div = JabberClient.get_or_create_muc(jid);
	
	div.scrollTop = div.scrollHeight;
};

JabberClient.scroll_chat = function (jid) {
	var div = JabberClient.get_or_create_chat(jid);
	
	div.scrollTop = div.scrollHeight;
};

JabberClient.jid_to_id = function (jid) {
	return Strophe.getBareJidFromJid(jid).replace(/@/g, "_").replace(/\./g, "_");
};