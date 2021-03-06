/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Roster
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Roster = Ext.extend(Ext.Panel, {
	
	///@private
	application: undefined,
	
	initComponent : function(){
	
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			title: 'All Friends',
			id: 'friendsList',
			iconCls: 'user',
			iconMask: true,
			store: 'OnlineUsers',
            itemTpl: '<div class="x-roster-user">' +
					    '<div class="x-user-picture">' +
						 	'<img src="data:image/jpg;base64,{photoBase64}" width="32" height="32" />' +
					     '</div>' +
					 	'<div class="x-user-name">' +
						 	'<b>{name}</b>' +
					     '</div>' +
					  '</div>',
			listeners: {
				
				itemtap: function(list, index, item, e) {
					
					//Let's take the online users store
					var store = list.getStore();
					
					//Let's take the selected user
					var user = store.getAt(index);
					
					//Let's call the controller method able to show the user Roster
					Ext.dispatch({
					    controller: 'Roster',
					    action: 'openChatSession',
						show: true,
						user: user
					});
					
				},
				scope: this
				
			}
        });
	
		Ext.apply(this,{
		
			fullscreen: true,
			layout:'card',//* could be card/fit as well?*///
		/*	tabBar: {
                dock: 'top',
				scroll: 'horizontal',
                layout: {
                    pack: 'center'
                }
            }, */
			items: [this.list]
			
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	}
	
});

//Component type registration
Ext.reg('Roster', LivingRoomAPI.views.Roster);