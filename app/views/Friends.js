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
		
		this.store = Ext.StoreMgr.get('FriendListStore');
			
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
			grouped: true,
			store: this.store,
            itemTpl: '<div class="x-roster-user"><div class="action delete x-button">Delete</div>' +
					    '<div class="x-user-picture">' +
					 	'<img src="https://graph.facebook.com/{facebook_id}/picture" width="32" height="32" />' +
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

		var store = Ext.StoreMgr.get('Roster');

		var item = Ext.ModelMgr.create({
		    jid: '',
		    facebook_id: '',
			name: 'Invite Friends to Chat',
			chatState: 'invite',
			subscription: '',
		}, 'RosterItem');
		
		store.add(item);


		//Superclass inizialization
		LivingRoomAPI.views.Roster.superclass.initComponent.call(this);
	
	},
	
	talkToUser: function(options){
		
		var user = options.user;
		user.set('chatActive', true);
		user.set('chatState', 'active');
		
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
		
		var form = new Ext.form.FormPanel({
		    id: 'noteEditor',
			cls: 'textAreaInvite',
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
				bodyStyle: 'background: #EEE;',
                width: 240,
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
								handler: this.talkToUser,
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
				},
                plugins: [new Ext.ux.PanelAction(pluginConfig)]
            });
            
            this.popupPnl.show();
     },

	listeners: {
        beforeactivate: function(ct, prevActiveCt) {

			var itemSubList = Ext.getCmp('friendsList');
			itemSubList.update();
			var friendStore = Ext.StoreMgr.get('OnlineUsers');

			// this.store.loadData(friendStore.data.items)
			// 
			// this.store = friendStore;
			
	        //itemSubList.update();
	        itemSubList.bindStore(friendStore);
			


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