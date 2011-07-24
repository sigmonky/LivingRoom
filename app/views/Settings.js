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
	                  placeHolder: 'My display name',
	                  autoCapitalize : true,
	                  required: true,
	                  useClearIcon: true
	               },
				{
	                   xtype: 'selectfield',
	                   name: 'mystatus',
	                   label: 'My Status',
	                   options: [{
	                       text: 'Available',
	                       value: 'available'
	                   }, {
	                       text: 'Away',
	                       value: 'away'
	                   }]
	               },
					{
		                  xtype: 'togglefield',
		                  name: 'enable',
		                  label: 'Auto-Login at Launch'
		            },
					{

								xtype: 'button',
								margin: '20px 0 0 0',
								text: 'Submit',
								handler: this.changeSettings,
								scope: this
							}
	            ]
	         }
	      ]
			
		});
		//Superclass inizialization
		LivingRoomAPI.views.Settings.superclass.initComponent.call(this);
	},
	
	changeSettings: function(){
		console.log('change settings');
	}
	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);