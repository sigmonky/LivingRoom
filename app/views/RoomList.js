/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.RoomList
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.RoomList = Ext.extend(Ext.Panel, {
	
	initComponent : function(){
	
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			id: 'roomList',
			iconCls: 'user',
			iconMask: true,
			store: 'RoomListStore',
            itemTpl: '<div class="x-roster-user">' +
					    '<div class="x-user-picture">' +
						 	'<img src="{thumb}" width="32" height="32" />' +
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
					var room = store.getAt(index);
					
					//Let's call the controller method able to show the user Roster
					Ext.dispatch({
					    controller: 'Roster',
					    action: 'openRoom',
						show: true,
						room: room
					});
					
				},
				scope: this
				
			}
        });


		Ext.apply(this,{
		
			fullscreen: true,
			layout:'card',
			items: [this.list]
			
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	}
	
});

//Component type registration
Ext.reg('RoomList', LivingRoomAPI.views.RoomList);