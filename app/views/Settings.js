/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Settings
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Settings = new Ext.form.FormPanel({

	fullscreen: true,
	scroll: 'vertical',
	title: 'Setttings',
	
	initComponent : function(){


		//Superclass inizialization
		LivingRoomAPI.views.Settings.superclass.initComponent.call(this);
	
	}
	

	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);