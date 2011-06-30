/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Login
 * @extends Ext.Panel
 * Panel that shows the login screen
 */

LivingRoomAPI.views.Login = Ext.extend(Ext.form.FormPanel, {
	
	manualLogin: false,
	
	initComponent : function(){
		
		this.addEvents(
            'loginSuccess',
            'loginFail'
        );

		Ext.apply(this, {
            fullscreen: true,
			scroll: 'vertical',
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'top',
				title: 'Login'
			}],
            items: [{
				xtype: 'fieldset',
				itemId: 'fmeChatRoom',
				title: 'ChatRoom Configuration',
				instructions: 'In order to allow you to login inside the public chat room, you have to insert your nickname ' +
							  'that will be used inside the room to identify you',
				defaults: {
					required: true,
					labelAlign: 'left'
				},
				items:[{
					xtype: 'textfield',
					itemId: 'txtNickname',
					name : 'nickname',
					label: 'Nickname',
					value: ''
				}]
			}],
            dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				items: [{
					xtype: 'spacer'
				},{
					text: 'Login',
					ui: 'action',
					iconMask: true, 
					iconAlign: 'left', 
					iconCls: 'lock_open',
					handler: this.doLogin,
					scope: this
				},
				{
					dock: 'top',
					title: 'Settings',
					xtype: 'toolbar',
					items: [
						{
							xtype: 'button',
							text: 'Facebook Connect',
							handler: this.facebookConnect,
							scope: this
						}
					]
				}
				
				
				
				]
			}]
		});
		
		LivingRoomAPI.views.Login.superclass.initComponent.call(this);
	},
	
	facebookConnect: function(e){

 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&scope=email,offline_access,publish_stream,xmpp_login&display=popup&response_type=token&display=touch";
	},
	
	getFacebookSessionKey: function(){
	
		//Let's take the Facebook Cookie
		var session = getFacebookTokenFromUrl();
		console.log('session = '+session);
		//Let's take the Access Token
		var accessToken = session.split('&')[0];
		//console.log('session split = '+session.split('|')[1]);
		
		//Let's finally return the SessionKey
		return session.split('|')[1];
		
	},
	
	doLogin: function(){
	
		//Let's get all the required fields to log in
		this.nickname = this.getComponent('fmeChatRoom').getComponent('txtNickname').getValue();
		
		//Setting up a scope variable
		var me = this;
		
		//Let's show the loading mask
		loadingMask.show();
		
		//Let's call the function that will allow to retrive the Facebook SessionKey
		facebook.sessionKey = this.getFacebookSessionKey();
		
		//Creation of the Facebook Application
		var fbApp = new JSJaCFBApplication(facebook);
		
		/* Let's create the component that will let the user to communicate in realtime with all
		 * the firends inside the facebook chat */
		facebookClient = new LIVINGROOM.xmpp.Client({
			httpbase: '/JHB/',
			timerval: 2000,
			authtype: 'x-facebook-platform',
			facebookApp: fbApp,
			listeners	: {
				connected: function(jid){
					
					/* Let's create the component that will let the user to communicate in realtime with all
					 * the firends inside the facebook chat */
					jabberClient = new LIVINGROOM.xmpp.Client({

						/*
						httpbase		   : 'http://www.logoslogic.com//http-bind',
						timerval		   : 2000,
						domain			   : 'logoslogic.com',
						resource		   : '',
						username		   : 'isaacueca',
						pass			   : 'cigano',
						register		   : false,
						*/

						httpbase		   : 'http://www.logoslogic.com/http-bind',
						timerval		   : 2000,
						authtype		   : 'saslanon',
						domain			   : 'public', 
 						/*username		 :'isaacueca',
						password		: 'cigano',*/ 
						resource		   : '',
						nickname		   : this.nickname,
						register		   : false,
						publicRoom  	   : true,
						publicRoomName	   : publicRoomName,
						conferenceSubdomain: 'conference',
						listeners: {
							connected: function(jid){

								//Let's fire the login success event
								me.onLoginSuccess();

								//Let's hide the loading Mask
								loadingMask.hide();

							},
							unauthorized: function(component) {
								
								//Let's hide the loading Mask
								loadingMask.hide();

								//Let's ask to the user if it wants to register inside the server
								Ext.Msg.confirm('Registration', 'You are not authorized to login inside the public chat room because your user doesn\'t exists. Do you want to register?', function(answer){

									//Yes I want to Register...
									if(answer == 'yes') {
										
										//Let's show the loading mask
										loadingMask.show();

										//Set the component in registration mode
										Ext.apply(component, {
											register: true
										});
										
										//Ask to the server for a new user registration
										component.connect();

									}

								});
								
								
							},
							scope: this
						}
					});

					//Let's finally connect to ejabberd server
					jabberClient.connect();

				},
				unauthorized: function(component) {
				
					//Let's hide the loading Mask
					loadingMask.hide();
					
					//Let's show an error message
					Ext.Msg.alert('Login Error', 'The parameters you enter to access to Facebook are not correct! Please check your credentials and try again.');
					
				},
				scope: this
			}
		});
		
		//Let's finally connect to facebook chat
		facebookClient.connect();
		
	},
	
	onLoginSuccess: function(){
	
		//Viene scatenato l'evento di login avvento con successo
		this.fireEvent('loginSuccess', this, true);    
		
	},
	
	onLoginFailure: function(response, opts){
		
		this.fireEvent('loginFail', this);    
		
	}

});
