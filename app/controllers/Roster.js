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
	
	openChatSession: function(options){
		

		
		
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
		pnlChatSession.addChatMessage(options.message, false);
		
	},
	
	addMessageToChatRoom: function(options){
		
		//Let's take the public chat room panel
		var pnlChatRoom = this.application.viewport.getComponent('pnlPublicChat');
		
		//Let's finally add the chat message
		pnlChatRoom.addChatRoomMessage(options.message, options.from);
		
	}


});
