/* 
 * TouchChat
 * Copyright(c) 2011 SIMACS di Andea Cammarata
 * License: SIMACS di Andrea Cammarata
 */
/**
 * @class TouchChat.views.ChatSession
 * @extends Ext.Panel
 * ChatSession Screen
 */
TouchChat.views.ChatSession = Ext.extend(Ext.Panel, {
	
	///@private
	application: undefined,
	
	remoteJid: undefined,
	
	remoteUserName: undefined,
	
	jabberComponent: undefined,
	
	isChatRoom: false,
	
	initComponent: function(){

		/* Definition of the template that will be used to show a direct 
		 * message coming from Facebook chat */
		this.tplFacebookMessage = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="x-chat-message">',
					'<table style="float: {align};">',
						'<tr>',
							'<td class="message">',
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
					'<p class="time">{time}</p>',
					'<p class="nickname">{nickname}</p>',
					'<p class="message">{message}</p>',
				'</div>',
			'</tpl>'
		);

		Ext.apply(this,{
		
			scroll: 'vertical',
			dockedItems: [{
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
			}]
		});

		//Superclass inizialization
		TouchChat.views.ChatSession.superclass.initComponent.call(this);
	
	},
	
	sendMessage: function(message){
		
		//Let's take the written message
		var message = this.getDockedComponent('pnlMessage').getComponent('message');

		//Let's check if the message has to be send to a direct user
		if(!this.isChatRoom){
			
			//Send the written message
			this.jabberComponent.sendMessage(this.remoteJid, message.getValue());
			
		}else{
			
			//Send the message to all the room partecipants
			this.jabberComponent.sendRoomMessage(message.getValue());
		}
		
		/* If we are not sending a message to a chat room, must be added our sended message
		 * to the panel. If the message is send to a chat room we don't need to add it
		 * because the server will send it back to us too */
		if(!this.isChatRoom) {
			
			//Add the message panel component
			this.addChatMessage(message.getValue(), true);
		
		}
		
		//Clear the message field
		message.setValue('');
		
	},
	
	addChatMessage: function(message, mine){

		var html = this.tplFacebookMessage.apply({
			time: this.getTime(),
			align: (mine ? 'right': 'left'),
			color: (mine ? '#92d841': '#d3d3d3'),
            message: message
        });

		var pnlMsg = new Ext.Panel({
			html: html
		});
		
		this.add(pnlMsg);
		this.doLayout();

	},
	
	addChatRoomMessage: function(message, from){
		
		//Taking the remote user nickname
		var nickname = from.split('/')[1];
		
		var html = this.tplPublicMessage.apply({
			time: this.getTime(),
			nickname: nickname,
            message: message
        });

		var pnlMsg = new Ext.Panel({
			html: html
		});
		
		this.add(pnlMsg);
		this.doLayout();

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
Ext.reg('ChatSession', TouchChat.views.ChatSession);

var a;