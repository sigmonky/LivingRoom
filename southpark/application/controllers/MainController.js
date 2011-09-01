var App =  Backbone.Controller.extend({	
	paneView: null,
	headerView: null,
	connection:  null,
	routes: {
        "":       "index",
        "allfans":  "index",
		"myfriends": "goToMyFriends",
		"buzz":  "goToBuzz"
    },

	initialize: function() {
		// $('input[name=message]').focus();  
		// this.headerView = new HeaderView({view: this});
		// this.paneView = new PaneView();
		// return this;		
	},
	
    init: function (options) {
	
		var view;
		
		/*Start XMPP Connection */

		
		$(function(){
			window.chat = new Jabber.Xmpp({
		        autoConnect: false,
		        view_el_id: 'chat',
		        autoChat: true
		    });

		});

		$('input[name=message]').focus();  
		this.headerView = new HeaderView({view: this});
		this.paneView = new PaneView();

        return this;
    }, 

	index: function(){
		this.paneView.renderAllFans();
	},

	goToMyFriends: function() {
		this.paneView.renderMyFriends();
	},
	
	goToBuzz: function() {
		this.paneView.renderBuzz();
	},
	
	msgReceived: function (message) {
		console.log('msgReceived')
    },

	onResult: function (message) {
		console.log('result')

    },

});
