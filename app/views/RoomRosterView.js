/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Roster
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.RoomRosterView = Ext.extend(Ext.Panel, {
	
	///@private
	application: undefined,
	
	initComponent : function(){
	
		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Participants',
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
		

        overlay = new Ext.Panel({
            floating: true,
            modal: true,
            centered: true,
            width: 300,
            height: 300,
            styleHtmlContent: true,
            scroll: 'vertical',
            contentEl: 'lipsum',
            cls: 'htmlcontent'
        });
		
		panelLaunch = function(pluginConfig, panelContent){

	
            var pnl = new Ext.Panel({
                floating: true,
                width: 350,
                height: 270,
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
								text: 'Chat with this User',
								handler: this.facebookConnect,
								scope: this,
					},
					{
								xtype: 'button',
								margin: '10, 0, 0,0',
								dock: 'bottom',
								text: 'Report this User',
								handler: this.facebookConnect,
								scope: this,
					},
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
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			title: 'All Friends',
			iconCls: 'user',
			iconMask: true,
			store: 'RoomRoster',
            itemTpl: '<div class="x-roster-user">' +
					    '<div class="x-user-picture">' +
						'<img class="odd" src="https://graph.facebook.com/{facebook_id}/picture" width="32" height="32"/>' +
					     '</div>' +
					 	'<div class="x-user-name">' +
						 	'<b>{nickname}</b>' +
					     '</div>' +
					  '</div>',
			listeners: {
				
				itemtap: function(list, index, item, e) {
					overlay.html = null;
					
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
            layout: 'card',
			dockedItems: [this.toolbar],
            cardSwitchAnimation: {type: 'flip', duration: 500},
			fullscreen: true,
			items: [this.list]
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	
	switchBack: function(){
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'showRoom'
		});
	},
	
});

//Component type registration
Ext.reg('RoomRosterView', LivingRoomAPI.views.RoomRosterView);