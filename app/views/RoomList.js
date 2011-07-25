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

		pnlPublicChatRoom = new LivingRoomAPI.views.RoomChatSession({
			id: 'test1',
			isChatRoom: true,
			jabberComponent: jabberClient
		});

		var roomRoster = new LivingRoomAPI.views.RoomRosterView({
			id: 'roomRoster',
			title: 'Roster'
        });


		Ext.apply(this,{
		
			fullscreen: true,
			layout:'card',
			items: [this.list, pnlPublicChatRoom, roomRoster]
			
		});

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	switchBack: function(){
		    //this.setActiveItem(0);
			//this.setActiveItem('test1', {type:'slide', direction:'left'});
			this.setActiveItem(0, {type:'slide', direction:'right'});
		
			//this.dockedItems.items[0].setTitle("Room Topic");
	}
	
});

//Component type registration
Ext.reg('RoomList', LivingRoomAPI.views.RoomList);