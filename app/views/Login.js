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
		
		//* If Cookie Is Set, get User Profile from Local or from Facebook */
		var token = getFacebookTokenFromUrl();
		if (token != ""){
			this.getFacebookProfile();
		}
		
		this.addEvents(
            'loginSuccess',
            'loginFail'
        );

		Ext.apply(this, {
            fullscreen: true,
			scroll: 'vertical',
			items: [
				{

							xtype: 'button',
							text: 'Facebook Connect',
							handler: this.doLogin,
							scope: this
						},
						
						{

									xtype: 'button',
									text: 'Invite',
									handler: this.invite,
									scope: this
								}
			   ]

		}); 
		
		LivingRoomAPI.views.Login.superclass.initComponent.call(this);
	},
	
	invite: function(){
		 location.href="http://www.facebook.com/dialog/friends/?id=brent&app_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&display=touch";
	},
	
	facebookConnect: function(e){

 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&scope=email,offline_access,publish_stream,xmpp_login&display=popup&response_type=token&display=touch";
	},
	
	getFacebookProfile: function(){
		var token = getFacebookTokenFromUrl();
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var data1 = "";
		Ext.util.JSONP.request({
	    		url: 'https://graph.facebook.com/me',
				params: {
					access_token: token
				},
			    callbackKey: 'callback',
			    // Callback
			    callback: function (data) {
					data1 = data.data;
					console.log('data is' +data);
					var user = Ext.ModelMgr.create({id: data.id, name: data.name, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, link:data.link, gender: data.gender, email:data.email, timezone: data.timezone, locale: data.locale, verified: data.verified, updated_time: data.updated_time}, 'FacebookUser');
					facebookStore.add(user);
			    	facebookStore.sync();
			    	//console.log("Loaded " + facebookStore.getCount() + " records");
					var obj = facebookStore.getAt(0);
					  console.log('obj is ' + obj.get('name'));
					//	var user = categoryStore.getAt(0);
					//	console.log ('user is ' + user.id);
			  	}	
		});
	},
	
	getFacebookSessionKey: function(){
		var session = getFacebookSessionFromUrl();
		return session;
	},
	
	callUserVerify: function(user){
		this.username = user;
	/*	Ext.util.JSONP.request({
	    		url: 'https://www.afrogjumps.com/chat/register/register2.php',
				params: {
					username: user,
					password: pass
				},
			    callbackKey: 'callback',
			    // Callback
			    callback: function (data) {
					console.log('callUserVerify finished data is' +data.password);
			  	}	
		}); */
		var that = this;
		Ext.Ajax.request({
					url : 'http://www.logoslogic.com/chat/LivingRoom/register/register2.php' , 
					params : { username : that.username},
					method: 'POST',
					success: function ( result, request ) {
						console.log('callUserVerify finished data is' +result.responseText);
						
						this.password = result.responseText;
						
						var me = this;

						//Let's show the loading mask
						loadingMask.show();

						//Let's call the function that will allow to retrive the Facebook SessionKey
						facebook.sessionKey = that.getFacebookSessionKey();

						//Creation of the Facebook Application
						var fbApp = new JSJaCFBApplication(facebook);

						/* Let's create the component that will let the user to communicate in realtime with all
						 * the firends inside the facebook chat */

					/*	facebookClient = new LIVINGROOM.xmpp.FacebookClient({
								httpbase: '/JHB/',
								timerval: 2000,
								authtype: 'x-facebook-platform',
								facebookApp: fbApp,
								listeners	: {
									connected: function(jid){ 	*/


										/* Session Attachment = http://codingcromulence.blogspot.com/2009/01/chat-hacking-part-ii.html*/

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
											authtype		   : '',
											domain			   : 'logoslogic.com',
											resource		   : '',
											nickname		   : that.nickname,
											username		   : that.username,
											pass			   : this.password,
											register		   : false,
											publicRoom  	   : true,
											publicRoomName	   : publicRoomName,
											conferenceSubdomain: 'conference',
											listeners: {
												connected: function(jid){

													//Let's fire the login success event
													that.onLoginSuccess();

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

												unavailable: function(message){
													loadingMask.hide();

													//Let's show an error message
													Ext.Msg.alert('Service unavailable', 'The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later..');
												},
												scope: this
											}
										});

										//Let's finally connect to ejabberd server
										jabberClient.connect();

									},
							/*	unauthorized: function(component) {

										//Let's hide the loading Mask
										loadingMask.hide();

										//Let's show an error message
										Ext.Msg.alert('Login Error', 'The parameters you enter to access to Facebook are not correct! Please check your credentials and try again.');

									},

									unavailable: function(message){
										loadingMask.hide();

										//Let's show an error message
										Ext.Msg.alert('Service unavailable', 'The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later..');
									},

									scope: this
								}
							});

							//Let's finally connect to facebook chat
							facebookClient.connect();
						
					},*/
					failure: function ( result, request) { 
						Ext.Msg.alert('Failed', result.responseText); 
					}  
		}); 
	},
	
	doLogin: function(){
		//Let's get all the required fields to log in
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		console.log('doLogin obj is ' + obj.get('name'));
		this.nickname = obj.get('name');
		this.username = obj.get('id');
		this.callUserVerify(this.username);
	//	this.nickname = this.getComponent('fmeChatRoom').getComponent('txtNickname').getValue();
	//	this.username = this.getComponent('fmeChatRoom').getComponent('txtUsername').getValue();
	//	this.password = this.getComponent('fmeChatRoom').getComponent('txtPassword').getValue();
	//	this.nickname = "asdasdasd"+Math.floor(Math.random()*101);
		}, 
	
	onLoginSuccess: function(){
		loadingMask.hide();
		this.fireEvent('loginSuccess', this, true);    
		
	},
	
	onLoginFailure: function(response, opts){
		
		this.fireEvent('loginFail', this);    
		
	}

});
