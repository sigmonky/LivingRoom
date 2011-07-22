/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Settings
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Settings = new Ext.form.FormPanel({

	
	initComponent : function(){
		


		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	

	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);