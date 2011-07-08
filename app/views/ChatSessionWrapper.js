/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.ChatSession
 * @extends Ext.Panel
 * ChatSession Screen
 */
LivingRoomAPI.views.ChatSessionWrapper = Ext.extend(Ext.Panel, {
	
	application: undefined,
	
	remoteJid: undefined,
	
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
			},
			{
				//Definition of Show Rost button
				ui: 'action',
				text: '',
				iconMask: true,
				iconCls: 'arrow_right',
				scope: this,
				handler: this.showRoster
			}
			
			
			
			]
		});

		pnlPublicChat2 = new LivingRoomAPI.views.ChatSession({
			id: 'test1',
			isChatRoom: true,
			jabberComponent: jabberClient
		});
		
		var blockTwo = new Ext.Panel({
			style:"background-color:#ae2323",
			id: 'test2',
			layout: 'auto',
			padding: 115,
		});
		
		var roomRoster = new LivingRoomAPI.views.RoomRosterView({
			id: 'roomRoster',
			title: 'Roster'
        });

		Ext.apply(this,{
			layout:'card',//* could be card/fit as well?*///
			flex: 1,
			fullscreen:'true',
			dockedItems: [toolbar],
			items: [pnlPublicChat2, roomRoster]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
	},
	
	switchBack: function(){
		    this.setActiveItem(0);
	},
	
	showRoster: function(){
		console.log('show roster');
		
		var store = Ext.StoreMgr.get('RoomRoster');
		store.each(function (record) {
		    console.log('record.nickname = '+record.get('nickname'));
		});
		
		this.setActiveItem('roomRoster', {type:'slide', direction:'right'});
		
	   // this.setActiveItem(1);
	},
	
	addChatRoomMessage: function(message, from){
		console.log('addChatRoomMessage 1')
		pnlPublicChat2.addChatRoomMessage(message, from);
	}
	
});

//Component type registration
Ext.reg('ChatSessionWrapper', LivingRoomAPI.views.ChatSessionWrapper);

