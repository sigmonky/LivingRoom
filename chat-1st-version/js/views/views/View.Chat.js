Ext.ns('App.View');

App.View.GroupChat = Ext.extend(Ext.Panel, {
    fullscreen: false,
    layout: 'vbox',
    backText: 'Back',
    useTitleAsBackText: true,
    initComponent : function() {
		this.chatStore = new App.Store.Chat();
		var msg = Ext.ModelMgr.create({user: "cueca", message: "welcome"}, 'ChatMessage');
		this.chatStore.add(msg);
		this.store = Ext.StoreMgr.get('ChatStore');
	
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

        this.navigationPanel = new Ext.NestedList({
            store: App.Store.RosterStore,
            useToolbar: Ext.is.Phone ? false : true,
            updateTitleText: false,
            dock: 'left',
            hidden: !Ext.is.Phone && Ext.Viewport.orientation == 'portrait',
            toolbar: Ext.is.Phone ? this.navigationBar : null,
            listeners: {
                itemtap: this.onNavPanelItemTap,
                scope: this
            }
        });

		this.msgField = new Ext.Toolbar({
			ui: 'dark',
			dock: 'bottom',
			itemId: 'msgToolbar',
			items: [
				{
					xtype: 'textfield',
					width: '96%',
					listeners: {
						blur: function(field){
							Ext.Viewport.scrollToTop();
							//Ext.Viewport.updateBodySize();
							//App.fireEvent('newMsg', field.getValue());
							field.reset();						},
						keyup: function(fld, e){
					        if (e.browserEvent.keyCode == 13) {
					            e.stopEvent();
					            fld.fieldEl.dom.blur()
					        }
					    }
					    
					}
				}
			]
		});

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

		var config = {
			layout: 'fit',
			items: [
				{
					xtype: 'list',
					itemId: 'chatList',
					itemTpl : new Ext.XTemplate(
						'<tpl if="xindex % 2 === 0">',
						'	<img class="odd" src="http://www.gravatar.com/avatar/{facebookphoto}?s=28&d=mm" />',
						'	<p class="triangle-right left"><span class="nickname">{username}:</span> {message}</p>',
						'</tpl>',
						'<tpl if="xindex % 2 === 1">',
						'	<p class="triangle-right right"><span class="nickname">{username}:</span> {message}</p>',
						'	<img class="even" src="http://www.gravatar.com/avatar/{facebookphoto}?s=28&d=mm" />',
						'</tpl>'
					),
					store: this.store,
					scroll: 'vertical'
				}
			]
		};
		Ext.apply(this, config); 
       App.View.GroupChat.superclass.initComponent.call(this);
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

