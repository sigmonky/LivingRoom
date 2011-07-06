/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.ChatSession
 * @extends Ext.Panel
 * ChatSession Screen
 */
LivingRoomAPI.views.ChatSessionWrapper = Ext.extend(Ext.Panel, {
	
	///@private
	id: 'ChatSessionWrap',
	
	application: undefined,
	
	remoteJid: undefined,
	
	chatRoom: undefined,
	
	remoteUserName: undefined,
	
	jabberComponent: undefined,
	
	isChatRoom: false,
	
	initComponent: function(){

		var toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Room Topic',
			items: [{
				//Definition of logout button
				ui: 'action',
				text: 'Back',
				iconMask: true,
				iconCls: 'arrow_left',
				scope: this,
				handler: this.switchBack
			}]
		});


		var blockTwo = new Ext.Panel({
			style:"background-color:#ae2323",
			id: 'test2',
			layout: 'auto',
			padding: 115,
		});
		
		var roomRoster = new LivingRoomAPI.views.RoomRosterView({
			itemId: 'roomRoster',
			title: 'Roster'
        });

		Ext.apply(this,{
			layout:'card',//* could be card/fit as well?*///
			flex: 1,
			fullscreen:'true',
			dockedItems: [toolbar],
			items: [this.chatRoom, roomRoster]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
	},
	
	switchBack: function(){
		    this.setActiveItem(0);
	},
	
	showRoster: function(){
		console.log('show roster');
		this.setActiveItem('roomRoster', {type:'slide', direction:'down'})
	}
	
});

//Component type registration
Ext.reg('ChatSessionWrapper', LivingRoomAPI.views.ChatSessionWrapper);

