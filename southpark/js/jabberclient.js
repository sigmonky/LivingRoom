/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true */
/*global $ window document Strophe StropheConfig $pres $iq $msg ICH localStorage console */
"use strict";


var otalk = {};

// set up the object
otalk.init = function (connection) {
	var account;
	
	this.conn = connection;
	otalk.conn = this.conn;
	
	// various elems we want convenient access to
	this.$roster = $('#roster');
	this.$chats = $('#chats');
	
	// init chat area tabs
	this.$chats.tabs({
		tabTemplate: '<li><a href="#{href}"><span>#{label}</span></a><a class="close_tab">x</a></li>'
	});
	
	// debug traffic toggle
	this.show_traffic = false;
	
	// show login dialog if we don't have it in local storage
	// the localStorage option needs to be replaced with a 
	// local password manager or OAuth.
	// if (localStorage.jid) {
	// 	account = otalk.get_credentials();
	// 	
	// 	otalk.connect(account);
	// }
	// else {
	// 	$('#login_dialog').dialog({
	// 		autoOpen: true,
	// 		draggable: false,
	// 		modal: true,
	// 		title: 'Connect to XMPP',
	// 		buttons: {
	// 			"Connect": function () {
	// 				otalk.connect({
	// 					jid: $('#jid').val(),
	// 					password: $('#password').val()
	// 				});
	// 				
	// 				$('#password').val('');
	// 				$(this).dialog('close');
	// 			}
	// 		}
	// 	});
	// }
	
	// Set up UI element listeners
	$('.close_tab').live('click', function () {
		otalk.$chats.tabs('remove', $(this).context.tabIndex);
	});
	
	// set custom status if we have it
	if (otalk.conn.status && otalk.conn.status.status) {
		$('#custom_status').html(otalk.conn.status.status.statusMessage);
	}
	
	// make status editable
	$('#custom_status').inlineEdit({
		save: function (new_status) {
			otalk.conn.status.setCustomStatus(new_status);
		}
	});
	
	// disconnect button
	$('#disconnect').click(function () {
		otalk.disconnect();
	});
	
	// availability select box
	$('#join_muc').click(function () {
		ICH.muc_dialog().dialog({
			autoOpen: true,
			draggable: false,
			modal: true,
			title: 'Join MUC',
			buttons: {
				"Join": function () {
					otalk.conn.muc.join(
						$('#muc_room').val(), 
						$('#muc_nickname').val(), 
						function (m) {
						//	console.log(m);
						}, 
						function (m) {
						//	console.log(m);
						},
						$('#muc_password').val()
					);
					
					otalk.get_or_create_muc($('#muc_room').val());
					
					// clear inputs
					$(this).contents('input').val('');
										
					$(this).dialog('close');
				}
			}
		});
	});
	
	// try to get and show status from status plugin
	if (otalk.conn.status && otalk.conn.status.status.show) {
		$('#show').val(otalk.conn.status.status.show);
	}
	
	// availability select box
	$('#show').change(function () {
		otalk.conn.status.setShow($(this).val());
	});
	
	// roster item clicks
	$('#roster').delegate('a', 'click', function () {
		var chat_div, jid, elem, input;
		
		// we'll need this for all of 'em
		// we're using the 'data-' HTML5 attribute
		jid = $(this).parents('.user').attr('data-jid');
		
		if ($(this).hasClass('remove')) {
			otalk.conn.roster.unsubscribe(jid);
		}
		
		else if ($(this).hasClass('edit_user')) {
			// grab the name element
			elem = $(this).siblings('.name');
			
			input = $('<input type="text">').val(elem.html()).keypress(function (e) {
				if (e.which === 13) {
					otalk.conn.roster.modifyContact(jid, $(this).val());
					$(this).remove();
					elem.show(0);
				}
			}); 
			
			// make the link say save instead of edit
			$(this).html('save').click(function (e) {
				$(this).html('edit');
				elem.show(0);
				// submit the change to the roster
				otalk.conn.roster.modifyContact(jid, input.val());
				
				input.remove();
				
				// don't let it bubble up to the delegated handler
				return false;
			});
			
			elem.after(input).hide();
		}
				
		else if ($(this).hasClass('start_chat')) {
			chat_div = otalk.get_or_create_chat(jid);
			
			chat_div.children('input').focus();
		}
	});
	
	// add contact button
	$('#add_contact').click(function () {
		ICH.add_user_dialog().dialog({
			autoOpen: true,
			draggable: false,
			modal: true,
			title: 'Add user',
			buttons: {
				"Add": function () {
					otalk.conn.roster.subscribe($('#add_user_jid').val(), $('#add_user_name').val()); 
										
					$(this).dialog('close');
				}
			}
		});
	});
	
	// chat input handler
	$('.chat_input').live('keypress', function (e) {
		var jid = $(this).parents('.ui-tabs-panel').data('jid');
		
		// look for enter key
		if (e.which === 13) {
			e.preventDefault();
			
			otalk.send_chat_message(jid, $(this).val());
			
			// clear the chat box
			$(this).val('');
		}
		else {
			otalk.conn.chat.sendChatState(jid, "composing");
		}
	});
	
	// muc input handler
	$('.muc_input').live('keypress', function (e) {
		var jid = $(this).parents('.ui-tabs-panel').data('jid');
		
		// look for enter key
		if (e.which === 13) {
			e.preventDefault();
			
			otalk.send_muc_message(jid, $(this).val());
			
			// clear the chat box
			$(this).val('');
		}
		else {
			//otalk.conn.chat.sendChatState(jid, "composing");
		}
	});
};


