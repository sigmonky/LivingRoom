/* 
 * LivingRoomAPI
 */

/**
 * @class LivingRoomAPI.controllers.Roster
 * @extends Ext.Controller
 * Controller able to handle the Roster object
 */
Ext.regController('Roster', {

	
	showOnlineUsers: function(options) {

		//Let's show the attenders Panel
		this.application.viewport.setActiveItem('pnlRoster', {
			type: 'slide', 
			duration: 500,
			reverse: true
		});
		
	},
	
	subscribeToJid: function(options){
		console.log('subscribeToJid id = '+options.jid);
		var friend_jid = options.jid;
		var friend_name= options.name;
		
		var user = new Object();
		user.jid = friend_jid;
		user.name = friend_name;
		
		jabberClient.addBuddy(user);
	},

	
	
	showFriends: function(){

			//Let's show the attenders Panel
			
			var original = 	this.application.viewport.getComponent('pnlRoster').getComponent('friendsList');
			console.log('original = '+original);
			this.application.viewport.getComponent('pnlRoster').setActiveItem(original, {
				type: 'slide', 
				duration: 500,
				reverse: true
			});

	},
	
	openChatSession: function(options){
		
		//Let's take all the user data
		var user = options.user.data;

		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoster').getComponent(user.jid);
		
		if(pnlChatSession == undefined){
		
			//Let's create the chat session panel
			var pnlChatSession = new LivingRoomAPI.views.ChatSession({
				itemId: user.jid,
				title: user.name,
				barTitle: user.name,
				iconCls: 'chat1',
				iconMask: true,
				badgeText: (options.show ? '' : '1'),
				remoteJid: user.jid,
				remoteUserName: user.name,
				jabberComponent: facebookClient
			});
			
			//Let's add the chat session panel
			this.application.viewport.getComponent('pnlRoster').add(pnlChatSession);
			
			
		}else{

			
			//Let's take the roster panel
			var pnlRoster = this.application.viewport.getComponent('pnlRoster');
			
			//Taking the TabBar component
	//		var tabBar = pnlRoster.getTabBar();

			//Let's check if we are currently on the chat panel with this user
	/*		if(pnlRoster.getActiveItem() != pnlChatSession){
				
				//Let's check every open chat to find the right one inside the TabBar
				Ext.each(tabBar.items.items, function(chat){
					
					//If the current chat panel is the one we are looking for...
					if(chat.getText() == user.name) {
						
						//Let's take the actual badge text
						var badgeNumber = (chat.getBadgeText() != '' ? parseInt(chat.getBadgeText()) : 0);
						
						//Let's increment the badge text
						chat.setBadge(badgeNumber + 1);

					}

				}, this);

			}*/

		}
		
		
		//Check if was requested to show the session panel
		if(options.show){

			//Let's show the chat session Panel
			this.application.viewport.getComponent('pnlRoster').setActiveItem(pnlChatSession, {
				type: 'slide', 
				duration: 500
			});

		}

		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('OnlineUsers');

		//Let's take the chat user
		var user = store.getById(user.jid);
		
		//Saving the active chat session
		user.set('chatActive', true);
		
	},
	
	openChatSessionOneToOne: function(options){
		
		//Let's take all the user data
		var user = options.user;
		console.log('openChatSessionOneToOne nickname = '+ user.get('nickname'));
		console.log('openChatSessionOneToOne jid = '+ user.get('jid'));
		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlFriends').getComponent(user.get('jid'));
		
		var userRemoteJidMsg = user.get('jid') +'_message';
		
		
		console.log('openChatSessionOneToOne userRemoteJidMsg ='+userRemoteJidMsg)
		
		
		console.log('openChatSessionOneToOne userRemoteJidMsg STORE ='+Ext.StoreMgr.get(userRemoteJidMsg))
		

		
		if (Ext.StoreMgr.get(userRemoteJidMsg) == undefined) {
			
			Ext.regStore(userRemoteJidMsg, {
				model: 'ChatMessage',
				autoLoad: true,
				proxy: {
					type: 'memory',
					reader: {
						type: 'json'
					}
				}
			});
		
		}else{
				this.chatStore.each(function (record) {
				    console.log('addMessageToOneToOneChatSession store each message = '+record.get('message'));
				});
		}
		
		//var roomList = Ext.StoreMgr.get('RoomListStore');
		//console.log('RoomListStore store = '+ roomList);
		
		var room = Ext.ModelMgr.create({
	    	jid: user.get('jid'),
			name: user.get('nickname'),
			topic: '',
			type: '',
			thumb:'http://www.logoslogic.com/chat/LivingRoom/user_default.gif',
			isPrivate:true,
		}, 'Room');
	
	//	roomList.add(room);

		if (!pnlChatSession) {
				//console.log("browse productDetailPanel this.render()")
				 pnlChatSession = this.render({
					xtype:"RoomChatSession",
					itemId: user.get('jid'),
					name: user.get('jid'),
					title: user.get('name'),
					barTitle: user.get('name'),
					iconCls: 'chat1',
					iconMask: true,
					isPrivate:true,
					badgeText: (options.show ? '' : '1'),
					remoteJid: user.get('jid'),
					remoteUserName: user.get('name'),
					isChatRoom: false,
					jabberComponent: jabberClient
				});
	     }
	     else {
				//console.log("browse productDetailPanel Ext.apply()")
	            Ext.apply(pnlChatSession, {jid: user.get('jid'), name: user.get('jid'), title:user.get('name'),remoteJid: user.get('jid'), remoteUserName: user.get('name'), isChatRoom:false, jabberComponent: jabberClient });
	      }

	        pnlChatSession.doUpdate();
			
			if (options.invitation == true){
				
				user.set('chatActive', true);
				
				console.log('openChatSessionOneToOne invitation true');
				this.application.viewport.setActiveItem('pnlFriends');
				this.application.viewport.getComponent('pnlFriends').setActiveItem(pnlChatSession,{type: 'slide', duration: 500});
			}else{
				this.application.viewport.getComponent('pnlFriends').setActiveItem(pnlChatSession,{type: 'slide', duration: 500});
			}
		
	},	
	

	
	openChatSessionForRoomRoster: function(options){
		
		//Let's take all the user data
		var user = options.user;
		console.log('openChatSessionForRoomRoster nickname = '+ user.get('nickname'));
		console.log('openChatSessionForRoomRoster jid = '+ user.get('jid'));

		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoomList').getComponent(user.get('jid'));
		
		var userRemoteJidMsg = user.get('jid') +'_message';
		
		Ext.regStore(userRemoteJidMsg, {
			model: 'RoomRosterItem',
			autoLoad: true,
			proxy: {
				type: 'memory',
				  	reader: {
				    	type: 'json'
				   	}
				}
		});
		
		
		var roomList = Ext.StoreMgr.get('RoomListStore');
		
		console.log('RoomListStore store = '+ roomList);
		
		var room = Ext.ModelMgr.create({
	    	jid: user.get('jid'),
			name: user.get('nickname'),
			topic: '',
			type: '',
			thumb:'http://www.logoslogic.com/chat/LivingRoom/user_default.gif',
			isPrivate:true,
		}, 'Room');
	
	
		roomList.add(room);


	//	this.application.viewport.getComponent(this.pnlRoomList).getComponent(user.jid);
		

		if (!pnlChatSession) {
				//console.log("browse productDetailPanel this.render()")
				 pnlChatSession = this.render({
					xtype:"RoomChatSession",
					itemId: user.get('jid'),
					name: room.get('jid'),
					title: user.get('nickname'),
					barTitle: user.get('nickname'),
					iconCls: 'chat1',
					iconMask: true,
					badgeText: (options.show ? '' : '1'),
					remoteJid: user.get('jid'),
					remoteUserName: user.get('nickname'),
					isChatRoom: false,
					jabberComponent: jabberClient
				});
	     }
	     else {
				//console.log("browse productDetailPanel Ext.apply()")
	            Ext.apply(pnlChatSession, {jid: user.jid, name: room.get('jid'), title:user.get('nickname'),remoteJid: user.get('jid'), isChatRoom:false, jabberComponent: jabberClient });
	      }

	        pnlChatSession.doUpdate();

	        this.application.viewport.getComponent('pnlRoomList').setActiveItem(pnlChatSession,{type: 'slide', duration: 500});
		
	},
	
	returnToChatOneOneSession: function(options){
		var nickname = options.nickname;
		var jid = options.jid
		var pnlChatSession = this.application.viewport.getComponent('pnlRoomList').getComponent(jid);
		console.log('returnToChatOneOneSession jid = '+jid );
		
		console.log('returnToChatOneOneSession nickname = '+nickname );
		
		if (!pnlChatSession) {
				//console.log("browse productDetailPanel this.render()")
				 pnlChatSession = this.render({
					xtype:"RoomChatSession",
					itemId: jid,
					name: jid,
					title: nickname,
					barTitle: nickname,
					iconCls: 'chat1',
					iconMask: true,
					badgeText: (options.show ? '' : '1'),
					remoteJid: jid,
					remoteUserName: nickname,
					isChatRoom: false,
					jabberComponent: jabberClient
				});
	     }
	     else {
				//console.log("browse productDetailPanel Ext.apply()")
	            Ext.apply(pnlChatSession, {jid: jid, name: jid, title:nickname, remoteJid: jid, isChatRoom:false, jabberComponent: jabberClient });
	      }
	     
		pnlChatSession.doUpdate();

        this.application.viewport.getComponent('pnlRoomList').setActiveItem(pnlChatSession,{type: 'slide', duration: 500});
        
	},
	

	
	addMessageToChatSession: function(options){
		
		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('isaacueca');

		//Let's take the chat user
		var user = store.getById(options.from);
		
		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoster').getComponent(user.get('jid'));
	
		console.log('addMessageToChatSession user= '+user);
	
	
		//Let's call the controller method able to show the user Roster
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'openChatSession',
			show: false,
			user: user
		});

		//Let's finally add the chat message
		pnlChatSession.addChatMessage(options.message, user, false);
		
	},
	
	
	openRoom: function(options){
		var room = options.room
		jabberClient.joinPublicRoom(room.get('jid'));

		var pnlRoom = this.pnlRoom;
		
		var roomStoreMessageName = room.get('jid')+'_message';
		
		console.log('open room roomStoreMessageName = '+ roomStoreMessageName);
		
		Ext.regStore(roomStoreMessageName, {
			model: 'ChatMessage',
			autoLoad: true,
			proxy: {
				type: 'memory',
			   	reader: {
			    	type: 'json'
			   	}
			}
		});
		
		
		var storeRoomMsg = Ext.StoreMgr.get(roomStoreMessageName);
		
		console.log('open room store = '+ storeRoomMsg);
		
		var message = Ext.ModelMgr.create({
	    	jid: '',
			nickname: '',
			facebook_id: '',
			time: '',
			message:'aaaaa',
		}, 'ChatMessage');
	
	
		storeRoomMsg.add(message);
		
		console.log('Room Chat session store msg -' +this.storeRoomMsg)
		
		if (!pnlRoom) {
			//console.log("browse productDetailPanel this.render()")
			 pnlRoom = this.pnlRoom = this.render({
				xtype: 'RoomChatSession',
                jid: room.get('jid'),
				id: room.get('jid'),
				topic: room.get('topic'),
				name: room.get('jid'),
				jabberComponent: jabberClient
			});
        }
        else {
			//console.log("browse productDetailPanel Ext.apply()")
            Ext.apply(this.pnlRoom, {jid: room.get('jid'), id: room.get('jid'), topic: room.get('topic'), name: room.get('jid'), jabberComponent: jabberClient });
        }

		
	//	this.roomRoster.removeAll();


        this.pnlRoom.doUpdate();

        this.application.viewport.getComponent('pnlRoomList').setActiveItem(this.pnlRoom,{type: 'slide', duration: 500});
		
	},
	
	showRoomParticipants:function(options){
			
		var roomRosterView = this.roomRosterView;
		
		var direction = options.direction;
		
		var key = options.roomName+'_room';
		
		this.roomRoster = Ext.StoreMgr.get(key);
		
		console.log('Room Roster View =key '+key)
		
		var that = this;

		if (!roomRosterView) {
				//console.log("browse productDetailPanel this.render()")
				 roomRosterView = this.roomRosterView = this.render({
					xtype: 'RoomRosterView',
					key: key
			});
	     }
	    else {
				//console.log("browse productDetailPanel Ext.apply()")
	           Ext.apply(roomRosterView, {key: key});
	    }

	    roomRosterView.doUpdate();
	
		if (direction == undefined){direction = 'left';}

	    this.application.viewport.getComponent('pnlRoomList').setActiveItem(roomRosterView, {type: 'slide', direction:direction, duration: 500});

	},
	
	showRoomRoster: function(options){
		
	/*		//Let's show the attenders Panel
			this.application.viewport.setActiveItem(roomRoster, {
				type: 'slide', 
				duration: 500,
				reverse: true
			}); */
			
			var roomRoster = this.roomRoster;

			if (!roomRoster) {
				//console.log("browse productDetailPanel this.render()")
				 roomRoster = this.roomRoster = this.render({
					xtype: 'RoomRosterView',
				});
	        }
	        else {
				//console.log("browse productDetailPanel Ext.apply()")
	           // Ext.apply(roomRoster);
	        }

	       // pnlRoom.doUpdate();

	        this.application.viewport.getComponent('pnlRoomList').setActiveItem(roomRoster, {type: 'slide', duration: 500});

	},
	
	backToRoom: function(){
		console.log('backToRoom')
		var pnlRoom = this.pnlRoom;
		
		this.application.viewport.getComponent('pnlRoomList').setActiveItem(pnlRoom, {
			type: 'slide', direction:'right',
			duration: 500
		});
	},
	
	backToRoomList: function(){
		this.application.viewport.getComponent('pnlRoomList').setActiveItem(0, {
			type: 'slide', direction:'right',
			duration: 500
		});
		
		//* Leave Room *//
	//	jabberClient.leaveRoom();
		
		
	},
	
	backToFriends: function(){
		console.log('backToFriends')
		this.application.viewport.getComponent('pnlFriends').setActiveItem(0, {
			type: 'slide', direction:'right',
			duration: 500
		});
	},
	
	addMessageToChatRoom: function(options){
		
		console.log('addMessageToChatRoom options.from '+ options.from);
		
		var mainDomain = options.from.substring(options.from.indexOf("@")+1, options.from.indexOf("."));
		
		console.log('addMessageToChatRoom mainDomain '+ mainDomain);

		if (mainDomain == 'conference'){

			var keyMsg = options.from.substring(0,options.from.indexOf('@'))+'_message';
			var keyRoom = options.from.substring(0,options.from.indexOf('@'))+'_room';

			console.log('addMessageToChatRoom key '+ keyRoom);

			//Let's take the public chat room panel
			//		var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList').getComponent(this.pnlRoom);
			//		console.log('addMessageToChatRoom ='+this.pnlRoom );
			//Let's finally add the chat message
			//	this.pnlRoom.addChatRoomMessage(options.message, options.from);

			var roster = Ext.StoreMgr.get(keyRoom);

			console.log('addMessageToChatRoom roster ='+roster);
			console.log('addMessageToChatRoom key ='+keyRoom);

			var user = roster.getById(options.from);

			//	console.log('addMessageToChatRoom from ='+from);

			console.log('addMessageToChatRoom user ='+user);
			var photo = user.get('facebook_id');
			console.log('addMessageToChatRoom photo ='+photo);

			if (photo != ''){
				var photo_url = "https://graph.facebook.com/"+photo+"/picture";
			}else{
				var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
			}
			console.log('addMessageToChatRoom photo_url ='+photo_url);


			var message = Ext.ModelMgr.create({
				jid: options.from,
				nickname: options.nickname,
				photo_url: photo_url,
				time: '',
				message:options.message,
				}, 'ChatMessage');


				var chatStore = Ext.StoreMgr.get(keyMsg);
				chatStore.add(message); 
			}else{

						console.log('addMessageToOneToOneChatSession options.from '+ options.from);
						console.log('addMessageToOneToOneChatSession options.message '+ options.message);

						var keyMsg = options.from.substring(0,options.from.indexOf('/'))+'_message';

						console.log('addMessageToOneToOneChatSession keyMsg =' +keyMsg);

						//Let's take the public chat room panel
				//		var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList').getComponent(this.pnlRoom);
				//		console.log('addMessageToChatRoom ='+this.pnlRoom );
						//Let's finally add the chat message
					//	this.pnlRoom.addChatRoomMessage(options.message, options.from);

						var roster = Ext.StoreMgr.get('Roster');

						console.log('addMessageToOneToOneChatSession roster ='+roster);

						var user = roster.getById(options.from.substring(0, options.from.indexOf('/')));

						///////////////////////////////////////////////////
						
						
						console.log('addMessageToOneToOneChatSession user=' +user);
						var isActive = user.get('chatActive');
						console.log('addMessageToOneToOneChatSession isActive=' +isActive);
						

						
						
						///////////////////////////////////////////////////



						console.log('addMessageToOneToOneChatSession user ='+user);
						var photo = user.get('facebook_id');
						console.log('addMessageToOneToOneChatSession photo ='+photo);

						if (photo != ''){
							var photo_url = "https://graph.facebook.com/"+photo+"/picture";
						}else{
							var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
						}
						console.log('addMessageToOneToOneChatSession photo_url ='+photo_url);

						var message = Ext.ModelMgr.create({
					    	jid: options.from,
							nickname: options.from,
							photo_url: photo_url,
							time: '',
							message:options.message,
						}, 'ChatMessage');

						
						if (Ext.StoreMgr.get(keyMsg) == undefined){
							
							Ext.regStore(keyMsg, {
								model: 'ChatMessage',
								autoLoad: true,
								proxy: {
									type: 'memory',
									  	reader: {
									    	type: 'json'
									   	}
									}
							});
	
						}
						
						this.chatStore = Ext.StoreMgr.get(keyMsg);
						
						console.log('addMessageToChatRoom chatStore2 '+chatStore);
						
						this.chatStore.add(message);
						this.chatStore.sync();
						
						this.chatStore.each(function (record) {
						    console.log('addMessageToOneToOneChatSession store each message = '+record.get('message'));
						});
				
						if (isActive == false){
							
							 pnlChatSession = this.render({
								xtype:"RoomChatSession",
								itemId: user.get('jid'),
								name: user.get('jid'),
								title: user.get('name'),
								barTitle: user.get('name'),
								iconCls: 'chat1',
								iconMask: true,
								isPrivate:true,
								badgeText: (options.show ? '' : '1'),
								remoteJid: user.get('jid'),
								remoteUserName: user.get('name'),
								isChatRoom: false,
								jabberComponent: jabberClient
							});
							
							pnlChatSession.doUpdate();
							
							console.log('addMessageToChatRoom is not active ');
							
							
							var tplUser = new Ext.XTemplate(
								'<tpl for=".">',
									'<div class="x-popup-invite"><div class="x-user-picture">' +
										'<img src="{photo_url}" width="52" height="52"/>'+
									'</div>' +
								     '<div class="x-user-name">' +
										'<b>{name} is inviting you to chat</b>' +
									  '</div></div>' +
								'</tpl>'
							);
							
							var facebook_id = user.get('facebook_id');

							if (facebook_id != ''){
								var photo_url = "https://graph.facebook.com/"+facebook_id+"/picture";
							}else{
								var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
							}
							
							
							var html = tplUser.apply({
								name: user.get('name'),
				            	photo_url: photo_url,
				        	});
							
							
							this.application.viewport.panelLaunch({
		                        iconClass: 'x-panel-action-icon-close',
		                        position: 'tr',
		                        actionMethod: ['hide']
		                    }, html, user);
		
							
						}

				
			}
		
	},
	
	
	addMessageToOneToOneChatSession: function(options){
		

				console.log('addMessageToOneToOneChatSession options.from '+ options.from);
				console.log('addMessageToOneToOneChatSession options.message '+ options.message);

				var keyMsg = options.fro+'_message';
				
				console.log('addMessageToOneToOneChatSession keyMsg =' +keyMsg);

				//Let's take the public chat room panel
		//		var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList').getComponent(this.pnlRoom);
		//		console.log('addMessageToChatRoom ='+this.pnlRoom );
				//Let's finally add the chat message
			//	this.pnlRoom.addChatRoomMessage(options.message, options.from);

				var roster = Ext.StoreMgr.get('Roster');

				console.log('addMessageToOneToOneChatSession roster ='+roster);

				var user = roster.getById(options.from);


				console.log('addMessageToOneToOneChatSession user ='+user);
				var photo = user.get('facebook_id');
				console.log('addMessageToOneToOneChatSession photo ='+photo);

				if (photo != ''){
					var photo_url = "https://graph.facebook.com/"+photo+"/picture";
				}else{
					var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
				}
				console.log('addMessageToOneToOneChatSession photo_url ='+photo_url);


				var message = Ext.ModelMgr.create({
			    	jid: options.from,
					nickname: options.from,
					photo_url: photo_url,
					time: '',
					message:options.message,
				}, 'ChatMessage');

				var chatStore = Ext.StoreMgr.get(keyMsg);
				chatStore.add(message);

	},
	
	addRoomAnnouncement: function(options){
	//	var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList').getComponent(this.pnlRoom);
		console.log('addRoomAnnouncement options.message = '+options.message)
		//Let's finally add the chat message
	//	pnlChatRoom.addRoomAnnouncement(options.message);

	}
	


});
