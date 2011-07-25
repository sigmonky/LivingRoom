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
	

	
	openChatSessionForRoomRoster: function(options){
		
		//Let's take all the user data
		var user = options.user.data;

		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoomList').getComponent(user.jid);
		
		if(pnlChatSession == undefined){
		
			//Let's create the chat session panel
			var pnlChatSession = new LivingRoomAPI.views.RoomOneToOneChatSession({
				itemId: user.jid,
				title: user.nickname,
				barTitle: user.nickname,
				iconCls: 'chat1',
				iconMask: true,
				badgeText: (options.show ? '' : '1'),
				remoteJid: user.jid,
				remoteUserName: user.nickname,
				jabberComponent: jabberClient
			});
			
			//Let's add the chat session panel
			this.application.viewport.getComponent('pnlRoomList').add(pnlChatSession);
			
			
		}else{

			
			//Let's take the roster panel
			var pnlRoster = this.application.viewport.getComponent('pnlRoomList');
			
			//Taking the TabBar component
			var tabBar = pnlRoster.getTabBar();

			//Let's check if we are currently on the chat panel with this user
			if(pnlRoster.getActiveItem() != pnlChatSession){
				
				//Let's check every open chat to find the right one inside the TabBar
				Ext.each(tabBar.items.items, function(chat){
					
					//If the current chat panel is the one we are looking for...
					if(chat.getText() == user.nickname) {
						
						//Let's take the actual badge text
						var badgeNumber = (chat.getBadgeText() != '' ? parseInt(chat.getBadgeText()) : 0);
						
						//Let's increment the badge text
						chat.setBadge(badgeNumber + 1);

					}

				}, this);

			}

		}
		
		
		//Check if was requested to show the session panel
		if(options.show){

			//Let's show the chat session Panel
			this.application.viewport.getComponent('pnlRoomList').setActiveItem(pnlChatSession, {
				type: 'slide', 
				duration: 500
			});
			
		//	this.application.viewport.getComponent('pnlChatSession').dockedItems.items[0].setTitle(user.nickname);
		}

		//Let's take the store that will contains all the roster users
	//	var store = Ext.StoreMgr.get('OnlineUsers');

		//Let's take the chat user
	//	var user = store.getById(user.jid);
		
		//Saving the active chat session
	//	user.set('chatActive', true);
		
	},
	
	
	addMessageToOneToOneChatSession: function(options){
		
		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('RoomRoster');

		//Let's take the chat user
		var user = store.getById(options.from);
		
		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoomList').getComponent(user.get('jid'));
		
	//	console.log('addMessageToOneToOneChatSession from= '+options.from);
	
	//	console.log('addMessageToOneToOneChatSession user= '+user);
	
		//Let's call the controller method able to show the user Roster
	/*	Ext.dispatch({
		    controller: 'Roster',
		    action: 'openChatSession',
			show: false,
			user: user
		});
*/
		//Let's finally add the chat message
		pnlChatSession.addChatMessage(options.message, user, false);
		
	},
	
	addRoomAnnouncement: function(options){
		var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList');
		console.log('addRoomAnnouncement options.message = '+options.message)
		//Let's finally add the chat message
		pnlChatRoom.addRoomAnnouncement(options.message);

	},
	
	
	addMessageToChatSession: function(options){
		
		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('RoomRoster');

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

		var pnlRoom = this.pnlRoom;
		
		if (!pnlRoom) {
			//console.log("browse productDetailPanel this.render()")
			 pnlRoom = this.pnlRoom = this.render({
				xtype: 'RoomChatSession',
                jid: room.get('jid'),
				id: room.get('jid'),
				topic: room.get('topic'),
				jabberComponent: jabberClient
			});
        }
        else {
			//console.log("browse productDetailPanel Ext.apply()")
            Ext.apply(pnlRoom, {jid: room.get('jid'), id: room.get('jid'), topic: room.get('topic'), jabberComponent: jabberClient });
        }

        pnlRoom.doUpdate();

        this.application.viewport.getComponent('pnlRoomList').setActiveItem(pnlRoom,{type: 'slide', duration: 500});
		
	},
	
	showRoomParticipants:function(id){
			
		var roomRoster = this.roomRoster;

		if (!roomRoster) {
				//console.log("browse productDetailPanel this.render()")
				 roomRoster = this.roomRoster = this.render({
					xtype: 'RoomRosterView',
			});
	     }
	    else {
				//console.log("browse productDetailPanel Ext.apply()")
	           Ext.apply(roomRoster);
	    }

	    roomRoster.doUpdate();

	    this.application.viewport.getComponent('pnlRoomList').setActiveItem(roomRoster, {type: 'slide', duration: 500});

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
	},
	
	addMessageToChatRoom: function(options){
		
		//Let's take the public chat room panel
		var pnlChatRoom = this.application.viewport.getComponent('pnlRoomList');
		console.log('addMessageToChatRoom')
		//Let's finally add the chat message
		pnlChatRoom.addChatRoomMessage(options.message, options.from);
		
	}


});
