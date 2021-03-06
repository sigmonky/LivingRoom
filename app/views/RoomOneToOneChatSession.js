/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.ChatSession
 * @extends Ext.Panel
 * ChatSession Screen
 */
LivingRoomAPI.views.RoomOneToOneChatSession = Ext.extend(Ext.Panel, {
	
	///@private
	application: undefined,
	
	remoteJid: undefined,
	
	jid: undefined, 
	
	id: undefined, 
	
	topic: undefined, 
	
	name: undefined,
	
	remoteUserName: undefined,
	
	jabberComponent: undefined,
	
	toolbar: '',
	
	isChatRoom: false,
	
	initComponent: function(){
		
		this.toolbar = new Ext.Toolbar({
			itemId: 'toolbar2',
			dock: 'top',
			title: this.topic,
			layout: 'hbox',
			items: [{
				//Definition of logout button
				ui: 'back',
				text: 'Back',
				iconMask: true,
				scope: this,
				handler: this.switchBack
			},
			]
		});
		
		console.log('room jid -' +this.remoteJid)
		console.log('room store msg -' +this.remoteJid+'_message')
		
		this.store = Ext.StoreMgr.get(this.remoteJid+'_message');
		console.log('Room Chat session store msg -' +this.store)
		panelLaunch = function(pluginConfig, panelContent){

	
        var pnl = new Ext.Panel({
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
							text: 'Block this User',
							handler: this.facebookConnect,
							scope: this,
				},
				{
							xtype: 'button',
							margin: '10, 0, 0,0',
							dock: 'bottom',
							text: 'Report this User',
							handler: this.facebookConnect,
							scope: this,
				},
					{
								xtype: 'button', 
								margin: '10, 0, 0,0',
								dock: 'bottom',
								text: 'Chat with this User',
								handler: this.facebookConnect,
								scope: this,
					}

				],
                html: panelContent,
				showAnimation: {
					type: 'pop',
					duration: 250
				},
                plugins: [new Ext.ux.PanelAction(pluginConfig)]
            });
            
            pnl.show();
        };


		Ext.apply(this,{
			layout: 'fit',
			dockedItems: [
				{
					xtype: 'toolbar',
					dock: 'bottom',
					itemId: 'msgToolbar',
					layout: 'fit',
					items: [
							{
								xtype: 'textareafield',
								itemId: 'message',
								width: '70%'
							},
							{
								xtype: 'button',
								ui: 'action',
								dock: 'right',
								text: 'Send',
								width: '27%',
								handler: this.sendMessage,
								scope: this
							}
						]
			},
				this.toolbar

			],
			items: [
				{
					xtype: 'list',
					itemId: 'chatList',
					cls: 'messageList',
					itemTpl : new Ext.XTemplate(
						'<tpl if="xindex % 2 === 0">',
							'<div class="bubbledRight">',
							'<div class="bubbleimgRight" style="background:url({photo_url})" /></div>',
									'{message}',
							'</div>',
						
						'</tpl>',
						'<tpl if="xindex % 2 === 1">',
							'<div class="bubbledLeft">',
							'<div class="bubbleimg" style="background:url({photo_url})" /></div>',
											'{message}',
							'</div>',
						'</tpl>'
					),
					store: this.store,
					scroll: 'vertical',
					listeners: {

						itemtap: function(list, index, item, e) {

							//Let's take the online users store
							var store = list.getStore();

							console.log('itemtap at index =' +index);
							store.sync();
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
									'<div style="padding:20px"><div class="x-user-picture">' +
										'<img src="https://graph.facebook.com/{facebook_id}/picture" width="52" height="52"/>'+
									'</div>' +
								     '<div class="x-user-name">' +
										'<p class="nickname">{nickname}</p>' +
									  '</div></div>' +
								'</tpl>'
							);


							var html = tplUser.apply({
								nickname: user.get('nickname'),
				            	facebook_id: user.get('facebook_id')
				        	});

						//	overlay.html = html;

				          // overlay.show();

							panelLaunch({
		                        iconClass: 'x-panel-action-icon-close',
		                        position: 'tr',
		                        actionMethod: ['hide']
		                    }, html); 

						},
						scope: this

					}
				}
			]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
		this.addEventListener();
	
	},
	
	/**
	 * Add custom event listener
	 */
	addEventListener: function() {
		this.store.on(
			'datachanged',
			this.scrollToBottom,
			this
		);
	},

	/**
	 * Scroll to the button of the list
	 */
	scrollToBottom: function(){
		console.log('scrollToBottom');
		var list = this.getComponent('chatList');
		list.scroller.updateBoundary();
		list.scroller.scrollTo({x: 0, y:list.scroller.size.height}, true);
	},
	
	/**
     * Wraps all updates of children into one easy call
     */
    doUpdate: function() {
		console.log("productGalleryPanel doUpdate()");
		console.log('room jid -' +this.jid)
		
        this.updateToolbar();
        this.updateStore();
    },

    /**
     * When a new category is defined for the product list panel
     * the toolbar needs to be updated with a new title
     * @private
     */
    updateToolbar: function() {
		////console.log('state.listType ='+Marika.util.state.listType);
        // update toolbar's title
        var toolbar = this.getComponent('toolbar2');
        if (toolbar) {
			toolbar.setTitle(this.topic);
        }

		var f;
	//	while(f = this.items.first()){
	//		this.remove(f, true);
	//	}
		this.doLayout();
    },

    /**
     * When a new Room is defined
     * the store for the item list needs to be updated
     * @private
     */
	updateStore: function(){
		var chatList = this.getComponent('chatList');
        var newStore = Ext.StoreMgr.get(this.name+'_message');
		this.store = newStore;
        chatList.update();
        chatList.bindStore(this.store);
	},
	

	switchBack: function(){
		Ext.dispatch({
	    	controller: 'Roster',
	    	action: 'showRoomParticipants',
			direction: 'right',
		});
	},
	
	
	sendMessage: function(message){
		
		//Let's take the written message
		var message = this.getDockedComponent('msgToolbar').getComponent('message');

			
		//Send the message to all the room participants
		this.jabberComponent.sendMessage(this.remoteJid, message.getValue());
		
		this.addChatMessage(message.getValue(), null, true);
		
		//Clear the message field
		message.setValue('');
		
	},
	
	addChatMessage: function(message, from, mine){
		var html;
		
		var message = Ext.ModelMgr.create({
	    	jid: from,
			nickname: jabberClient.nickname,
			photo_url: this.getMyFacebooKProfilePhoto(),
			time: '',
			message:message,
		}, 'ChatMessage');
	
		this.store.add(message);

	},

	
	getMyFacebooKProfilePhoto: function(){
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		if (obj != undefined){
			console.log('obj = '+obj);
			var facebook_id = obj.get('id');
			console.log('facebok id ' +facebook_id);
			var photo_url = "https://graph.facebook.com/"+facebook_id+"/picture";
		}
		else{
			var photo_url  = 'http://www.logoslogic.com/chat/LivingRoom/user_default.gif';
		}
		return photo_url;
		
	},
	
	getProfilePhoto: function(user){
		var photo = user.get('photoBase64');
		console.log('photo '+ photo);
		return photo;
	},

	getTime: function(){
	    var data = new Date();
	    var Hh, Mm, Ss;
	    Hh = this.addZero(data.getHours()) + ":";
	    Mm = this.addZero(data.getMinutes()) + ":";
	    Ss = this.addZero(data.getSeconds());
	    return Hh + Mm + Ss;
	},

	addZero : function(num){
		(String(num).length < 2) ? num = String("0" + num) : num = String(num);
		return num;		
	}

});

//Component type registration
Ext.reg('RoomOneToOneChatSession', LivingRoomAPI.views.RoomOneToOneChatSession);

var a;