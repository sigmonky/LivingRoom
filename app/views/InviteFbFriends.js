/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Friends
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.InviteFbFriends = Ext.extend(Ext.Panel, {
	
	isLoaded : false,
	
	initComponent : function(){
		
		var that = this;
		
		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar',
			dock: 'top',
			title: 'Invite Friends',
			layout: 'hbox',
			items: [{
				//Definition of logout button
				ui: 'back',
				text: 'Friends',
				iconMask: true,
				scope: this,
				handler: this.switchBack
			}
			]
		});

		this.store = Ext.StoreMgr.get('FriendListStore');
		
		
		this.isLoaded = false;
			
		//Definition of the list that will contains all the users in the Roster
		this.list = new Ext.List({
			id: 'friendsList',
			iconCls: 'user',
			iconMask: true,
			allowDeselect: false,
		    singleSelect: true,
		    /**
		     * @cfg {String} activeCls The CSS class that is added to each item when swiped
		     */
		    activeCls: 'search-item-active',
		
		//	grouped: true,
			//store: 'FriendListStore',
			
			store: this.store,
            itemTpl: '<div class="x-roster-user"><div class="action delete x-button">Delete</div>' +
					    '<div class="x-user-picture">' +
					 	'<img src="https://graph.facebook.com/{id}/picture" width="32" height="32" />' +
					     '</div>' +
					 	'<div class="x-user-name">' +
						 	'<b>{name}</b>' +
					     '</div>' +
					  '</div>',
			listeners: {
				
				itemtap: function(list, index, item, e) {

						var store = list.getStore();

						console.log('itemtap at index =' +index);
						//Let's take the selected user
						var user = store.getAt(index);
						console.log('itemtap user =' +user);


						var tplUser = new Ext.XTemplate(
							'<tpl for=".">',
								'<div style="padding:20px; background:#EEE">'+
							     '<div class="x-user-name">' +
									'<p class="message" style="font-size:0.8em">Invite {name} to get this app and join you in the chat</p>' +
								  '</div></div>' +
							'</tpl>'
						);

						var facebook_id = user.get('id');

						if (facebook_id != ''){
							var photo_url = "https://graph.facebook.com/"+facebook_id+"/picture";
						}else{
							var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
						}

						var html = tplUser.apply({
							name: user.get('name'),
			            	photo_url: photo_url,
			        	});


						that.user = user;

						that.panelLaunch({
	                        iconClass: 'x-panel-action-icon-close',
	                        position: 'tr',
	                        actionMethod: ['hide']
	                    }, html, user);
					
				},
				
				
				itemswipe: this.onItemSwipe,
	            containertap: this.deactivateAll,
	            
				
				scope: this
				
			}
        });
		
		this.loadFacebookFriends();

		Ext.apply(this,{
			layout:'fit',
			dockedItems: [this.toolbar],
			items: [this.list]
			
		});
        this.on({
            scope: this,
            itemswipe: this.onItemSwipe,
            containertap: this.deactivateAll
        });

		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	
	listeners: {
	        beforeactivate: function(ct, prevActiveCt) {
	
				console.log('Friends - Before Activate - currentScreen ==' +currentScreen);
				currentScreen = 'friends';
				Ext.dispatch({
				    controller: 'Roster',
				    action: 'resetBadge',
				});
	        },
	
	
	        beforedeactivate: function() {
	
	        }
	},
	
	switchBack: function(){
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'backToRoom'
		});
	},
	
	
	ShowWebPageInPanel: function (myPanel,url){

		myPanel.update("");
		myPanel.setLoading(true, true);

		//Perform AJAX Call
		//Note:- If you are using PhoneGap then you can even do cross domain AJAX
		Ext.Ajax.request({

			url: url,
			success: function(response, opts){

				var resText = response.responseText;
				myPanel.update(resText);
				myPanel.scroller.scrollTo({x: 0, y: 0});

			},
			failure: function(response, opts){
				alert(response.status);
			}		
		});

		myPanel.setLoading(false);

	},
	
	/**
     * Wraps all updates of children into one easy call
     */
    doUpdate: function() {
		//console.log("productGalleryPanel doUpdate()");
        this.updateStore();
    },

    /**
     * When a new room is defined for the Room Roster list panel
     * the store needs to be updated 
     * @private
     */
	updateStore: function(){
		
		console.log('update Swtore' +this.key);
		
		var newStore = Ext.StoreMgr.get('FriendListStore');
		this.store = newStore;
		
		var itemListGallery = Ext.getCmp('friendsList');
        itemListGallery.update();
        itemListGallery.bindStore(this.store);

	},
	
	
	talkToUser: function(options){
		
		var user = options.user;
		this.popupPnl.hide();
		//console.log('talk to user = '+user.get('nickname'));
		
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'openChatSessionOneToOne',
			show: true,
			user: user
		});
	},
	
	closePanel: function(){
		this.popupPnl.hide();
	},
	
	panelLaunch: function(pluginConfig, panelContent, user){
		
		console.log('panel launch')
		
		var form = new Ext.form.FormPanel({
		    id: 'messageEditor',
			cls: 'textAreaInvite',
			dock:'bottom',
		    items: [
		        {
		            xtype: 'textareafield',
					id: 'userMessageField',
		            name: 'narrative',
		            label: '',
					value:'I\'m using the Second Screen App. Download it and join me',
		        }
		    ]
		});
		
            this.popupPnl = new Ext.Panel({
                floating: true,
				bodyStyle: 'background: #EEE;',
                width: 280,
                height: 330,
                centered: true,
                modal: true,
	            scroll: 'vertical',
				hideMode: 'close',
                hideOnMaskTap: false,
                layout: 'fit',
				dockedItems:[
				{
					xtype: 'toolbar',
					dock: 'bottom',
					items:[
					
					{
								xtype: 'button', 
								margin: '0, 0, 0, 10px',
								text: 'Send Invite',
								handler: this.postToWall,
								scope: this,
								user: user,
					},
					{
								xtype: 'button',
								margin: '0, 0, 0, 15px',
								text: 'Cancel',
								handler: this.closePanel,
								scope: this,
					},


					
					]
					
				},
				
				{
					xtype: 'toolbar',
					dock: 'top',
					title: 'Invite'
				},
				
				form,
				],
                html: panelContent,
				showAnimation: {
					type: 'pop',
					duration: 250
				}

            });
            
            this.popupPnl.show();
     },


	postToWall: function(options){
		var that = this;
		var user = options.user;
		var message = Ext.getCmp('userMessageField').getValue();
		console.log('user id ='+user.get('id'));
		var url = 'http://www.logoslogic.com/chat/LivingRoom/facebook-proxy/facebook.php';
		var access_token = getFacebookTokenFromUrl();
		
		console.log('url ='+url);
		console.log('access_token ='+access_token);
		
		Ext.Ajax.request({
					url : url, 
					params: {
						access_token: access_token,
						message: message,
						user_id: user.get('id'),
						action: 'postToWall',
					},
					method: 'POST',
					success: function ( result, request ) {
						Ext.Msg.alert('Success', result.responseText); 
						Ext.Msg.alert('Invitation Sucessfuly Sent'); 
						that.popupPnl.hide();
					},

					failure: function ( result, request) { 
						Ext.Msg.alert('Failed', result.responseText); 
					}  
		});

		
		
	},



	loadFacebookFriends: function(){
		var url = 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl();
		console.log('urll '+ url);

		var that = this;

		var friendStore = Ext.StoreMgr.get('FriendListStore');
		loadingMask.show();
		
		Ext.util.JSONP.request({
	    		url: 'https://graph.facebook.com/me/friends',
				params: {
					access_token: getFacebookTokenFromUrl(),
				},
			    callbackKey: 'callback',
			    // Callback
			    callback: function (data) {
					console.log('data.length ='+data.data.length);
				    for (var i = 0, ln = data.data.length; i < ln; i++) {
					
                        var friend = data.data[i];
						var friend = Ext.ModelMgr.create({id: friend.id, name: friend.name}, 'Friend');
						friendStore.add(friend);
				    	friendStore.sync();
                    }


					loadingMask.hide();
					var itemSubList = Ext.getCmp('friendsList');
			        itemSubList.update();

					itemSubList.store.loadData(friendStore.data.items)
					this.store = friendStore;
			        itemSubList.update();
			        itemSubList.bindStore(this.store);
			
			  	}	
		});
	},

	switchBack: function(){
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'backToFriends'
		});
	},
	
	deactivateAll: function() {
        Ext.select('div.search-item', this.el.dom).removeCls(this.activeCls);
    },
    /**
     * @private
     * Handler for the itemswipe event - shows the Delete button for the swiped item, hiding the Delete button
     * on any other items
     */
    onItemSwipe: function(list, index, node) {
			console.log('onItemSwipe');
        	var el        = Ext.get(node),
            activeCls = this.list.activeCls,
            hasClass  = el.hasCls(activeCls);
        
        this.deactivateAll();
		
		var store = list.getStore();

		//Let's take the selected user
		var room = store.getAt(index);
		if (room.get('isPrivate') == true){
			console.log('onItemSwipe index '+index);

        	if (hasClass) {
            	el.removeCls(activeCls);
        	} else {
            	el.addCls(activeCls);
        	}
		}
    },

    
	
});

//Component type registration
Ext.reg('InviteFbFriends', LivingRoomAPI.views.InviteFbFriends);