Ext.ns('App.View');

/**
 * Config View
 *
 * @class App..ViewConfig
 * @namespace App.View
 * @extends Ext.form.FormPanel
 * @author Nils Dehl <mail@nils-dehl.de>
 */
App.View.Config = Ext.extend(Ext.form.FormPanel, {

	// privat
	initComponent: function() {
		this.store = Ext.StoreMgr.get('ConfigStore');
		this.store.load();
		
		if (App.Util.facebookAccessToken == ""){
			App.Util.setFacebookTokenFromUrl(); 
		}

		var config = {
			fullscreen: true,
			scroll: 'vertical',
			defaults: {

			},
			items: [
				{
					xtype: 'textfield',
					name : 'nickname',
					label: 'Nickname',
					placeHolder: 'nickname83'
				},
				{
					xtype: 'emailfield',
					name : 'email',
					label: 'Gravatar',
					placeHolder: 'gravatar@email-adress.com'
				},
				{
					xtype: 'textfield',
					name : 'server',
					label: 'Server',
					placeHolder: '192.168.178.50',
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
							ui: 'back',
							text: 'back',
							itemId: 'backButton'
						}
					]
				},
				{
					dock: 'top',
					xtype: 'panel',
					itemId: 'gravatar',
					html: '<img src="http://www.gravatar.com/avatar/?s=80&d=mm" height="80"/>',
					tpl: '<img src="http://www.gravatar.com/avatar/{gravatar}?s=80&d=mm"  height="80"/>'
				},
				{
					dock: 'bottom',
					xtype: 'toolbar',
					items: [

						{
							xtype: 'spacer'
						},
						{
							xtype: 'button',
							text: 'save',
							handler: this.getFacebookStatus,/*this.saveAction,*/
							scope: this
						},
						{
							xtype: 'button',
							text: 'Facebook Profile',
							handler: this.getFacebookProfile,/*this.saveAction,*/
							scope: this
						},
						{
							xtype: 'button',
							text: 'Facebook Connect',
							handler: this.facebookConnect,/*this.saveAction,*/
							scope: this
						}
					]
				}
			]
		};
		Ext.apply(this, config);
		App.View.Config.superclass.initComponent.call(this);
		this.addEventListener();
	},


	facebookConnect: function(e){
    	location.href="https://graph.facebook.com/oauth/authorize?client_id=185799971471968&redirect_uri=http://www.afrogjumps.com/xmpp/facebook/&scope=email,offline_access,publish_stream&display=popup&response_type=token";
	},

	getFacebookStatus: function(){
		console.log('logged in');
	},

	getFacebookProfile: function(){
		var facebookStore = App.Store.Facebook;
		console.log('tokenb ' +App.Util.facebookAccessToken)
		
/*	var cueca = new Ext.data.Store({
		    model: 'Facebook',
		    proxy: {
		    	type: 'scripttag',
		        callbackParam: 'theCallbackFunction',
		    	url: 'https://graph.facebook.com/me?access_token='+App.Util.facebookAccessToken,
			  	reader: {
		            type: 'json'
			  	}
		  	},
		   listeners: {
			
	        'load' :  {
	            fn : function(store,records,options) {
					console.log('recods' +store)
	            },
	            scope : this
	        }
	
			'theCallbackFunction':{
				
				fn : function(store) {
					console.log('adsad recods' +store)
	            },
			}

			}

		});
		
		cueca.load(function(records, operation, success) {
		    console.log('loaded the records', records);
		}); */
		
	//	cueca.load(function(result){console.log('result = ' +result)})

	var data1 = "";
	Ext.util.JSONP.request({
    		url: 'https://graph.facebook.com/me',
			params: {
				access_token: App.Util.facebookAccessToken
			},
		    callbackKey: 'callback',
		    // Callback
		    callback: function (data) {
			data1 = data.data;
			console.log('data is' +data);
				 var user = Ext.ModelMgr.create({id: data.id, name: data.name, first_name: data.first_name, middle_name: data.middle_name, last_name: data.last_name, link:data.link, gender: data.gender, email:data.email, timezone: data.timezone, locale: data.locale, verified: data.verified, updated_time: data.updated_time}, 'Facebook');
				
	
				
				App.Store.Facebook.add(user);
		        App.Store.Facebook.sync();
		      
		        console.log("Loaded " + App.Store.Facebook.getCount() + " records");
			
			    var obj = App.Store.Facebook.getAt(0);
				console.log('obj is ' + obj.name);
		
				
			//	var user = categoryStore.getAt(0);
			//	console.log ('user is ' + user.id);
		    }
		});

	
		
		
	}, 


	/**
	 * Add custom event listener
	 */
	addEventListener: function(){
		this.on(
			'activate',
			this.loadSettings,
			this
		);
	},

	/**
	 * load user settings from store in the form
	 */
	loadSettings: function(){
		var conf = this.store.getAt(0);
		if (Ext.isObject(conf)) {
			this.load(conf);
			this.updateGravatarImg(conf);
		}
	},

	/**
	 * Save form user settings model in store
	 */
	saveAction: function() {
		var data = this.getValues();
		var conf = Ext.ModelMgr.create({
				nickname: data.nickname,
				email: data.email,
				gravatar: Ext.util.MD5(data.email),
				server: data.server
			},
			'Config'
		);
		this.updateGravatarImg(conf);
		this.store.removeAt(0);
		this.store.sync();
		this.store.add(conf);
		this.store.sync();
	},

	/**
	 * update the panel with the gravatar image
	 *
	 * @param {Object} Settings conf model
	 */
	updateGravatarImg: function(confModel){
		var panel = this.getComponent('gravatar');
		panel.update(confModel.data);
	}
});
Ext.reg('App.View.Config', App.View.Config);