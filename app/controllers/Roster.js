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
	
	showRoomRoster: function(){

			//Let's show the attenders Panel
			this.application.viewport.setActiveItem('pnlRoomRoster', {
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
			var tabBar = pnlRoster.getTabBar();

			//Let's check if we are currently on the chat panel with this user
			if(pnlRoster.getActiveItem() != pnlChatSession){
				
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

			}

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
	
	showRoomParticipants:function(){
		this.application.viewport.getComponent('pnlPublicChat').setActiveItem('roomRoster', {
			type: 'slide', 
			duration: 500
		});	
	},
	
	showRoom: function(){
		this.application.viewport.getComponent('pnlPublicChat').setActiveItem('test1', {
			type: 'slide', 
			duration: 500
		});
	},
	
	openChatSessionForRoomRoster: function(options){
		
		//Let's take all the user data
		var user = options.user.data;

		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoster').getComponent(user.jid);
		
		if(pnlChatSession == undefined){
		
			//Let's create the chat session panel
			var pnlChatSession = new LivingRoomAPI.views.ChatSession({
				itemId: user.jid,
				title: user.nickname,
				iconCls: 'chat1',
				iconMask: true,
				badgeText: (options.show ? '' : '1'),
				remoteJid: user.jid,
				remoteUserName: user.nickname,
				jabberComponent: facebookClient
			});
			
			//Let's add the chat session panel
		//	this.application.viewport.getComponent('pnlRoster').add(pnlChatSession);
			
			
		}else{

			
			//Let's take the roster panel
			var pnlRoster = this.application.viewport.getComponent('pnlPublicChat');
			
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
			this.application.viewport.getComponent('pnlPublicChat').setActiveItem(pnlChatSession, {
				type: 'slide', 
				duration: 500
			});
			
			this.application.viewport.getComponent('pnlPublicChat').dockedItems.items[0].setTitle(user.nickname);
		}

		//Let's take the store that will contains all the roster users
	//	var store = Ext.StoreMgr.get('OnlineUsers');

		//Let's take the chat user
	//	var user = store.getById(user.jid);
		
		//Saving the active chat session
	//	user.set('chatActive', true);
		
	},
	
	
	
	
	
	addMessageToChatSession: function(options){
		
		//Let's take the store that will contains all the roster users
		var store = Ext.StoreMgr.get('OnlineUsers');

		//Let's take the chat user
		var user = store.getById(options.from);
		
		//Let's try to take an already active chat session panel
		var pnlChatSession = this.application.viewport.getComponent('pnlRoster').getComponent(user.get('jid'));
	
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
	
	addMessageToChatRoom: function(options){
		
		//Let's take the public chat room panel
		var pnlChatRoom = this.application.viewport.getComponent('pnlPublicChat');
		console.log('addMessageToChatRoom')
		//Let's finally add the chat message
		pnlChatRoom.addChatRoomMessage(options.message, options.from);
		
	}


});
