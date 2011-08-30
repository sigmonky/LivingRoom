var App =  Backbone.Controller.extend({	
	paneView: null,
	headerView: null,
	
	routes: {
        "":       "index",
        "allfans":  "index",
		"myfriends": "goToMyFriends",
		"buzz":  "goToBuzz"
    },

	initialize: function() {
    
		$('input[name=message]').focus();  

		// $(function()
		// {
		// 	$('.scroll-pane').jScrollPane();
		// 	$('.friends-scroll-pane').jScrollPane();
		// 	
		// });	

		$('.mainNav').click(function(){
			$('.mainNav').each(function(item){
				$(this).css('color', '#A98A10');
			})
			$(this).css('color', '#FFF');
		})
		
		this.headerView = new HeaderView({view: this});
		this.paneView = new PaneView();
		return this;		
	},
	
    init: function (options) {
	
		var view;
		
		/*Start XMPP Connection */

		var connection = null;
	 	var startTime = null;
	 	var BOSH_SERVICE = '/http-bind';

		// connection = new Strophe.Connection(BOSH_SERVICE);
		// 
		// // Strophe.log = function (lvl, msg) { log(msg); };
		// connection.attach(Attacher.JID, Attacher.SID, Attacher.RID, onConnect);
		// 
		// 	    // set up handler
		// connection.addHandler(onResult, null, 'iq',	'result', 'disco-1', null);

		// connection.rawInput = function (data) {
		// 		log('RECV: ' + data);
		// 	};
		// 
		// 	connection.rawOutput = function (data) {
		// 		log('SENT: ' + data);
		// 	};

		// send disco#info to jabber.org
		var iq = $iq({to: 'jabber.org',	type: 'get',id: 'disco-1'}).c('query', {xmlns: Strophe.NS.DISCO_INFO}).tree()

		// connection.send(iq);

		/* All Fans View Start up */
        this.model = new models.ChatRoomModel();
		var remoteJid = '';
        var name = '';
		
		
		
      //  this.view = new ChatView({model: this.model, remoteJid: remoteJid, el: $('#all_fans_view'), name: name});


		// $(function () {
		// 	JabberClient.init(connection);
		// });
		// 
		// JabberClient.joinRoom(RoomJid)

      //  this.view.render();

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

    },

});
