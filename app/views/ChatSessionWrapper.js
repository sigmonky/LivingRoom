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
	application: undefined,
	
	remoteJid: undefined,
	
	remoteUserName: undefined,
	
	jabberComponent: undefined,
	
	isChatRoom: false,
	
	initComponent: function(){


		var blockOne = new Ext.Panel({
			style:"background-color:#0000",
			layout: 'auto',
			padding: 15
		})
		
		var blockTwo = new Ext.Panel({
			style:"background-color:#ae2323",
			layout: 'auto',
			padding: 15
		})

		Ext.apply(this,{
			layout:'vbox',
			flex: 1,
			items: [blockOne, blockTwo]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
	}
	
});

//Component type registration
Ext.reg('ChatSessionWrapper', LivingRoomAPI.views.ChatSessionWrapper);

