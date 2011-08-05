/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.Viewport
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.Viewport = Ext.extend(Ext.TabPanel, {
	
	///@private
	application: undefined,
	
	initComponent : function(){
	
		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Online Friends',
			items: [{
				//Definition of logout button
				ui: 'action',
				text: 'Logout',
				iconMask: true,
				iconCls: 'reply',
				scope: this,
				handler: this.logout
			},
			{
				//Definition of logout button
				ui: 'action',
				text: 'Roster',
				iconMask: true,
				iconCls: 'reply',
				scope: this,
				handler: this.getRoomRoster
			}]
		});

		//Definition of the roster panel

	
		//Definition of the roster panel
		this.pnlRoster = new LivingRoomAPI.views.Roster({
			itemId: 'pnlRoster',
			title: 'Friends',
		    badgeText : '1',
        });

		//Definition of the public chat panel
		this.pnlOneToOne = new LivingRoomAPI.views.ChatSession({
			itemId: 'pnlOneToOne',
			title: 'Active Chats',
			isChatRoom: true,
			jabberComponent: jabberClient
		});
		
		//Definition of the public chat panel
	/*	this.pnlPublicChat = new LivingRoomAPI.views.ChatSessionWrapper({
			itemId: 'pnlPublicChat',
			title: 'Rooms',
			isChatRoom: true,
			jabberComponent: jabberClient
		}); */
		
		//Definition of Room List
		
		this.pnlRoomList= new LivingRoomAPI.views.RoomList({
			itemId: 'pnlRoomList',
			title: 'All Fans',
			badgeText : '1',
		    
		});
		
		//Definition of the public chat panel
		this.settingsPanel = new LivingRoomAPI.views.Settings({
			title: 'Settings',
			itemId: 'settingsPanel'
		});
		
		this.logoutBtn = {
			ui: 'action',
			text: 'Logout',
			iconMask: true,
			iconCls: 'reply',
			scope: this,
			handler: this.logout
		}
	
		Ext.apply(this,{
		
			fullscreen: true,
		//	dockedItems: [this.toolbar],
			tabBar: {
                dock: 'top',
                layout: {
                    pack: 'center'
                }
            },
			items: [
			//	this.pnlRoster,
			//	this.pnlOneToOne,
				this.pnlRoomList,
				this.settingsPanel
			]
			
		});

		//Superclass inizialization
		LivingRoomAPI.Viewport.superclass.initComponent.call(this);
	
	},
	
	getRoomRoster: function(){
			//this.pnlPublicChat.openRoomRoster();
					/*this.application.viewport.setActiveItem('pnlRoomRoster', {
						type: 'slide', 
						duration: 500,
						reverse: true
					}); */
			this.pnlPublicChat.showRoster();
		//	this.showRoomRoster();
			//this.fireEvent('getRoomRosterOpen', this);
	},
	
	
	logout: function(){
		
		//Asking a confirm to logout the application
		Ext.Msg.confirm('Logout', 'Are you sure you want to Logout?', function(answer){
			
			//Yes I want to Logout...
			if(answer == 'yes') {

				//Let's disconnect from the public chat room
				jabberClient.disconnect();
				
				//Let's disconnect from the Facebbo chat
				facebookClient.disconnect();

				//Deleting the login Cookie
				delCookie('utente');

				//Updating the document location to reload the page
				window.location.reload();

			}
			
		});
		
	}

});
