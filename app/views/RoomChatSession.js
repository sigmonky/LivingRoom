/* 
 * LivingRoomAPI
 */
/**
 * @class LivingRoomAPI.views.ChatSession
 * @extends Ext.Panel
 * ChatSession Screen
 */
LivingRoomAPI.views.RoomChatSession = Ext.extend(Ext.Panel, {
	
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
			itemId: 'toolbar',
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
			{xtype: 'spacer'},
			{
				//Definition of Show Rost button
				ui: 'action',
				text: 'Co-Viewers',
				iconMask: true,
		//		iconCls: 'arrow_right',
				scope: this,
				handler: this.showRoster
			}
			]
		});
		
		console.log('room jid -' +this.jid)
		console.log('room store msg -' +this.name+'message')
		
		this.store = Ext.StoreMgr.get('cueca');
		console.log('Room Chat session store msg -' +this.store)



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
								width: '30%',
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
					itemTpl : new Ext.XTemplate(
						'<tpl if="xindex % 2 === 0">',
							'<div class="bubbledLeft">',
								'<img class="odd" src="http://www.logoslogic.com/chat/LivingRoom/user_default.gif" width="32" height="32"/>',
									'{message}',
							'</div>',
						
						'</tpl>',
						'<tpl if="xindex % 2 === 1">',
							'<div class="bubbledLeft">',
								'<img class="odd" src="http://www.logoslogic.com/chat/LivingRoom/user_default.gif" width="32" height="32"/>',
											'{message}',
							'</div>',
						'</tpl>'
					),
					store: this.store,
					scroll: 'vertical'
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
      //  this.updateStore();
    },

    /**
     * When a new category is defined for the product list panel
     * the toolbar needs to be updated with a new title
     * @private
     */
    updateToolbar: function() {
		////console.log('state.listType ='+Marika.util.state.listType);
        // update toolbar's title
        var toolbar = this.down('toolbar');
        if (toolbar) {
			toolbar.setTitle(this.topic);
        }

		var f;
		//while(f = this.items.first()){
		//	this.remove(f, true);
	//	}
		this.doLayout();
    },

    /**
     * When a new Room is defined
     * the store for the item list needs to be updated
     * @private
     */
	updateStore: function(){
		
	},
	
	showRoster: function(){
		console.log('show roster 3');
		
		var store = Ext.StoreMgr.get(jabberClient.publicRoom);
		
		console.log('store show Roster = '+store);
		
		store.each(function (record) {
		    console.log('record.nickname = '+record.get('nickname'));
		});
		
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'showRoomParticipants', 
			roomName: jabberClient.publicRoom
		});
	},
	
	switchBack: function(){
		Ext.dispatch({
		    controller: 'Roster',
		    action: 'backToRoomList'
		});
		//this.setActiveItem(0, {type:'slide', direction:'right'});
	},
	
	
	sendMessage: function(message){
		
		//Let's take the written message
		var message = this.getDockedComponent('msgToolbar').getComponent('message');

			
		//Send the message to all the room participants
	    this.jabberComponent.sendRoomMessage(message.getValue());
		
		
		//Clear the message field
		message.setValue('');
		
	},
	
	addRoomAnnouncement: function(message){
		console.log('roomChatSession - addRoomAnnouncement message = '+message);
		var html;
		html = this.tplPublicAnnouncement.apply({
        	message: message
    	});
		var pnlMsg = new Ext.Panel({
			html: html
		});
		this.add(pnlMsg);
		this.doLayout();
	},
	
	addChatMessage: function(message, from, mine){
		var html;
		
	/*	if (from == null){
			html = this.tplMineFacebookMessage.apply({
				photo: this.getMyFacebooKProfilePhoto(),
				time: this.getTime(),
				align: (mine ? 'right': 'left'),
				color: (mine ? '#92d841': '#d3d3d3'),
            	message: message
        	});
		}else{
			var profilePhoto = this.getProfilePhoto(from);
			console.log('profilePhoto = '+profilePhoto);
			if (profilePhoto == ""){
				html = this.tplEmptyFacebookMessage.apply({
					photo: '',
					time: this.getTime(),
					align: (mine ? 'right': 'left'),
					color: (mine ? '#92d841': '#d3d3d3'),
	            	message: message
	        	});
			}else{
				html = this.tplFacebookMessage.apply({
					photo: profilePhoto,
					time: this.getTime(),
					align: (mine ? 'right': 'left'),
					color: (mine ? '#92d841': '#d3d3d3'),
            		message: message
        		});
			}
		}

		var pnlMsg = new Ext.Panel({
			html: html
		});
		
		this.add(pnlMsg);
		this.doLayout(); */
		
		var message = Ext.ModelMgr.create({
	    	jid: from,
			nickname: jabberClient.nickname,
			facebook_id: this.getMyFacebooKProfilePhoto(),
			time: '',
			message:message,
		}, 'ChatMessage');
	
		this.store.add(message);

	},
	
	addChatRoomMessage: function(message, from){
		
		//Taking the remote user nickname
		var nickname = from.split('/')[1];
		
		console.log('addChatRoomMessage from= '+from);
		
		
		console.log('addChatRoomMessage - store get' +this.name);
		
		var roster = Ext.StoreMgr.get(this.name);
		
		console.log('roster ='+roster);
		
		user = roster.getById(from);
		
		console.log('addChatRoomMessage from ='+from);
		
		console.log('addChatRoomMessage user ='+user);
		
		var photo = user.get('facebook_id');
		
	//	var photo = null;
		console.log('addChatRoomMessage photo ='+photo);
		
		
		var html;
		if (photo == null){
		 	html = this.tplPublicMessageNoPhoto.apply({
				time: this.getTime(),
				nickname: nickname,
            	message: message
        	});
		}else{
		 	html = this.tplPublicMessage.apply({
				photo: photo,
				time: this.getTime(),
				nickname: nickname,
            	message: message
        	});
		}

		//console.log('photo = '+ this.getProfilePhoto(from));

		var pnlMsg = new Ext.Panel({
			html: html
		});
		
		this.add(pnlMsg);
		this.doLayout();

	},
	
	getMyFacebooKProfilePhoto: function(){
		var facebookStore = Ext.StoreMgr.get('FacebookUser');
		var obj = facebookStore.getAt(0);
		var facebook_id = obj.get('id');
		console.log('facebok id ' +facebook_id);
		return facebook_id; 
	},
	
	getProfilePhoto: function(user){
		var photo = user.get('photoBase64');
		console.log('photo '+ photo);
		return photo;
	},
	
	/*
	scrollDown: function(height){
	
		a = this;
	
		//Let's take the panel scroller
		var scroller = this.scroller;
		
		console.log(scroller);
		
		var offset = scroller.getOffset();
		
		console.log(offset);
		
		var newOffset = new Ext.util.Offset(offset.x, (offset.y - height));
		
		alert('e');
		
		this.scroller.setOffset(newOffset, true);

		
	},
	*/

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
Ext.reg('RoomChatSession', LivingRoomAPI.views.RoomChatSession);

var a;