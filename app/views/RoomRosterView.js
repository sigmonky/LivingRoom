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
					
					//Let's take the online users store
					var store = list.getStore();
					
					store.sync();
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
            layout: 'card',
            cardSwitchAnimation: {type: 'flip', duration: 500},
			fullscreen: true,
			items: [this.list]
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	}
	
});

//Component type registration
Ext.reg('RoomRosterView', LivingRoomAPI.views.RoomRosterView);