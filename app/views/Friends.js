/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.Friends
 * @extends Ext.Panel
 * Main application Viewport
 */
LivingRoomAPI.views.Friends = Ext.extend(Ext.Panel, {
	
	isLoaded : false,
	
	initComponent : function(){
		
		var that = this;
		
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
		
			grouped: true,
			//store: 'FriendListStore',
			
			store: new Ext.data.Store({
                model: 'Friend'
            }),
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

						//Let's call the controller method able to show the user Roster
						/*	Ext.dispatch({
						    controller: 'Roster',
						    action: 'openChatSessionForRoomRoster',
							show: true,
							user: user
						}); */


						var tplUser = new Ext.XTemplate(
							'<tpl for=".">',
								'<div style="padding:20px; background:#EEE">'+
							     '<div class="x-user-name">' +
									'<p class="message">Invite {name} to get this app and join you in the chat</p>' +
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


		Ext.apply(this,{
		
			fullscreen: true,
			layout:'card',
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
	
	panelLaunch: function(pluginConfig, panelContent, user){
		
		var form = new Ext.form.FormPanel({
		    id: 'noteEditor',
			dock:'bottom',
		    items: [
		        {
		            xtype: 'textareafield',
		            name: 'narrative',
		            label: '',
					value:'I\'m using the Second Screen App. Download it and join me',
		        }
		    ]
		});
		
            this.popupPnl = new Ext.Panel({
                floating: true,
                width: 270,
                height: 370,
                centered: true,
                modal: true,
	            scroll: 'vertical',
				hideMode: 'close',
                hideOnMaskTap: false,
                layout: 'fit',
				dockedItems:[
				
				{
							xtype: 'button',
							margin: '10, 0, 0,0',
							dock: 'bottom',
							text: 'Cancel',
							handler: this.talkToUser,
							scope: this,
				},
				
					{
								xtype: 'button', 
								margin: '10, 0, 0,0',
								dock: 'bottom',
								text: 'Send',
								handler: this.talkToUser,
								scope: this,
								user: user,
					},form,
				],
                html: panelContent,
				showAnimation: {
					type: 'pop',
					duration: 250
				},
                plugins: [new Ext.ux.PanelAction(pluginConfig)]
            });
            
            this.popupPnl.show();
     },

	listeners: {
        beforeactivate: function(ct, prevActiveCt) {
			if (this.isLoaded != true){
			console.log('beforeactivate');
			var url = 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl();
			console.log('urll '+ url);
			
			
			Ext.regStore('FriendListStore', {
					model: 'Friend',
					proxy: {
						type: 'memory',
					   	reader: {
					    	type: 'json'
					   	}
					},
					
				    getGroupString : function(record) {
						var isLive = record.get('isLive');
						if (isLive == false){
							var str = 'My Facebook Friends';
						}else{
							var str = 'Active Chats';
						}
				        return  "<span style='display:none'>"+record.get('isLive').toString() + "</span>"+str ; 
				    },
				    autoLoad:false

				});
			
			var friendStore = Ext.StoreMgr.get('FriendListStore');
				
			Ext.util.JSONP.request({
		    		url: 'https://graph.facebook.com/me/friends',
					params: {
						access_token: '185799971471968%7Ce83f2eff9c114736aac52c0b.3-527305423%7C_DlATFHB_CJa2hlpSxwDGbCaYEE'
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
							var obj = friendStore.getAt(0);
							console.log('obj is ' + obj.get('name'));
	                    }
				  	}	
			});
			
			
			var itemSubList = Ext.getCmp('friendsList');
	        itemSubList.update();
			
			itemSubList.store.loadData(friendStore.data.items)
			this.store = friendStore;
	        itemSubList.update();
	        itemSubList.bindStore(this.store);
			this.isLoaded = true;
		/*	Ext.regStore('FriendListStore', {
				model: 'Friend',
				autoLoad: true,
			    proxy: {
			        type: 'ajax',
			      //  url: 'https://graph.facebook.com/me/friends?access_token='+getFacebookTokenFromUrl(),
					url: 'https://graph.facebook.com/me/friends?access_token=185799971471968%7Ce83f2eff9c114736aac52c0b.3-527305423%7C_DlATFHB_CJa2hlpSxwDGbCaYEE',
			        reader: {
			            type: 'jsonp',
			        }
			    },
			    getGroupString : function(record) {
					var isLive = record.get('isLive');
					if (isLive == false){
						var str = 'My Facebook Friends';
					}else{
						var str = 'Active Chats';
					}
			        return  "<span style='display:none'>"+record.get('isLive').toString() + "</span>"+str ; 
			    },
			    autoLoad:true

			}); */
			}
        },


        beforedeactivate: function() {

        }
    },

	switchBack: function(){
		    //this.setActiveItem(0);
			//this.setActiveItem('test1', {type:'slide', direction:'left'});
			this.setActiveItem(0, {type:'slide', direction:'right'});
		
			//this.dockedItems.items[0].setTitle("Room Topic");
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
Ext.reg('Friends', LivingRoomAPI.views.Friends);