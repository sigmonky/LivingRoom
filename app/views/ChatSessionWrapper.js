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
				iconCls: 'back',
				scope: this,
				handler: this.switchBack
			}]
		});


		var chatRoom = new LivingRoomAPI.views.ChatSession({
			itemId: 'pnlTalent',
			title: 'Talent',
			id: 'test1',
			isChatRoom: true,
			jabberComponent: jabberClient
		});
		
		var blockTwo = new Ext.Panel({
			style:"background-color:#ae2323",
			id: 'test2',
			layout: 'auto',
			padding: 115,
		})

		Ext.apply(this,{
			layout:'card',//* could be card/fit as well?*///
			flex: 1,
			fullscreen:'true',
			dockedItems: [toolbar],
			items: [chatRoom, blockTwo]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
	},
	
	switchBack: function(){
		    Ext.getCmp('ChatSessionWrapper').layout.setActiveItem(0);
	},
	
	showRoster: function(){
		console.log('show roster');
	//	Ext.getCmp('ChatSessionWrap').setActiveItem('test2');
		this.setActiveItem('test2', {type:'slide', direction:'down'})
		//this.StartCard.setActiveItem; 
	}
	
	
	
});

//Component type registration
Ext.reg('ChatSessionWrapper', LivingRoomAPI.views.ChatSessionWrapper);

