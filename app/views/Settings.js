/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Settings
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Settings = Ext.extend(Ext.form.FormPanel, {

	fullscreen: true,
	scroll: 'vertical',
	title: 'Setttings',
	
	initComponent : function(){
		

		Ext.apply(this,{

	      	items: [
	         {
	            xtype: 'fieldset',
	            title: 'Settings',
	            instructions: '',
	            items: [
	               {
	                  xtype: 'textfield',
	                  name: 'name',
	                  label: 'Name',
	                  placeHolder: 'Tom Roy',
	                  autoCapitalize : true,
	                  required: true,
	                  useClearIcon: true
	               },
				   {
	                   xtype: 'passwordfield',
	                   name: 'password',
	                   label: 'Password',
	                   placeHolder: 'Select each time',
	                   useClearIcon: true
	               }, 
	
					{
		                  xtype: 'togglefield',
		                  name: 'enable',
		                  label: 'Auto Login'
		            }
	            ]
	         }
	      ]
			
		});

		//Superclass inizialization
		LivingRoomAPI.views.Settings.superclass.initComponent.call(this);
	
	}
	

	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);