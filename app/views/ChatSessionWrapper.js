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
	
	toolbar: "",
	
	initComponent: function(){

		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Room Topic',
			layout: 'hbox',
			items: [{
				//Definition of logout button
				ui: 'back',
				iconMask: true,
				scope: this,
				handler: this.switchBack
			},
			{xtype: 'spacer'},
			{
				//Definition of Show Rost button
				ui: 'action',
				text: 'Participants',
				iconMask: true,
				iconCls: 'arrow_right',
				scope: this,
				handler: this.showRoster
			}
			
			
			
			]
		});

		pnlPublicChat2 = new LivingRoomAPI.views.RoomChatSession({
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
			fullscreen:'true',
		//	dockedItems: [this.toolbar],
			items: [pnlPublicChat2, roomRoster]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
	},
	
	switchBack: function(){
		    this.setActiveItem(0);
			this.setActiveItem('test1', {type:'slide', direction:'right'});
		
			this.dockedItems.items[0].setTitle("Room Topic");
	},
	
	showRoster: function(){
		console.log('show roster');
		
		var store = Ext.StoreMgr.get('RoomRoster');
		store.each(function (record) {
		    console.log('record.nickname = '+record.get('nickname'));
		});
		
		this.setActiveItem('roomRoster', {type:'slide', direction:'left'});
		this.dockedItems.items[0].setTitle("Participants");
		
	   // this.setActiveItem(1);
	},
	
	addChatRoomMessage: function(message, from){
		console.log('addChatRoomMessage 1')
		pnlPublicChat2.addChatRoomMessage(message, from);
	},
	
	addRoomAnnouncement: function(message){
		console.log('addChatRoomMessage 1')
		pnlPublicChat2.addRoomAnnouncement(message);
	}
	
});

//Component type registration
Ext.reg('ChatSessionWrapper', LivingRoomAPI.views.ChatSessionWrapper);

