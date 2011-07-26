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
		
		
		/* Definition of the template that will be used to show a direct 
		 * message coming from Facebook chat */
		this.tplFacebookMessage = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-chat-message">',
					'<table style="float: {align};">',
						'<tr>',
							'<td class="message">',
							'<img src="data:image/jpg;base64,{photo}" width="32" height="32" />',
								'<div class="message" style="background-color: {color};">',
									'{time}<br/>',
									'{message}',
								'</div>',
							'</td>',
						'</tr>',
					'</table>',		
				'</div>',
			'</tpl>'
		);
		
		this.tplMineFacebookMessage = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-chat-message">',
					'<table style="float: {align};">',
						'<tr>',
							'<td class="message">',
							'<img class="odd" src="https://graph.facebook.com/{photo}/picture" width="32" height="32"/>',
								'<div class="message" style="background-color: {color};">',
									'{time}<br/>',
									'{message}',
								'</div>',
							'</td>',
						'</tr>',
					'</table>',		
				'</div>',
			'</tpl>'
		);
		
		this.tplEmptyFacebookMessage = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-chat-message">',
					'<table style="float: {align};">',
						'<tr>',
							'<td class="message">',
							'<img class="odd" src="http://www.logoslogic.com/chat/LivingRoom/user_default.gif" width="32" height="32"/>',
								'<div class="message" style="background-color: {color};">',
									'{time}<br/>',
									'{message}',
								'</div>',
							'</td>',
						'</tr>',
					'</table>',		
				'</div>',
			'</tpl>'
		);
		
		//Definition of the message coming from the public chat room
		this.tplPublicMessage = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-public-chat-message">',
				//	'<img src="data:image/jpg;base64,{photo}" width="32" height="32" />',
					'<img src="https://graph.facebook.com/{photo}/picture" width="32" height="32"/>',
					'<p class="time">{time}</p>',
					'<p class="nickname">{nickname}</p>',
					'<p class="message">{message}</p>',
				'</div>',
			'</tpl>'
		);
		
		
		this.tplPublicAnnouncement = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-public-chat-message">',
					'<p class="message">{message}</p>',
				'</div>',
			'</tpl>'
		);
		
		
		this.tplPublicMessageNoPhoto = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-public-chat-message">',
					'<img src="http://www.logoslogic.com/chat/LivingRoom/user_default.gif" width="32" height="32"/>',
					'<p class="time">{time}</p>',
					'<p class="nickname">{nickname}</p>',
					'<p class="message">{message}</p>',
				'</div>',
			'</tpl>'
		);

		Ext.apply(this,{
		
			scroll: 'vertical',
			dockedItems: [
			{
				//Definition of the message panel
				xtype: 'panel',
				itemId: 'pnlMessage',
				dock: 'bottom',
				layout: 'hbox',
				defaults: {
					height: 80
				},
				items: [{
					xtype: 'textareafield',
					itemId: 'message',
					width: '70%'
				},{
					xtype: 'button',
					ui: 'action',
					dock: 'right',
					text: 'Send',
					width: '30%',
					handler: this.sendMessage,
					scope: this
				}]
			},
				this.toolbar

			]
		});

		//Superclass inizialization
		LivingRoomAPI.views.ChatSession.superclass.initComponent.call(this);
	
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
		var message = this.getDockedComponent('pnlMessage').getComponent('message');

			
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
		
		if (from == null){
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
		this.doLayout();

	},
	
	addChatRoomMessage: function(message, from){
		
		//Taking the remote user nickname
		var nickname = from.split('/')[1];
		
		console.log('addChatRoomMessage from= '+from);
		
		
		console.log('1');
		
	//	var roster = Ext.StoreMgr.get(jabberClient.publicRoom);
		
		console.log('2');
		
		//user = roster.getById(from);
		//var photo = user.get('facebook_id');
		var photo = null;
	//	console.log('photo ='+photo);
		console.log('3');
		
		
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