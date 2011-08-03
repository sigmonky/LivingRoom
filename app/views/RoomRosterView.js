/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.RoomRosterView
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.RoomRosterView = Ext.extend(Ext.Panel, {
	
	id: undefined, 
	
	roomRoster: undefined, 
	
	key: undefined, 
	
	initComponent : function(){
	
		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Co-Viewers',
			layout: 'hbox',
			items: [{
				//Definition of logout button
				ui: 'back',
				text: 'Room',
				iconMask: true,
				scope: this,
				handler: this.switchBack
			}
			]
		});

		
		panelLaunch = function(pluginConfig, panelContent){
			this.user = user;
			
            var pnl = new Ext.Panel({
                floating: true,
                width: 270,
                height: 370,
                centered: true,
                modal: true,
	            scroll: 'vertical',
				hideMode: 'close',
                hideOnMaskTap: false,
                layout: 'fit',
				dockedItems:[
				{
							xtype: 'button', 
							margin: '10, 0, 0,0',
							dock: 'bottom',
							text: 'Block this User',
							handler: this.talkToUser,
							scope: this,
				},
				{
							xtype: 'button',
							margin: '10, 0, 0,0',
							dock: 'bottom',
							text: 'Report this User',
							handler: this.talkToUser,
							scope: this,
				},
					{
								xtype: 'button', 
								margin: '10, 0, 0,0',
								dock: 'bottom',
								text: 'Chat with this User',
								handler: this.talkToUser,
								scope: this,
					}
				],
                html: panelContent,
				showAnimation: {
					type: 'pop',
					duration: 250
				},
                plugins: [new Ext.ux.PanelAction(pluginConfig)]
            });
            
            pnl.show();
        };

		//this.roomRoster = jabberClient.publicRoom;
		this.store = Ext.StoreMgr.get(this.key);
        
		
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			title: 'All Friends',
			iconCls: 'user',
			id: 'itemListGallery',
			iconMask: true,
			store: this.store,
            itemTpl: '<div class="x-roster-user">' +
					    '<div class="x-user-picture">' +
						'<img class="odd" src="{profile_thumb_url}" width="32" height="32"/>' +
					     '</div>' +
					 	'<div class="x-user-name">' +
						 	'<b>{nickname}</b>' +
					     '</div>' +
					  '</div>',
			listeners: {
				
				itemtap: function(list, index, item, e) {
					
					//Let's take the online users store
				var store = list.getStore();
					
					console.log('itemtap at index =' +index);
					store.sync();
					//Let's take the selected user
					var user = store.getAt(index);
					console.log('itemtap user =' +user);
					
					//Let's call the controller method able to show the user Roster
					/*	Ext.dispatch({
					    controller: 'Roster',
					    action: 'openChatSessionForRoomRoster',
						show: true,
						user: user
					}); */
					
					
					var tplUser = new Ext.XTemplate(
						'<tpl for=".">',
							'<div style="padding:20px"><div class="x-user-picture">' +
								'<img src="https://graph.facebook.com/{facebook_id}/picture" width="52" height="52"/>'+
							'</div>' +
						     '<div class="x-user-name">' +
								'<p class="nickname">{nickname}</p>' +
							  '</div></div>' +
						'</tpl>'
					);
					
					
					var html = tplUser.apply({
						nickname: user.get('nickname'),
		            	facebook_id: user.get('facebook_id')
		        	});
		
				//	overlay.html = html;
					
		          // overlay.show();
		
					this.user = user;
					
					panelLaunch({
                        iconClass: 'x-panel-action-icon-close',
                        position: 'tr',
                        actionMethod: ['hide']
                    }, html); 
					
				},
				scope: this
				
			}
        });
	
		Ext.apply(this,{
         //   layout: 'card',
			dockedItems: [this.toolbar],
            cardSwitchAnimation: {type: 'flip', duration: 500},
		//	fullscreen: true,
			items: [this.list]
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	
	talkToUser: function(){
		
		console.log('talk to user = '+this.user);
	},
	
	/**
     * Wraps all updates of children into one easy call
     */
    doUpdate: function() {
		//console.log("productGalleryPanel doUpdate()");
        this.updateStore();
    },

    /**
     * When a new room is defined for the Room Roster list panel
     * the store needs to be updated 
     * @private
     */
	updateStore: function(){
		
		var itemListGallery = Ext.getCmp('itemListGallery');
        var newStore = Ext.StoreMgr.get(this.key);
		this.store = newStore;
        itemListGallery.update();
        itemListGallery.bindStore(this.store);

	},

	switchBack: function(){
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'backToRoom'
		});
	},
	
});

//Component type registration
Ext.reg('RoomRosterView', LivingRoomAPI.views.RoomRosterView);