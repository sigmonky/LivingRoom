Ext.ns('App.View');

/**
 * Config View
 *
 * @class App..ViewConfig
 * @namespace App.View
 * @extends Ext.form.FormPanel
 */
App.View.Config = Ext.extend(Ext.form.FormPanel, {

	initComponent: function() {
		this.store = Ext.StoreMgr.get('ConfigStore');
		this.store.load();
		
		if (App.Util.facebookAccessToken == ""){
			App.Util.setFacebookTokenFromUrl();
			this.getFacebookProfile() 
		}
		else{
			//this.getFacebookProfile();
		}

		var config = {
			fullscreen: true,
			scroll: 'vertical',
			defaults: {

			},
			items: [
				{
					xtype: 'textfield',
					name : 'username',
					label: 'Username',
					placeHolder: ''
				},
				{
					xtype: 'passwordfield',
					name : 'password',
					label: 'Password',
					placeHolder: ''
				},
				{
					xtype: 'hiddenfield',
					name : 'server',
					label: 'Server',
					placeHolder: 'http://www.afrogjumps.com/http-bind',
					listeners: {
						blur: function(field){
							Ext.Viewport.scrollToTop();
						}
					}
				}
			],
			dockedItems: [
				{
					dock: 'top',
					title: 'Settings',
					xtype: 'toolbar',
					items: [
						{
							ui: 'button',
							text: 'Enter ChatRoom',
							itemId: 'backButton'
						},
						{
							xtype: 'spacer'
						},
						{
							xtype: 'button',
							text: 'Connect To Chat Server',
							handler: this.saveAction,
							scope: this
						},
						{
							xtype: 'button',
							text: 'Facebook Connect',
							handler: this.facebookConnect,/*this.saveAction,*/
							scope: this
						}
					]
				},
				{
					dock: 'top',
					xtype: 'panel',
					itemId: 'facebookphoto',
					html: '<img src="http://www.afrogjumps.com/xmpp/facebook/avatar.jpg" height="80"/>',
					tpl: '<img src="https://graph.facebook.com/{facebookphoto}/picture"  height="80"/>'
				}
			]
		};
		Ext.apply(this, config);
		App.View.Config.superclass.initComponent.call(this);
		this.addEventListener();
	},

	facebookConnect: function(e){
			
 location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.afrogjumps.com/xmpp/facebook/&scope=email,offline_access,publish_stream&display=popup&response_type=token&display=touch";
	},

	getFacebookStatus: function(){
		console.log('logged in');
	},

	getFacebookProfile: function(){
		
	var facebookStore = App.Store.Facebook;
	//console.log('tokenb ' +App.Util.facebookAccessToken)

	var data1 = "";
	imagePanel = Ext.getCmp('facebookphoto');
	
	Ext.util.JSONP.request({
    		url: 'https://graph.facebook.com/me',
			params: {
				access_token: App.Util.facebookAccessToken
			},

		    callbackKey: 'callback',
			scope:this,
		    // Callback
		    callback: function (data) {
				data1 = data.data;
				///console.log('data is' +data);
				var user = Ext.ModelMgr.create({id: data.id, name: data.name, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, link:data.link, gender: data.gender, email:data.email, timezone: data.timezone, locale: data.locale, verified: data.verified, updated_time: data.updated_time}, 'Facebook');
				App.Store.Facebook.add(user);
		    	///console.log("Loaded " + App.Store.Facebook.getCount() + " records");
				var obj = App.Store.Facebook.getAt(0);
				var profilePhoto = obj.get('id');
				///console.log('profilePhoto is ' + profilePhoto);
				if (App.Util.facebookAccessToken != ""){
				///	console.log('App.Util.facebookAccessToken =' +App.Util.facebookAccessToken);
					var panel = this.getComponent('facebookphoto');
					this.updateFacebookProfileImage(data.id);
				}
		    }
		});

	}, 

	addEventListener: function(){
		this.on(
			'activate',
			this.loadSettings,
			this
		);
	},

	loadSettings: function(){
		var conf = this.store.getAt(0);
		if (Ext.isObject(conf)) {
			this.load(conf);
		//	this.updateFacebookImg(conf);
		}
	},

	saveAction: function() {
		console.log("save action");
		var obj = App.Store.Facebook.getAt(0);
		var profilePhoto = obj.get('id');
		var data = this.getValues();
		var username = data.username.toLowerCase();
		var conf = Ext.ModelMgr.create({
				username: username,
				password: data.password,
				facebookphoto: profilePhoto,/*Ext.util.MD5(data.email)*/
				server: data.server
			},
			'Config'
		);
		this.updateFacebookImg(conf);
		this.store.removeAt(0);
		this.store.sync();
		this.store.add(conf);
		this.store.sync();
		this.connectToJabber(data.username, data.password);
	},
	
	connectToJabber: function(aUser, aPass){
		console.log('call controller Connection');

		Ext.dispatch({
			controller: 'Chat',
			action    : 'InitConnection',
			url : 'http://www.afrogjumps.com/http-bind',
			username : aUser,
			password: aPass
		});
	},
	
	updateFacebookProfileImage: function(aId){
		console.log ('updateFacebookProfileImage');
		var panel = this.getComponent('facebookphoto');
		var facebookUser = {}
		facebookUser.facebookphoto = aId;
		panel.update(facebookUser);
	},

	updateFacebookImg: function(confModel){
		console.log ('updateFacebookImg');
		var panel = this.getComponent('facebookphoto');
		panel.update(confModel.data);
	}
});
Ext.reg('App.View.Config', App.View.Config);