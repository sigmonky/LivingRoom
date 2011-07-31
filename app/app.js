/* 
 * LivingRoomAPI
 */
Ext.regApplication('LivingRoomAPI', {
	
	//Set the default target
	defaultTarget: "viewport",
	
	//Set the application Index
	defaultUrl: 'Main/index',
	
	//Set the application Name
	name: 'LivingRoomAPI',

	//Set the application to use history
	useHistory: true,
	
	//Remove the Icon gloss
    glossOnIcon: false,
	
	//Set the application Icon
	icon: 'icon.png',

	//Set the phone startus screen
    phoneStartupScreen: 'phone_startup.png',
	
	//Definition of the application entry point function
	launch: function() {

	/*	this.vwLogin = new LivingRoomAPI.views.Login({
		
			listeners: {
			
				scope: this,

				loginSuccess: function(v, s){
					console.log('loginSuccess');
					//Destroying the login component
					v.destroy();
				
					//If the login has been succesfull completed...	
					if(s) { 
						
						//The user is logged in
						loggedIn = true;
						
						//Definition of the application Viewport
					//	this.viewport = new LivingRoomAPI.Viewport({
				    //        application: this
				     //   });

					}
				
				},

				loginFail: function(v){

				}
			
			}
		}); */
		
			var token = getFacebookTokenFromUrl();
			if (token != ""){
				//	this.connectAsRegistered();
				this.getFacebookUID();
			}
			else{
				this.connectAsAnonymous();

			}
			
			this.viewport = new LivingRoomAPI.Viewport({
	           application: this
	       });
		
	},
	
	connectAsAnonymous: function(){
		
		loadingMask.show();
		console.log('connectAsAnonymous');
		jabberClient = new LIVINGROOM.xmpp.Client({
						httpbase		   : 'http://www.logoslogic.com/http-bind',
						timerval		   : 2000,
						authtype		   : 'saslanon',
						domain			   : 'logoslogic.com',
						resource		   : '',
						nickname		   : 'cueca',
						register		   : false,
						publicRoom  	   : true,
						publicRoomName	   : '',
						conferenceSubdomain: 'conference',
							listeners: {
								connected: function(jid){
									console.log('connected');

									//Let's fire the login success event

									//Let's hide the loading Mask
									loadingMask.hide();
									loggedIn = true;

								},
								unauthorized: function(component) {
									console.log('unauthorized');

									//Let's hide the loading Mask
								//	loadingMask.hide();

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
									Ext.Msg.alert('Service unavailable', 'The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later..');
								},
								scope: this
							}
				});

				jabberClient.connect();
	},
	
	getFacebookUID: function(){
		
		console.log('getFacebookUID');
		
		loadingMask.show();
		
		var token = getFacebookTokenFromUrl();
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var data1 = "";
		var parent = this;
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
					parent.doLogin();
			  	}	
		});
		
		
	},
	
	doLogin: function(){
		
		console.log('doLogin');
		
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		console.log('doLogin obj is ' + obj.get('name'));
		this.nickname = obj.get('name');
		this.username = obj.get('id');
		this.connectAsRegistered(this.username);
	},
	
	getFacebookSessionKey: function(){
		var session = getFacebookSessionFromUrl();
		return session;
	},
	
	connectAsRegistered: function(user){
			this.username = user;
			console.log('connectAsRegistered user '+user);
			
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

							//Let's call the function that will allow to retrive the Facebook SessionKey
				//			facebook.sessionKey = that.getFacebookSessionKey();

							//Creation of the Facebook Application
							var fbApp = new JSJaCFBApplication(facebook);

							jabberClient = new LIVINGROOM.xmpp.Client({
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
												publicRoomName	   : '',
												conferenceSubdomain: 'conference',
												listeners: {
													connected: function(jid){

														//Let's fire the login success event
													//	that.onLoginSuccess();

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
														Ext.Msg.alert('Service unavailable', 'The server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later..');
													},
													scope: this
												}
									});

									jabberClient.connect();

						},

						failure: function ( result, request) { 
							Ext.Msg.alert('Failed', result.responseText); 
						}  
			});
	}

});


/* Intercept the event that will allow the user to disconnect from the
 * chat server before the application exit */
window.onbeforeunload = function() {
	
	//Let's check if the user is already Logged in
	if(loggedIn){
	
		//Let's disconnect from the public chat room
		jabberClient.disconnect();
	
		//Let's disconnect from the Facebbo chat
		//facebookClient.disconnect();
	
	}
	
}