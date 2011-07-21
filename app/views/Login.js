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
				},
				{
					xtype: 'textfield',
					itemId: 'txtUsername',
					name : 'username',
					label: 'Username',
					value: ''
				},
				{
					xtype: 'textfield',
					itemId: 'txtPassword',
					name : 'password',
					label: 'Password',
					value: ''
				},
				
				]
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
					//  console.log('obj is ' + obj.get('name'));
					//	var user = categoryStore.getAt(0);
					//	console.log ('user is ' + user.id);
			  	}	
		});
	},
	
	getFacebookSessionKey: function(){
		var session = getFacebookSessionFromUrl();
		return session;
	},
	
	callUserVerify: function(user, pass){
		var username = user;
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
		
		Ext.Ajax.request({
					url : 'http://www.logoslogic.com/chat/LivingRoom/register/register2.php' , 
					params : { username : username},
					method: 'POST',
					success: function ( result, request ) {
						console.log('callUserVerify finished data is' +result.responseText);
						//Ext.getBody().unmask();
						//HighScore.views.SearchPanel.showSearchResults();
					},
					failure: function ( result, request) { 
						Ext.Msg.alert('Failed', result.responseText); 
					} 
		});
	},
	
	doLogin: function(){
		//Let's get all the required fields to log in
		var obj = facebookStore.getAt(0);
		console.log('doLogin obj is ' + obj.get('name'));
		this.nickname = obj.get('name');
		///// Call Cocoa Function to return the user name \\\\\\\\
		this.username = obj.get('id');
		///// Call Cocoa Function to return the user pass or Call PHP Script that creates the pass\\\\\\\\
		this.password = getPassword(this.username);
		/////
		this.callUserVerify(this.username, this.password)
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
