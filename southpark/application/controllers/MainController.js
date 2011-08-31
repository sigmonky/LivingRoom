var App =  Backbone.Controller.extend({	
	paneView: null,
	headerView: null,
	connection,
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
		
		/*Start XMPP this.connection */

		
	 	var startTime = null;
	 	var BOSH_SERVICE = '/http-bind';

		this.connection = new Strophe.this.connection(BOSH_SERVICE);
		
		// Strophe.log = function (lvl, msg) { log(msg); };
		this.connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);
		
		
			    // set up handler
		this.connection.addHandler(this.onResult, null, 'iq',	'result', 'disco-1', null);
		this.connection.addHandler(this.msgReceived, null, 'message', null, null,  null); 
		
		
		this.connection.rawInput = function (data) {
				log('RECV: ' + data);
			};
		
			this.connection.rawOutput = function (data) {
				log('SENT: ' + data);
			};
		
		// send disco#info to jabber.org
		var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()
		
		 this.connection.send(iq);
		//JabberClient.init(this.connection);
		
		/* All Fans View Start up */
        this.model = new models.ChatRoomModel();
		var remoteJid = '';
        var name = '';
		
		$('input[name=message]').focus();  
		this.headerView = new HeaderView({view: this});
		this.paneView = new PaneView();
		var nickname = 'guest_'+Math.floor(Math.random()*1111001);
		
		this.connection.muc.join('southpark3@conference.logoslogic.com', nickname, this.msgReceived);
		
      //  this.view = new ChatView({model: this.model, remoteJid: remoteJid, el: $('#all_fans_view'), name: name});


   //    this.view.render();

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
