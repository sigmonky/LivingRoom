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
								handler: this.changeSettings,
								scope: this
					}
	            ]
	         },
	
			 {

							xtype: 'button',
							id: 'facebookButton',
							cls: 'facebookBtn',
							margin: '20px 0 0 0',
							text: 'Login to Facebook',
							handler: this.facebookConnect,
							scope: this
			},
	
	
	
	      ]
			
		});
		//Superclass inizialization
		LivingRoomAPI.views.Settings.superclass.initComponent.call(this);
	},
	
	listeners: {
        beforeactivate: function(ct, prevActiveCt) {
			console.log('settings - beforeactivate ');
		//	console.log('settings - beforeactivate textfield name  '+this.getComponent('formField').getComponent('facebookFieldName').value);
		//	this.getComponent('facebookFieldName').setValue('isaacueca');
			//Ext.get('facebookFieldName').set({value: 'isaacueca'});
			//// console.log('settings - beforeactivate '+ Ext.get('facebookFieldName').getValue);
			
			var facebookStore = Ext.StoreMgr.get('FacebookUser');
			
			var loggedIn = false;
			
			var obj = facebookStore.getAt(0);
			if (obj != undefined){
				var fb_id = obj.get('id');
				var name = obj.get('name');
				loggedIn = true;
			}
			
			var textFieldValue = this.getComponent('formField').getComponent('facebookFieldName').setValue(name);
			
			if (loggedIn == true){
				this.getComponent('facebookButton').setText("Logout from Facebook");
				
			}
			console.log('settings - facebookFieldName '+ this.getComponent('formField').getComponent('facebookFieldName'));
			
			
        },


        beforedeactivate: function() {

        }
    },
	
	
	facebookConnect: function(e){
	if (loggedIn == false){
 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&scope=email,offline_access,publish_stream,xmpp_login&display=popup&response_type=token&display=touch";
	}else{
		console.log('logout session key '+getFacebookSessionFromUrl());
	//	location.href= "http://www.facebook.com/logout.php?api_key=185799971471968&session_key="+getFacebookSessionFromUrl()+"&confirm=1&next=#http://www.logoslogic.com/chat/LivingRoom/";
		location.href="http://m.facebook.com/logout.php?confirm=1&next=http://www.logoslogic.com/chat/LivingRoom/"
	}
	
	},
	
	changeSettings: function(){
		console.log('change settings');
	}
	
});

//Component type registration
Ext.reg('Settings', LivingRoomAPI.views.Settings);