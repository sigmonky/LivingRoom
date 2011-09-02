Ext.ns('App.View');

Ext.override(Ext.MessageBox, {
    onRender: Ext.util.Functions.createSequence(Ext.MessageBox.prototype.onRender, function() {
        this.mon(this.el, 'DOMFocusOut', function() {
            Ext.Viewport.scrollToTop();
        });
    })
});

App.View.GroupChat = Ext.extend(Ext.Panel, {
    fullscreen: false,
    layout: 'vbox',
    backText: 'Back',
    useTitleAsBackText: true,
    initComponent : function() {
	//console.log('init component')
		this.store = Ext.StoreMgr.get('ChatStore');
		var msg = Ext.ModelMgr.create({user: "cueca", message: "welcome"}, 'ChatMessage');
	//	this.store.add(msg);
       this.navigationButton = new Ext.Button({
            hidden: Ext.is.Phone || Ext.Viewport.orientation == 'landscape',
            text: 'Users',
            handler: this.onNavButtonTap,
            scope: this
        });

        var btns = [this.navigationButton];
        if (Ext.is.Phone) {
            btns.unshift(this.backButton);
        }

        this.navigationBar = new Ext.Toolbar({
            ui: 'dark',
            dock: 'top',
            title: "Chat Room",
			items: [
				{
					xtype: 'spacer'
				},
				{
					iconMask: true,
					ui: 'plain',
					iconCls: 'settings',
					itemId: 'settingsButton'
				}
			]
		});

        this.navigationPanel = new Ext.List({
            store: Ext.StoreMgr.get('RosterStore'),
            useToolbar: Ext.is.Phone ? false : true,
            dock: 'left',
            hidden: !Ext.is.Phone && Ext.Viewport.orientation == 'portrait',
            toolbar: Ext.is.Phone ? this.navigationBar : null,
			itemTpl: new Ext.XTemplate( // How we format the items when they come back
			        '<div class = "audio_jungle_item">',
			            '<span class = "item_author">{username}</span>',
			        '</div>'),
            listeners: {
                itemtap: this.onNavPanelItemTap,
                scope: this
            }
        });

		this.msgField =  {
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
				dock: 'right',
				text: 'Send',
				width: '30%',
				handler: this.sendMessage,
				scope: this
			}]
		};
		
        this.navigationPanel.on('back', this.onNavBack, this);

        if (!Ext.is.Phone) {
            this.navigationPanel.setWidth(250);
        }

        this.dockedItems = this.dockedItems || [];
        this.dockedItems.unshift(this.navigationBar);
        this.dockedItems.unshift(this.msgField);

        if (!Ext.is.Phone && Ext.Viewport.orientation == 'landscape') {
            this.dockedItems.unshift(this.navigationPanel);

        }
        else if (Ext.is.Phone) {
            this.items = this.items || [];
            this.items.unshift(this.navigationPanel);
        } 

		this.tplChatMessage = new Ext.XTemplate(
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
		
		var config = {
			layout: 'fit',
			items: [
				{
					xtype: 'list',
					itemId: 'chatList',
					itemTpl : new Ext.XTemplate(
						'<tpl if="xindex % 2 === 0">',
						'	<img class="odd" src="https://graph.facebook.com/{facebook_photo}/picture" width="30" height="30"/>',
						'	<p class="triangle-right left"><span class="nickname">{user}:</span> {message}</p>',
						'</tpl>',
						'<tpl if="xindex % 2 === 1">',
						'	<p class="triangle-right right"><span class="nickname">{user}:</span> {message}</p>',
						'	<img class="even" src="https://graph.facebook.com/{facebook_photo}/picture" width="30" height="30" />',
						'</tpl>'
					),
					store: this.store,
					scroll: 'vertical'
				}
			]
		};
		Ext.apply(this, config); 
		this.addEventListener();
		
       App.View.GroupChat.superclass.initComponent.call(this);
    },

	addEventListener: function() {
		this.store.on(
			'datachanged',
			this.scrollToBottom,
			this
		);
	},
	
	sendMessage: function(){
		console.log('send message');
		//Let's take the written message
		var message = this.getDockedComponent('pnlMessage').getComponent('message');

		//Send the written message
		
		Ext.dispatch({
			controller: 'Chat',
			action    : 'sendMessageToRoom',
			message : message.getValue(),
		});
		//Add the message panel component
	//	this.addChatMessage(message.getValue(), true);
		
		//Clear the message field
		message.setValue('');
	},

	addChatMessage: function(message, mine){

		var html = this.tplChatMessage.apply({
			time: this.getTime(),
			mine: mine,
			align: (mine ? 'right': 'left'),
			color: (mine ? '#92d841': '#d3d3d3'),
            message: message
        });

		this.store = Ext.StoreMgr.get('ChatStore');
		var msg = Ext.ModelMgr.create({user: "cueca", message: message}, 'ChatMessage');
		this.store.add(msg);
		
		var pnlMsg = new Ext.Panel({
			html: html
		});
		
	//	this.add(pnlMsg);
	//	this.doLayout();

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
	
    toggleUiBackButton: function() {


    },

    onUiBack: function() {

    },

    onNavPanelItemTap: function(subList, subIdx, el, e) {

    },

    onNavButtonTap : function() {
      //  this.navigationPanel.showBy(this.navigationButton, 'fade');
    },

    layoutOrientation : function(orientation, w, h) {
     /*   if (!Ext.is.Phone) {
            if (orientation == 'portrait') {
                this.navigationPanel.hide(false);
                this.removeDocked(this.navigationPanel, false);
                if (this.navigationPanel.rendered) {
                    this.navigationPanel.el.appendTo(document.body);
                }
                this.navigationPanel.setFloating(true);
                this.navigationPanel.setHeight(400);
                this.navigationButton.show(false);
            }
            else {
                this.navigationPanel.setFloating(false);
                this.navigationPanel.show(false);
                this.navigationButton.hide(false);
                this.insertDocked(0, this.navigationPanel);
            }
            this.navigationBar.doComponentLayout();
        }

        App.View.GroupChat.superclass.layoutOrientation.call(this, orientation, w, h); */
    }
});

Ext.reg('App.View.GroupChat', App.View.GroupChat);

