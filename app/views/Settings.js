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
				id: 'formField',
	            instructions: '',
	            items: [
	               {
	                  xtype: 'textfield',
					  id: 'facebookFieldName',
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
								handler: this.facebookConnect,
								scope: this
					}
	            ]
	         }
	      ]
			
		});
		//Superclass inizialization
		LivingRoomAPI.views.Settings.superclass.initComponent.call(this);
	},
	
	listeners: {
        beforeactivate: function(ct, prevActiveCt) {
			var textFieldValue = Ext.getCmp('settingsPanel').getCmp('formField').getCmp('facebookFieldName').value = 'cueca';
			
			
        },


        beforedeactivate: function() {

        }
    },
	
	
	facebookConnect: function(e){

 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&scope=email,offline_access,publish_stream,xmpp_login&display=popup&response_type=token&display=touch";
	},
	
	changeSettings: function(){
		console.log('change settings');
	}
	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);