// tell it to connect
otalk.connect = function (account) {
	//var conn = new Strophe.Connection('http://bosh.metajack.im:5280/xmpp-httpbind');
	var conn = new Strophe.Connection(StropheConfig.boshUrl);
	
	// Logging so i can see all the traffic
	conn.xmlInput = function (body) {
		if (otalk.show_traffic) {
			//console.log('input', body);
		}
	};

	conn.xmlOutput = function (body) {
		if (otalk.show_traffic) {
			//console.log('output', body);
		}
	};
	
	conn.connect(account.jid, account.password, function (status) {
		if (status === Strophe.Status.CONNECTED) {
			otalk.handleConnected();
		} else if (status === Strophe.Status.DISCONNECTED) {
			otalk.handleDisconnected();
		}
	});

	otalk.conn = conn;
};

// tell it to disconnect
otalk.disconnect = function () {	
	$('#disconnect').attr('disabled', 'disabled');
	
	otalk.conn.status.goOffline();
	
	otalk.conn.disconnect();
};

// handler for when we're connected
otalk.handleConnected = function () {
	$('#disconnect').removeAttr('disabled');
};

// hendler for when we're disconnected
otalk.handleDisconnected = function () {
	// clear the connection
	otalk.conn = null;
	
	// empty the roster UI
	otalk.$roster.empty();
	
	// re open the login dialog
	$('#login_dialog').dialog('open');
};

// retrieves credentials from localStorage as a convenience while developing
otalk.get_credentials = function () {
	// this is clearly not very secure, but it's a way of storing the credentials
	// without having to hardcode anything
	
	// At least it's just on the client.
	// Credentials are not automatically saved for testing this you can, however
	// create a localStorage.jid and a localStorage.password in the browser to avoid
	// having to log in each time.
	return {
		jid: localStorage.jid, 
		password: localStorage.password
	};
};

// retrieves a group if it has one or returns a new one by the name you give
otalk.get_or_create_group = function (name) {
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
otalk.create_group = function (title) {
	var $newGroup;
	
	// get our group template and append to roster
	$newGroup = ICH.group({title: title});		
	$newGroup.appendTo(this.$roster);
	
	return $newGroup;
};
	
		
// this adds the user html to the roster, this is used by update_roster to 
// add the html to the page
otalk.add_user = function (jid, status, status_message, name, group_name) {
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
otalk.update_roster = function (roster) {
	var empty = true;
	
	// empty the current roster
	otalk.$roster.empty();

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
		
		otalk.add_user(jid, status, status_message, this.name, this.groups[0]);
	});

	if (empty) {
		otalk.$roster.append("<i>No contacts :(</i>");
	}
};


// get or create a chat window
otalk.get_or_create_chat = function (full_jid) {
	var jid, jid_id, chat_div, chat_selector;
	
	jid = Strophe.getBareJidFromJid(full_jid);
	jid_id = otalk.jid_to_id(jid);
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
otalk.get_or_create_muc = function (muc_jid) {
	var jid, jid_id, chat_div, chat_selector;
	
//	console.log('get_or_create called', muc_jid);
	
	jid = Strophe.getBareJidFromJid(muc_jid);
	jid_id = otalk.jid_to_id(muc_jid);
	
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
otalk.send_chat_message = function (jid, body) {
	// send the message
	this.conn.chat.sendChat(jid, body);
	
	// build the ui
	this.get_or_create_chat(jid).children('ul').append(ICH.chat_message({
		from: "me",
		name: "me",
		message: body
	}));
	
	// scroll down if needed
	otalk.scroll_chat(jid);
	
	return true;
};


otalk.send_muc_message = function (room, body) {
	otalk.conn.muc.message(room, 'nick', body);
	
	// build the ui
	this.get_or_create_muc(room).children('ul').append(ICH.chat_message({
		from: "me",
		name: "me",
		message: body
	}));
	
	// scroll down if needed
	otalk.scroll_muc(room);
};


// handle incoming chat messages
otalk.on_chat_message = function (message) {
	var chat_div;
	
	chat_div = otalk.get_or_create_chat(message.full_jid);
	
	if (message.body) {
		chat_div.children('ul').append(ICH.chat_message({
			message: message.body,
			name: Strophe.getNodeFromJid(message.full_jid)
		}));
		
		otalk.scroll_chat(message.full_jid);
	}

	return true;
};

// chat state received
otalk.chat_state_received = function (chat_state) {
//	console.log('chat state:', chat_state);
};


// subscription requested handler
otalk.subscription_requested = function (info) {
	ICH.subscription_request(info).dialog({
		autoOpen: true,
		draggable: false,
		modal: true,
		title: 'Subscription Request',
		buttons: {
			"Approve": function () {
				var name = $('#add_user_name').val();
				
				if (name.length) {
					otalk.conn.roster.approveSubscription(info.from, name);
				}
				else {
					otalk.conn.roster.approveSubscription(info.from);
				}
				
				$(this).dialog('close');
			},
			"Deny": function () {
				otalk.conn.roster.denySubscription(info.from);
				
				$(this).dialog('close');
			}
		}
	});
};

// handle muc message in the UI
otalk.handle_muc_message = function (message) {
	var chat_div;
	
	chat_div = otalk.get_or_create_muc(message.room);
	
	if (message.body) {
		chat_div.children('ul').append(ICH.chat_message({
			message: message.body,
			name: Strophe.getNodeFromJid(message.room)
		}));
		
		otalk.scroll_chat(message.room);
	}

	return true;
};

otalk.scroll_muc = function (jid) {
	var div = otalk.get_or_create_muc(jid);
	
	div.scrollTop = div.scrollHeight;
};

otalk.scroll_chat = function (jid) {
	var div = otalk.get_or_create_chat(jid);
	
	div.scrollTop = div.scrollHeight;
};

otalk.jid_to_id = function (jid) {
	return Strophe.getBareJidFromJid(jid).replace(/@/g, "_").replace(/\./g, "_");
};