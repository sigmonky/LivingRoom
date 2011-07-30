/* 
 * TouchChat
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */
/**
 * @class TouchChat.views.Login
 * @extends Ext.Panel
 * Vista addetta a contenere il pannello di login.
 */

TouchChat.views.Login = Ext.extend(Ext.form.FormPanel, {
	
	manualLogin: false,
	
	initComponent : function(){
		
		//Vengono aggiunti gli eventi pubblici scatenabili dal componente
		this.addEvents(
			
			/**
			 * @event loginSuccess
		     * Viene scatenato non appena il login è avvenuto con successo.
             * @param {TouchChat.views.Login} v Questo componente.
             */
            'loginSuccess',

			/**
			 * @event loginFail
		     * Viene scatenato nel caso in cui il login fallisca.
             * @param {TouchChat.views.Login} v Questo componente.
             */
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
					value: 'AndreaCammarata'
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
				}]
			}]
		});
		
		//Viene richiamata la funzione di inizializzazione della superclasse
		TouchChat.views.Login.superclass.initComponent.call(this);
	},
	
	getFacebookSessionKey: function(){
	
		//Let's take the Facebook Cookie
//		var session = getCookie('fbs_' + facebook.appID);
		
		//Let's take the Access Token
	//	var accessToken = session.split('&')[0];
//		
		//Let's finally return the SessionKey
	//	return session.split('|')[1];
		
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
		jabberClient = new SIMACS.xmpp.Client({

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
						domain			   : 'public.logoslogic.com',
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
	
	onLoginSuccess: function(){
	
		//Viene scatenato l'evento di login avvento con successo
		this.fireEvent('loginSuccess', this, true);    
		
	},
	
	onLoginFailure: function(response, opts){
		
		this.fireEvent('loginFail', this);    
		
	}

});
