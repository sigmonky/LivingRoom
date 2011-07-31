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
			cls: 'frontBackground',
			scroll: 'vertical',
			items: [
				{
							xtype: 'button',
							text: 'Facebook Connect',
							handler: this.facebookConnect,
							scope: this
						}
			   ]

		}); 
		
		LivingRoomAPI.views.Login.superclass.initComponent.call(this);
	},

	
	facebookConnect: function(e){

 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.logoslogic.com/chat/LivingRoom/&scope=email,offline_access,publish_stream,xmpp_login&display=popup&response_type=token&display=touch";
	},
	
	getFacebookProfile: function(){
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

						//Let's call the function that will allow to retrive the Facebook SessionKey
						facebook.sessionKey = that.getFacebookSessionKey();

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
	},
	
	doLogin: function(){
		loadingMask.show();
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		console.log('doLogin obj is ' + obj.get('name'));
		this.nickname = obj.get('name');
		this.username = obj.get('id');
		this.callUserVerify(this.username);
	}, 
	
	onLoginSuccess: function(){
		loadingMask.hide();
		this.fireEvent('loginSuccess', this, true);    
		
	},
	
	onLoginFailure: function(response, opts){
		
		this.fireEvent('loginFail', this);    
		
	}

});
