var PaneView = Backbone.View.extend({
	el: $('#pane-content'),

	initialize: function() {
		_.bindAll(this, 'render', 'getScrollPane', 'renderAllFans', 'renderMyFriends', 'renderBuzz');
		var self = this;
				
	//	- when window is resized, recalc pane
		$(window).resize(function() {
			self.getScrollPane().reinitialise();
		});
		
		//
		this.render();
		return this;
	},
	
	getScrollPane: function() {
		  // return $('.scroll-pane').jScrollPane({scrollbarWidth:3}).data('jsp');
	},
	
	render: function() {
		
		/* All Fans View Begin  */
		
		var main_chat = $("#room_chat_area");
		var room = {};
		room.jid = RoomJid;
		console.log('facebook id'+Attacher.JID);
		
		if (isLoggedIn == true){
			var photo = 'https://graph.facebook.com/'+MyFacebookUser.id+'/picture';
		}else{
			var photo = 'http://www.logoslogic.com/chat/LivingRoom/southpark/images/nouser.png';
		}
		room.photo = photo;
		
		var mainChatRoom = new ChatView({model: room, jid: RoomJid});
		$(mainChatRoom.render().el).prependTo(main_chat);
		
		//this.view = new NodeChatView({model: this.model, socket: this.socket, el: $('#wrap'), userName: options.userName});
        
		/* All Fans View End  */
		
		
		/* Friends View Begin  */
		
		var roster_area = $(".friends-list");
		_.each(FriendsWhoInstalledApp.data, function(friend){
			//console.log('friend '+friend.name);
			var rowView = new FriendRosterView({model: friend});
			$(rowView.render().el).prependTo(roster_area);
		})
		
		/* Friends View End  */
		
		
		/* Buzz View Begin */
		
		var url = 'http://tweetriver.com/afrogjumps/-mtvronnie.json?';
		
		$.ajax({
		    type: "GET",
		    url: url,
		    dataType: "jsonp",
		    success: function(json) {
					// clear 
					$("#rows").html('');
					if (json && json.length > 0) {
						var $rows = $("#rows");
						_.each(json, function(item) {
							var rowView = new BuzzView({model: item});
							$(rowView.render().el).prependTo($rows);
						});
					} else {
						$("#rows").html('<div class="row"><div class="thumb"></div><div class="details">There is no tweet at this location.</div><div>');
					}
					//$('#load').fadeOut('fast');
			}
					// 
					// $("#load").remove();
					// $("#rows-content").append('<span id="load">Loading....</span>');
					// $("#load").fadeIn();		    
		});
		
		/* Buzz View End */
		
		
		return this;
	},
	
	renderAllFans: function() {
		$("#all_fans_view").css({'display': 'block', 'height': '100%'});
		$("#buzz_view").css('display', 'none');
		$("#friends_view").css('display', 'none');
	},
	
	renderMyFriends: function() {
		$("#friends_view").css({'display': 'block', 'height': '100%'});
		$("#buzz_view").css('display', 'none');
		$("#all_fans_view").css('display', 'none');
	},

	renderBuzz: function() {
		$("#buzz_view").css({'display': 'block', 'height': '100%'});
		$("#friends_view").css('display', 'none');
		$("#all_fans_view").css('display', 'none');
	},

});