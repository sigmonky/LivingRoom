/* 
 * TouchChat
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */
/**
 * @class TouchChat.Viewport
 * @extends Ext.Panel
 * Main application Viewport
 */
TouchChat.Viewport = Ext.extend(Ext.TabPanel, {
	
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
			}]
		});
	
		//Definition of the roster panel
		this.pnlRoster = new TouchChat.views.Roster({
			itemId: 'pnlRoster',
			title: 'FB Friends'
        });

		//Definition of the public chat panel
		this.pnlPublicChat = new TouchChat.views.ChatSession({
			itemId: 'pnlPublicChat',
			title: 'All Co-Viewers',
			isChatRoom: true,
			jabberComponent: jabberClient
		});
	
		Ext.apply(this,{
		
			fullscreen: true,
			dockedItems: [this.toolbar],
			tabBar: {
                dock: 'top',
                layout: {
                    pack: 'center'
                }
            },
			items: [
				this.pnlRoster,
				this.pnlPublicChat
			]
			
		});

		//Superclass inizialization
		TouchChat.Viewport.superclass.initComponent.call(this);
	
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
